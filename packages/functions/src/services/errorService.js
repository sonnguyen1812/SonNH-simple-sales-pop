import {getCurrentUser} from '@functions/helpers/auth';

/**
 * @param {*} err
 * @param {*} ctx
 * @return {Promise<void>}
 */
export function handleError(err, ctx) {
  const currentUser = getCurrentUser(ctx);

  if (currentUser) {
    const {shopID, shop} = currentUser;
    const shopifyDomain = shop ? shop.shopifyDomain : null;
    console.error('Error handled ===', shopID, '===', shopifyDomain, '===', err);
  } else {
    console.error('Unauthenticated', err);
  }
}
