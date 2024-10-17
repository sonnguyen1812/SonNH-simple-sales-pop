import Router from 'koa-router';
import {get} from '@functions/controllers/clientApiController';

const router = new Router({
  prefix: '/clientApi'
});

router.get('/notifications', get);

export default router;
