import { supabaseAdmin,json } from '../_lib/supabaseAdmin.js';
import { verifyShopifyHmac,normaliseShopifyOrder } from '../_lib/shopify.js';

export const config={api:{bodyParser:false}};
async function raw(req){const chunks=[];for await(const c of req) chunks.push(c);return Buffer.concat(chunks);}
export default async function handler(req,res){
  if(req.method!=='POST') return json(res,405,{error:'Method not allowed'});
  try{
    const body=await raw(req);
    if(!verifyShopifyHmac(body,req.headers['x-shopify-hmac-sha256'])) return json(res,401,{error:'Invalid Shopify signature'});
    const topic=String(req.headers['x-shopify-topic']||'');
    if(!['orders/create','orders/updated','orders/paid'].includes(topic)) return json(res,200,{ok:true,ignored:topic});
    const order=normaliseShopifyOrder(JSON.parse(body.toString('utf8')));
    const db=supabaseAdmin();
    const {data:existing}=await db.from('external_orders').select('id,import_status').eq('provider','shopify').eq('external_id',order.external_id).maybeSingle();
    if(existing?.import_status && existing.import_status!=='Awaiting review') order.import_status=existing.import_status;
    const {data,error}=await db.from('external_orders').upsert(order,{onConflict:'provider,external_id'}).select().single();
    if(error) throw error;
    if(!existing){
      await db.from('app_notifications').insert({type:'new_order',title:`New Shopify order ${order.order_name||order.order_number}`,message:`${order.customer_name} · ${order.line_items.length} item${order.line_items.length===1?'':'s'} · ${order.currency} ${order.total_amount.toFixed(2)}`,entity_type:'external_order',entity_id:data.id});
    }
    await db.from('integration_connections').upsert({provider:'shopify',status:'Connected',last_sync_at:new Date().toISOString(),updated_at:new Date().toISOString()},{onConflict:'provider'});
    return json(res,200,{ok:true});
  }catch(error){return json(res,500,{error:error.message});}
}
