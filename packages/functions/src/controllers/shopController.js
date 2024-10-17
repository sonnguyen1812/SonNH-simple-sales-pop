import {getCurrentShop} from '../helpers/auth';
import {getShopById} from '@functions/repositories/shopRepository';
import {getShopInfoByShopId} from '@functions/repositories/shopInfoRepository';

/**
 * @param ctx
 * @returns {Promise<{shop, shopInfo: *}>}
 */
export const getUserShops = async ctx => {
  const shopId = getCurrentShop(ctx);
  const [shop, shopInfo] = await Promise.all([getShopById(shopId), getShopInfoByShopId(shopId)]);
  ctx.body = {shop, shopInfo};
};
