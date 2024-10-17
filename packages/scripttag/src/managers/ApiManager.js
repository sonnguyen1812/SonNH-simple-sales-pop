import makeRequest from '../helpers/api/makeRequest';

export default class ApiManager {
  getNotifications = async () => {
    return this.getApiData();
  };

  getApiData = async () => {
    const shopifyDomain = window.Shopify.shop;
    const {data} = await makeRequest(
      `https://localhost:3000/clientApi/notifications?shopDomain=${shopifyDomain}`
    );

    return {settings: data.setting, notifications: data.notifications};
  };
}
