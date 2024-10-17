import React, {useState} from 'react';

import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup';
import {ResourceItem} from '@shopify/polaris';
import {api} from '../../helpers';
import timestampToRelativeTime from '@assets/helpers/utils/timestampToRelativeTime';
import useFetchApi from '@assets/hooks/api/useFetchApi';

const renderItem = item => {
  const {firstName, city, productName, country, timestamp, productImage, id} = item;
  const time = timestampToRelativeTime(timestamp);
  // const {data: notifications, setData: setNotifications} = useFetchApi({
  //   url: '/notifications'
  // });
  // const [fetched, setFetched] = useState(false);
  // const [loading, setLoading] = useState(false);

  const handleDeleteNotification = async () => {
    try {
      setLoading(true);
      const res = await api(`/notifications/${id}`, {
        method: 'DELETE'
      });
      // setData([...notifications, setNotifications]);
      // setLoading(false);
      // setFetched(true);
      if (!res.ok) {
        throw new Error('Failed to delete notification');
      }
      console.log('Notification deleted:', id);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <ResourceItem id={id}>
      <NotificationPopup
        onDeleteNotification={handleDeleteNotification}
        id={id}
        firstName={firstName}
        city={city}
        productName={productName}
        country={country}
        // loading={loading}
        // fetched={fetched}
        timestamp={timestamp}
        productImage={productImage}
        time={time}
      />
    </ResourceItem>
  );
};

export default renderItem;
