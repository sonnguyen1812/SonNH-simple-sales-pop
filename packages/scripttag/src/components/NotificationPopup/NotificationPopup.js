// packages/scripttag/src/components/NotificationPopup/NotificationPopup.js
import './NoticationPopup.scss';
import {CheckIcon} from '@shopify/polaris-icons';
import {Icon} from '@shopify/polaris';

import React from 'react';
import timestampToRelativeTime from '../../../../assets/src/helpers/utils/timestampToRelativeTime';
import PropTypes from 'prop-types';

const NotificationPopup = ({
  firstName,
  city,
  country,
  productName,
  timestamp,
  relativeDate = timestampToRelativeTime(timestamp),
  productImage,
  position,
  id,
  truncateProductName,
  hideTimeAgo
}) => {
  const wrapperClass = `Avava-SP__Wrapper fadeInUp animated Avava-SP__Wrapper--${position}`;
  const subtitleClass = truncateProductName
    ? 'Avada-SP__Subtitle--text-ellipsis'
    : 'Avada-SP__Subtitle';
  const timeAgo = hideTimeAgo ? 'Avada-SP__Footer--hide-time' : '';
  return (
    <div className={wrapperClass}>
      <div className="Avava-SP__Inner">
        <div className="Avava-SP__Container">
          <div className={'Avava-SP__LinkWrapper'}>
            <div
              className="Avava-SP__Image"
              style={{
                backgroundImage: `url(${productImage})`
              }}
            />
            <div className="Avada-SP__Content">
              <div className={'Avada-SP__Title'}>
                {firstName} in {city}, {country}
              </div>
              <div className={subtitleClass}>purchased {productName}</div>
              <div className={'Avada-SP__Footer'}>
                <span className={timeAgo}>{relativeDate}</span>
                <span className="uni-blue">
                  <i>
                    <Icon source={CheckIcon} tone="info" />
                  </i>
                  by Avada
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

NotificationPopup.propTypes = {
  id: PropTypes.string.isRequired
};

export default NotificationPopup;
