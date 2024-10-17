import processOrder from '../services/webhookService';

export const listenNewOrder = async ctx => {
  try {
    const orderData = ctx.request.body;
    const shopifyDomain = ctx.get('X-Shopify-Shop-Domain');

    await processOrder(orderData, shopifyDomain);
    ctx.body = {success: true};
  } catch (err) {
    console.error(err);
    ctx.body = {success: false};
  }
};
