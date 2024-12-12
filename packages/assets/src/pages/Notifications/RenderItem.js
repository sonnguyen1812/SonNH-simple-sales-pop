import React from 'react';

import NotificationPopup from '../../../../scripttag/src/components/NotificationPopup/NotificationPopup';
import {ResourceItem} from '@shopify/polaris';
import timestampToRelativeTime from '@assets/helpers/utils/timestampToRelativeTime';

const renderItem = item => {
  const {firstName, city, productName, country, timestamp, productImage, id} = item;
  const time = timestampToRelativeTime(timestamp);

  return (
    <ResourceItem id={id}>
      <div className={'notifications'}>
        <NotificationPopup
          id={id}
          firstName={firstName}
          city={city}
          productName={productName}
          country={country}
          timestamp={timestamp}
          productImage={productImage}
          time={time}
        />
      </div>
    </ResourceItem>
  );
};

export default renderItem;
