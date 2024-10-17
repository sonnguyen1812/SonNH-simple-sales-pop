import * as appNewsController from '@functions/controllers/appNewsController';
import * as sampleController from '@functions/controllers/sampleController';
import * as shopController from '@functions/controllers/shopController';
import * as subscriptionController from '@functions/controllers/subscriptionController';

import {deletedNotification, getList} from '@functions/controllers/notificationsController';
import {get, update} from '@functions/controllers/settingsController';

import Router from 'koa-router';
import {getApiPrefix} from '@functions/const/app';

export default function apiRouter(isEmbed = false) {
  const router = new Router({prefix: getApiPrefix(isEmbed)});

  router.get('/samples', sampleController.exampleAction);
  router.get('/shops', shopController.getUserShops);
  router.get('/subscription', subscriptionController.getSubscription);
  router.get('/appNews', appNewsController.getList);

  // settings
  router.get('/settings', get);
  router.put('/settings', update);

  // notifications
  router.get('/notifications', getList);
  router.delete('/notifications/:id', deletedNotification);

  return router;
}
