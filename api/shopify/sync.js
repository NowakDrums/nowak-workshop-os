import { supabaseAdmin,json } from '../_lib/supabaseAdmin.js';
import { normaliseShopifyOrder } from '../_lib/shopify.js';
export default async function handler(req,res){
  if(!['POST','GET'].includes(req.method)) return json(res,405,{error:'Method not allowed'});
  try{
    const domain=(process.env.SHOPIFY_STORE_DOMAIN||'').replace(/^https?:\/\//,'').replace(/\/$/,'');
    const token=process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    const version=process.env.SHOPIFY_API_VERSION||'2026-07';
    if(!domain||!token) return json(res,400,{error:'Shopify environment variables are not configured'});
    const query=`query Orders($first:Int!){orders(first:$first,sortKey:CREATED_AT,reverse:true){nodes{id name createdAt email phone displayFinancialStatus displayFulfillmentStatus note currentTotalPriceSet{shopMoney{amount currencyCode}} customer{firstName lastName email phone} shippingAddress{firstName lastName address1 address2 city province zip country phone} billingAddress{firstName lastName address1 address2 city province zip country phone} lineItems(first:50){nodes{id title variantTitle sku quantity originalUnitPriceSet{shopMoney{amount currencyCode}} customAttributes{key value} product{id} variant{id}}}}}}`;
    const response=await fetch(`https://${domain}/admin/api/${version}/graphql.json`,{method:'POST',headers:{'content-type':'application/json','X-Shopify-Access-Token':token},body:JSON.stringify({query,variables:{first:50}})});
    const payload=await response.json();
    if(!response.ok||payload.errors) throw new Error(payload.errors?.map(e=>e.message).join(' | ')||`Shopify ${response.status}`);
    const db=supabaseAdmin(); let imported=0;
    for(const raw of payload.data.orders.nodes){
      const order=normaliseShopifyOrder(raw);
      const {data:existing}=await db.from('external_orders').select('import_status').eq('provider','shopify').eq('external_id',order.external_id).maybeSingle();
      if(existing?.import_status && existing.import_status!=='Awaiting review') order.import_status=existing.import_status;
      const {error}=await db.from('external_orders').upsert(order,{onConflict:'provider,external_id'}); if(error) throw error; imported++;
    }
    await db.from('integration_connections').upsert({provider:'shopify',status:'Connected',display_name:domain,last_sync_at:new Date().toISOString(),updated_at:new Date().toISOString()},{onConflict:'provider'});
    return json(res,200,{ok:true,imported});
  }catch(error){return json(res,500,{error:error.message});}
}
