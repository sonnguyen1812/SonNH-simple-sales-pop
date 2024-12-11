import React from 'react';

import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup';
import {ResourceItem} from '@shopify/polaris';
import timestampToRelativeTime from '@assets/helpers/utils/timestampToRelativeTime';

const renderItem = item => {
  const {firstName, city, productName, country, timestamp, productImage, id} = item;
  const time = timestampToRelativeTime(timestamp);

  return (
    <ResourceItem id={id}>
      <NotificationPopup
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
