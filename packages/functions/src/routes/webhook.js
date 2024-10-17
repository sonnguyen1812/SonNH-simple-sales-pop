import Router from 'koa-router';
import {listenNewOrder} from '@functions/controllers/webhookController';

const router = new Router({
  prefix: '/webhook'
});

router.post('/order/new', listenNewOrder);

export default router;
