// packages/functions/src/handlers/auth.js
import 'isomorphic-fetch';

import {contentSecurityPolicy, shopifyAuth} from '@avada/core';
import {deleteWebhooks, getWebhooks, registerWebhook} from '../services/webhookService';

import App from 'koa';
import {addSetting} from '../repositories/settingsRepository';
import appConfig from '../config/app';
import createErrorHandler from '../middleware/errorHandler';
import defaultSettings from '../const/defaultSettings';
import firebase from 'firebase-admin';
import {getShopByShopifyDomain} from '@avada/shopify-auth';
import path from 'path';
import render from 'koa-ejs';
import shopifyConfig from '../config/shopify';
import {syncNotifications} from '../services/notificationService';
import {scriptTagCreate} from '@functions/services/scriptTagService';

if (firebase.apps.length === 0) {
  firebase.initializeApp();
}

// Initialize all demand configuration for an application
const app = new App();
app.proxy = true;

render(app, {
  cache: true,
  debug: false,
  layout: false,
  root: path.resolve(__dirname, '../../views'),
  viewExt: 'html'
});
app.use(createErrorHandler());
app.use(contentSecurityPolicy(true));

// Register all routes for the application
app.use(
  shopifyAuth({
    // accessTokenKey: shopifyConfig.accessTokenKey,
    apiKey: shopifyConfig.apiKey,
    firebaseApiKey: shopifyConfig.firebaseApiKey,
    scopes: shopifyConfig.scopes,
    secret: shopifyConfig.secret,
    successRedirect: '/embed',
    initialPlan: {
      id: 'free',
      name: 'Free',
      price: 0,
      trialDays: 0,
      features: {}
    },
    hostName: appConfig.baseUrl,
    isEmbeddedApp: true,
    afterInstall: async ctx => {
      try {
        // const shopifyDomain = ctx.state.shopify.shop;
        // const shop = await getShopByShopifyDomain(shopifyDomain);
        console.log('After install:');
        const {shop: shopDomain} = ctx.state.shopify;
        console.log('shopDomain:', shopDomain);
        const shop = await getShopByShopifyDomain(shopDomain);

        await Promise.all([
          addSetting({shopDomain: shopDomain, shopId: shop.id, addInfo: defaultSettings}),
          syncNotifications({
            shopDomain: shopDomain,
            accessToken: shop.accessToken,
            shopId: shop.id
          }),
          registerWebhook(
            {
              shopName: shopDomain,
              accessToken: shop.accessToken
            },
            {
              address: `https://${appConfig.baseUrl}/webhook/order/new`,
              topic: 'orders/create',
              format: 'json'
            }
          )
        ]);
      } catch (err) {
        console.log(err);
      }
    },
    afterLogin: async ctx => {
      try {
        // const shopifyDomain = ctx.state.shopify.shop;
        // const shop = await getShopByShopifyDomain(shopifyDomain);
        console.log('After login:');
        const {shop: shopDomain} = ctx.state.shopify;
        console.log('shopDomain', shopDomain);
        const shop = await getShopByShopifyDomain(shopDomain);

        await scriptTagCreate({shopName: shopDomain, accessToken: shop.accessToken});
      } catch (err) {
        console.log(err);
      }
    },
    afterThemePublish: ctx => {
      // Publish assets when theme is published or changed here
      return (ctx.body = {
        success: true
      });
    }
    // afterLogin: () => {}
  }).routes()
);

// Handling all errors
app.on('error', err => {
  console.error(err);
});

export default app;
