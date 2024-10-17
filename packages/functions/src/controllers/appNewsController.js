import {getAppNewsList} from '@functions/repositories/appNewsRepository';

/**
 * @param {Context|Object|*} ctx
 * @returns {Promise<void>}
 */
export const getList = async ctx => {
  const {hasNext, hasPre, ...resp} = await getAppNewsList(ctx.query);
  ctx.body = {...resp, pageInfo: {hasNext, hasPre}};
};
