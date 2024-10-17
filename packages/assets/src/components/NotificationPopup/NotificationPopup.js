import './NoticationPopup.scss';
import '@shopify/polaris/build/esm/styles.css';

import {CheckIcon, XIcon} from '@shopify/polaris-icons';
import {Icon, TextContainer, Tooltip} from '@shopify/polaris';

import PropTypes from 'prop-types';
import React from 'react';
import timestampToDate from '@assets/helpers/utils/timestampToDate';

const NotificationPopup = ({
  firstName,
  city,
  productName,
  country,
  timestamp,
  productImage,
  time,
  onDeleteNotification,
  id
}) => {
  const formattedDate = timestampToDate(timestamp);
  const handleDelete = () => {
    onDeleteNotification(id);
  };

  return (
    <div className="Avava-SP__Wrapper fadeInUp animated">
      <div className="Avava-SP__Inner">
        <div className="Avava-SP__Container">
          <a href="#" className={'Avava-SP__LinkWrapper'}>
            <div
              className="Avava-SP__Image"
              style={{
                backgroundImage: `url(${productImage})`
              }}
            ></div>
            <div className="Avada-SP__Content">
              <div className={'Avada-SP__Title'}>
                {firstName} in {city}, {country}
              </div>
              <div className={'Avada-SP__Subtitle'}>purchased {productName}</div>
              <div className={'Avada-SP__Footer'}>
                {time}{' '}
                <span className="uni-blue">
                  <i>
                    <Icon source={CheckIcon} tone="info" />
                  </i>
                  by Avada
                </span>
              </div>
            </div>
          </a>
          <div className="close-btn" onClick={handleDelete}>
            <Tooltip content="Delete notification">
              <TextContainer>
                <Icon source={XIcon} color="critical" accessibilityLabel="Delete" />
              </TextContainer>
            </Tooltip>
          </div>
        </div>
      </div>
      <div>{formattedDate !== 'Invalid Date' ? formattedDate : ''}</div>
    </div>
  );
};

NotificationPopup.propTypes = {
  onDeleteNotification: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default NotificationPopup;
