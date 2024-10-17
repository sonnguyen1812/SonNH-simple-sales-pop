import {Timestamp} from '@google-cloud/firestore/build/src';
import {createShopifyInstance} from '@functions/services/webhookService';
import onlyUnique from '@functions/helpers/utils/onlyUnique';

export const getOrderDatas = async ({shopifyDomain, accessToken, limit, fields}) => {
  const shopify = createShopifyInstance({shopName: shopifyDomain, accessToken});

  return await shopify.order.list({
    limit: limit,
    fields: fields
  });
};

export const getNotificationItems = async ({shopId, shopDomain, orderData, accessToken}) => {
  const shopify = createShopifyInstance({shopName: shopDomain, accessToken});

  const productIds = Array.isArray(orderData)
    ? orderData.map(order => order.line_items[0].product_id)
    : [orderData.line_items[0].product_id];

  const uniqueProductIds = productIds.filter((value, index, self) => self.indexOf(value) === index);
  const fields = 'id,title,image';
  const products = await shopify.product.list({ids: uniqueProductIds.join(','), fields});

  return orderData.map(order => {
    const product = products.find(product => product.id === order.line_items[0].product_id);
    const {id, customer, created_at, line_items} = order;
    const {default_address, first_name} = customer;
    const {city, country} = default_address;
    const {product_id, name} = line_items[0];

    return {
      orderId: id,
      city: city,
      firstName: first_name,
      country: country,
      productId: product_id,
      productName: name,
      timestamp: Timestamp.fromDate(new Date(created_at)),
      productImage: product ? product.image.src : null,
      shopId: shopId,
      shopDomain: shopDomain
    };
  });
};
