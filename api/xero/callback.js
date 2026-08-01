import crypto from 'node:crypto';
import { supabaseAdmin } from '../_lib/supabaseAdmin.js';
export default async function handler(req,res){
  const appUrl=(process.env.APP_URL||'').replace(/\/$/,'');
  try{
    const {code,state}=req.query; const secret=process.env.XERO_STATE_SECRET||process.env.XERO_CLIENT_SECRET; const [ts,sig]=String(state||'').split('.');
    const expected=crypto.createHmac('sha256',secret).update(ts).digest('hex'); if(!sig||sig!==expected||Date.now()-Number(ts)>15*60*1000) throw new Error('Invalid Xero connection state');
    const body=new URLSearchParams({grant_type:'authorization_code',code,redirect_uri:`${appUrl}/api/xero/callback`});
    const basic=Buffer.from(`${process.env.XERO_CLIENT_ID}:${process.env.XERO_CLIENT_SECRET}`).toString('base64');
    const tokenRes=await fetch('https://identity.xero.com/connect/token',{method:'POST',headers:{authorization:`Basic ${basic}`,'content-type':'application/x-www-form-urlencoded'},body});
    const tokens=await tokenRes.json(); if(!tokenRes.ok) throw new Error(tokens.error_description||tokens.error||'Xero token exchange failed');
    const connRes=await fetch('https://api.xero.com/connections',{headers:{authorization:`Bearer ${tokens.access_token}`}}); const connections=await connRes.json(); const tenant=connections?.[0];
    const db=supabaseAdmin(); await db.from('integration_connections').upsert({provider:'xero',status:'Connected',display_name:tenant?.tenantName||'Xero',external_account_id:tenant?.tenantId||'',secret_data:tokens,last_sync_at:new Date().toISOString(),updated_at:new Date().toISOString()},{onConflict:'provider'});
    res.status(302).setHeader('location',`${appUrl}/?integration=xero-connected`); res.end();
  }catch(error){res.status(302).setHeader('location',`${appUrl}/?integration=xero-error&message=${encodeURIComponent(error.message)}`);res.end();}
}
