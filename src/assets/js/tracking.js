'use strict';
window.dataLayer = window.dataLayer || [];
function nesticaTrack(event, payload = {}) {
  // No names, phone numbers, addresses or free-text notes are sent to analytics.
  window.dataLayer.push({ event, ...payload });
}
function nesticaProductEvent(event, product, quantity = 1) {
  const qty = Math.max(1, Math.floor(Number(quantity) || 1));
  const price = Number(product.price) || 0;
  const params = {content_ids: [String(product.id)], content_name: product.name,
    content_type: 'product', value: price * qty, currency: 'EGP', num_items: qty};
  if (typeof fbq === 'function') fbq('track', event, params);
  if (window.ttq && typeof window.ttq.track === 'function') window.ttq.track(event, {
    contents: [{content_id: String(product.id), content_type: 'product', content_name: product.name,
      quantity: qty, price}], value: price * qty, currency: 'EGP'});
  nesticaTrack(event === 'ViewContent' ? 'view_item' : 'add_to_cart', {
    ecommerce: {currency: 'EGP', value: price * qty,
      items: [{item_id: String(product.id), item_name: product.name, price, quantity: qty}]}});
}
document.addEventListener('DOMContentLoaded', () => {
  if (window.nesticaProductMeta) nesticaProductEvent('ViewContent', window.nesticaProductMeta);
});
