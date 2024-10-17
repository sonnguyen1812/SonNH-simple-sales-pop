import {Firestore} from '@google-cloud/firestore';
import {parseIntoInt} from '@functions/helpers/utils/parseIntoInt';

const firestore = new Firestore();

const notificationsRef = firestore.collection('notifications');

export const getListNotifications = async (
  shopId,
  {before, after, limit, sort, searchKey, page}
) => {
  let query = notificationsRef;

  const searchField = Object.keys(searchKey)[0];
  const searchTerm = Object.values(searchKey)[0];
  if (searchField && searchTerm) {
    query = query
      .where(searchField, '>=', searchTerm)
      .where(searchField, '<=', searchTerm + '\uf8ff');
  }

  query = query.orderBy('timestamp', sort || 'desc');

  const limitInt = parseIntoInt(limit);
  const pageInt = parseIntoInt(page);

  const totalSnapshot = await query.count().get();
  const totalCount = Math.ceil(totalSnapshot.data().count / limitInt);

  if (!isNaN(limitInt) && !isNaN(pageInt)) {
    const startIndex = (pageInt - 1) * limitInt;
    query = query.offset(startIndex).limit(limitInt);
  }

  const snapshot = await query.get();
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return {
    data: data || [],
    count: totalSnapshot.data().count,
    pageInfo: {
      pageNumber: parseIntoInt(page),
      totalPage: totalCount
    }
  };
};

export const getListNotificationsByShopDomain = async shopDomain => {
  const snapshot = await notificationsRef
    .where('shopDomain', '==', shopDomain)
    .orderBy('timestamp', 'desc')
    .get();

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getNotificationByOrderId = async orderId => {
  const snapshot = await notificationsRef.where('orderId', '==', orderId).get();

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const createNotification = async notification => {
  return await notificationsRef.add({...notification});
};

export const createNotifications = async notArr => {
  return Promise.all(
    notArr.map(async not => {
      return createNotification(not);
    })
  );
};

export const deleted = async id => {
  const snapshot = await notificationsRef.doc(id).delete();
  return snapshot;
};

export const deleteNotifications = async ids => {
  return Promise.all(
    ids.map(async id => {
      return deleteNotification(id);
    })
  );
};
