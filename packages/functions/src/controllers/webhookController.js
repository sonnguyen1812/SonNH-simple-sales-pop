import {processOrder} from '../services/webhookService';

export const listenNewOrder = async ctx => {
  try {
    const shopifyDomain = ctx.get('X-Shopify-Shop-Domain');
    const orderData = ctx.request.body;


    await processOrder(orderData, shopifyDomain);
    ctx.body = {success: true};
  } catch (err) {
    console.error(err);
    ctx.body = {success: false};
  }
};
