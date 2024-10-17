import {getNotificationItems, getOrderDatas} from '@functions/services/apiService';

import {createNotifications} from '@functions/repositories/notificationsRepository';

export const syncNotifications = async ({shopDomain, accessToken, shopId}) => {
  const orderDatas = await getOrderDatas({
    shopifyDomain: shopDomain,
    accessToken,
    limit: 30,
    fields: 'customer,line_items,created_at,id'
  });
  console.log(`Order count: ${orderDatas.length}`);
  const listNotifications = await getNotificationItems({
    shopId,
    shopDomain,
    orderData: orderDatas,
    accessToken
  });
  console.log(`Notification count: ${listNotifications.length}`);

  await createNotifications(listNotifications);
};
