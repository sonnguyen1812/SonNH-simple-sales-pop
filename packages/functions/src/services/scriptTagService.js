// functions/src/controllers/scriptTagService.js
import Shopify from 'shopify-api-node';
import appConfig from '@functions/config/app';

// Sửa lại phần xử lý scriptTag
export const scriptTagCreate = async ({shopName, accessToken}) => {
  const shopify = new Shopify({
    shopName,
    accessToken
  });

  try {
    // Xóa các script tag cũ
    const existingTags = await shopify.scriptTag.list();
    await Promise.all(existingTags.map(({id}) => shopify.scriptTag.delete(id)));

    // Tạo script tag mới với đầy đủ thông tin
    const newScriptTag = await shopify.scriptTag.create({
      event: 'onload',
      src: `https://${appConfig.baseUrl}/scripttag/index.min.js`,
      display_scope: 'online_store',
      cache: false
    });
    const newScriptTagList = await shopify.scriptTag.list();
    console.log('scriptTag:', newScriptTagList);
    return newScriptTag;
  } catch (error) {
    console.error('ScriptTag Error:', error);
    throw error;
  }
};
