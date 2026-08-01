import crypto from 'node:crypto';
import { json } from '../_lib/supabaseAdmin.js';
export default async function handler(req,res){
  const clientId=process.env.XERO_CLIENT_ID; const appUrl=(process.env.APP_URL||'').replace(/\/$/,''); const secret=process.env.XERO_STATE_SECRET||process.env.XERO_CLIENT_SECRET;
  if(!clientId||!appUrl||!secret) return json(res,400,{error:'Xero environment variables are not configured'});
  const ts=Date.now().toString(); const sig=crypto.createHmac('sha256',secret).update(ts).digest('hex'); const state=`${ts}.${sig}`;
  const params=new URLSearchParams({response_type:'code',client_id:clientId,redirect_uri:`${appUrl}/api/xero/callback`,scope:'openid profile email offline_access accounting.contacts accounting.transactions accounting.settings',state});
  res.status(302).setHeader('location',`https://login.xero.com/identity/connect/authorize?${params}`); res.end();
}
