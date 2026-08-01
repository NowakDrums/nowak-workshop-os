import { supabaseAdmin,json } from './_lib/supabaseAdmin.js';
export default async function handler(req,res){
  try{const db=supabaseAdmin(); const {data,error}=await db.from('integration_connections').select('provider,status,display_name,last_sync_at,last_error'); if(error) throw error; return json(res,200,{connections:data||[],shopifyConfigured:Boolean(process.env.SHOPIFY_STORE_DOMAIN&&process.env.SHOPIFY_ADMIN_ACCESS_TOKEN),xeroConfigured:Boolean(process.env.XERO_CLIENT_ID&&process.env.XERO_CLIENT_SECRET)});}catch(error){return json(res,500,{error:error.message});}
}
