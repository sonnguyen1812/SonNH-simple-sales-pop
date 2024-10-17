import {
  deleted,
  getById,
  getListNotifications,
  getListNotificationsByShopDomain
} from '@functions/repositories/notificationsRepository';

import {getCurrentShop} from '@functions/helpers/auth';

export const getList = async ctx => {
  try {
    const shopId = getCurrentShop(ctx);
    const {limit, sort, page, before, after, ...searchKey} = ctx.query;

    const notificationsData = await getListNotifications(shopId, {
      before,
      after,
      limit,
      sort,
      searchKey,
      page
    });

    ctx.body = {
      data: notificationsData.data,
      count: notificationsData.count,
      pageInfo: notificationsData.pageInfo,
      success: true
    };
  } catch (err) {
    ctx.status = 400;
    console.log(err);
    ctx.body = {
      data: {},
      success: false
    };
  }
};

export const getNotificationsByShopDomain = async ctx => {
  try {
    const {shopDomain} = ctx.query;
    const notifications = await getListNotificationsByShopDomain(shopDomain);

    ctx.body = {
      data: notifications
    };
  } catch (err) {
    ctx.status = 400;
    console.log(err);
    ctx.body = {
      data: {},
      success: false
    };
  }
};

export const deletedNotification = async ctx => {
  const {id} = ctx.params;
  try {
    const notification = await deleted(id);
    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Notification deleted successfully',
      notification
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: error.message
    };
  }
};
