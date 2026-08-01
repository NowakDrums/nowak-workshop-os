import crypto from 'node:crypto';

export function verifyShopifyHmac(rawBody,header){
  const secret=process.env.SHOPIFY_WEBHOOK_SECRET || '';
  if(!secret || !header) return false;
  const digest=crypto.createHmac('sha256',secret).update(rawBody).digest('base64');
  const a=Buffer.from(digest); const b=Buffer.from(String(header));
  return a.length===b.length && crypto.timingSafeEqual(a,b);
}

export function normaliseShopifyOrder(order){
  const shipping=order.shipping_address || order.shippingAddress || {};
  const billing=order.billing_address || order.billingAddress || {};
  const customer=order.customer || {};
  const lineItems=(order.line_items || order.lineItems?.nodes || []).map((item,index)=>({
    id:String(item.id || index),
    title:item.title || item.name || 'Item',
    variant_title:item.variant_title || item.variantTitle || '',
    sku:item.sku || item.variant?.sku || '',
    quantity:Number(item.quantity || 1),
    price:Number(item.price || item.originalUnitPriceSet?.shopMoney?.amount || 0),
    properties:item.properties || item.customAttributes || [],
    product_id:item.product_id || item.product?.id || null,
    variant_id:item.variant_id || item.variant?.id || null,
  }));
  const externalId=String(order.id || order.admin_graphql_api_id || order.legacyResourceId);
  const total=Number(order.total_price || order.totalPriceSet?.shopMoney?.amount || order.currentTotalPriceSet?.shopMoney?.amount || 0);
  const currency=order.currency || order.currencyCode || order.totalPriceSet?.shopMoney?.currencyCode || 'AUD';
  const first=customer.first_name || customer.firstName || shipping.first_name || shipping.firstName || '';
  const last=customer.last_name || customer.lastName || shipping.last_name || shipping.lastName || '';
  return {
    provider:'shopify', external_id:externalId,
    order_number:String(order.order_number || order.name || order.displayName || externalId),
    order_name:order.name || order.displayName || '',
    customer_name:`${first} ${last}`.trim() || order.email || 'Shopify customer',
    customer_email:order.email || customer.email || '',
    customer_phone:order.phone || customer.phone || shipping.phone || '',
    shipping_address:shipping,
    billing_address:billing,
    line_items:lineItems,
    notes:order.note || order.note_attributes || order.customAttributes || '',
    financial_status:order.financial_status || order.displayFinancialStatus || '',
    fulfilment_status:order.fulfillment_status || order.displayFulfillmentStatus || '',
    total_amount:total,currency,
    ordered_at:order.created_at || order.createdAt || new Date().toISOString(),
    raw_payload:order,
    import_status:'Awaiting review',
    updated_at:new Date().toISOString(),
  };
}
