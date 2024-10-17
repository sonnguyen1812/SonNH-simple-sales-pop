import {getListNotificationsByShopDomain} from '@functions/repositories/notificationsRepository';
import {getSettingByShopDomain} from '@functions/repositories/settingsRepository';

export const get = async ctx => {
  try {
    const {shopDomain} = ctx.query;
    const [setting, notifications] = await Promise.all([
      getSettingByShopDomain(shopDomain),
      getListNotificationsByShopDomain(shopDomain)
    ]);

    ctx.body = {
      data: {
        setting,
        notifications
      }
    };
  } catch (err) {
    console.error(err);
    ctx.status = 404;
    ctx.body = {
      data: {},
      success: false
    };
  }
};
