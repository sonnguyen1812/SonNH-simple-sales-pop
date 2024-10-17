import {
  createNotification,
  getNotificationByOrderId
} from '@functions/repositories/notificationsRepository';

import Shopify from 'shopify-api-node';
import {getNotificationItems} from '@functions/services/apiService';
import {getShopByShopifyDomain} from '@avada/shopify-auth';

export const createShopifyInstance = ({shopName, accessToken}) => {
  return new Shopify({
    shopName,
    accessToken
  });
};

export const registerWebhook = ({shopName, accessToken}, {address, topic, format}) => {
  const shopify = createShopifyInstance({shopName, accessToken});
  return shopify.webhook.create({address, topic, format});
};

export const getWebhooks = ({shopName, accessToken}, params = []) => {
  const shopify = createShopifyInstance({shopName, accessToken});
  return shopify.webhook.list(params);
};

export const deleteWebhook = ({shopName, accessToken}, id) => {
  const shopify = createShopifyInstance({shopName, accessToken});
  return shopify.webhook.delete(id);
};

export const deleteWebhooks = ({shopName, accessToken}, ids) => {
  return Promise.all(ids.map(id => deleteWebhook({shopName, accessToken}, id)));
};

export const scriptTagCreate = ({shopName, accessToken}) => {
  const shopify = createShopifyInstance({shopName, accessToken});
  return shopify.scriptTag.create({
    script_tag: {
      event: 'onload',
      src: 'https://localhost:3000/scripttag/avada-sale-pop.min.js'
    }
  });
};

export const processOrder = async (orderData, shopifyDomain) => {
  const shop = await getShopByShopifyDomain(shopifyDomain);

  const [notification] = await getNotificationItems({
    shopId: shop.id,
    shopDomain: shopifyDomain,
    accessToken: shop.accessToken,
    orderData: [orderData]
  });

  const existNotification = await getNotificationByOrderId(notification.orderId);

  if (!existNotification) {
    await createNotification(notification);
  }
};
