import makeRequest from '../helpers/api/makeRequest';

export default class ApiManager {
  getNotifications = async () => {
    return this.getApiData();
  };

  getApiData = async () => {
    const shopifyDomain = window.Shopify.shop;
    const {data} = await makeRequest(
      `http://localhost:5000/clientApi/notifications?shopDomain=${shopifyDomain}`
    );
    // http://localhost:5000/clientApi/notifications?shopDomain=avada-first-app-store.myshopify.com

    return {settings: data.setting, notifications: data.notifications};
  };
}
