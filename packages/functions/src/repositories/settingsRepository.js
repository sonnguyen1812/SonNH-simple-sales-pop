import {Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();

const settingsRef = firestore.collection('settings');

export const getSetting = async shopId => {
  const snapshot = await settingsRef
    .where('shopId', '==', shopId)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))[0];
};

export const getSettingByShopDomain = async shopDomain => {
  const snapshot = await settingsRef
    .where('shopDomain', '==', shopDomain)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))[0];
};

export const updateSetting = async (shopId, updateInfo) => {
  const settingsDoc = await getSetting(shopId);
  await settingsRef.doc(settingsDoc.id).update({...updateInfo});

  return await getSetting(shopId);
};

export const addSetting = ({shopDomain, shopId, addInfo}) => {
  return settingsRef.add({shopDomain, shopId, ...addInfo});
};
