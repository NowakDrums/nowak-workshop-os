import { json } from '../_lib/supabaseAdmin.js';
export default async function handler(req,res){
  if(req.method!=='POST') return json(res,405,{error:'Method not allowed'});
  try{
    const domain=(process.env.SHOPIFY_STORE_DOMAIN||'').replace(/^https?:\/\//,'').replace(/\/$/,'');
    const token=process.env.SHOPIFY_ADMIN_ACCESS_TOKEN; const version=process.env.SHOPIFY_API_VERSION||'2026-07';
    const appUrl=(process.env.APP_URL||'').replace(/\/$/,'');
    if(!domain||!token||!appUrl) return json(res,400,{error:'SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_ACCESS_TOKEN and APP_URL are required'});
    const mutation=`mutation CreateWebhook($topic:WebhookSubscriptionTopic!,$webhookSubscription:WebhookSubscriptionInput!){webhookSubscriptionCreate(topic:$topic,webhookSubscription:$webhookSubscription){webhookSubscription{id topic uri} userErrors{field message}}}`;
    const results=[];
    for(const topic of ['ORDERS_CREATE','ORDERS_UPDATED','ORDERS_PAID']){
      const r=await fetch(`https://${domain}/admin/api/${version}/graphql.json`,{method:'POST',headers:{'content-type':'application/json','X-Shopify-Access-Token':token},body:JSON.stringify({query:mutation,variables:{topic,webhookSubscription:{uri:`${appUrl}/api/shopify/webhook`,format:'JSON'}}})});
      const p=await r.json(); results.push(p);
    }
    return json(res,200,{ok:true,results});
  }catch(error){return json(res,500,{error:error.message});}
}
