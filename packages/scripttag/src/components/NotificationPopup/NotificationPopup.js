import './NoticationPopup.scss';

import React from 'react';

const NotificationPopup = ({
  firstName,
  city,
  country,
  productName,
  relativeDate = 'a day ago',
  productImage,
  position,
  truncateProductName,
  hideTimeAgo
}) => {
  const wrapperClass = `Avava-SP__Wrapper fadeInUp animated Avava-SP__Wrapper--${position}`;
  const subtitleClass = truncateProductName
    ? 'Avada-SP__Subtitle text-elipsis'
    : 'Avada-SP__Subtitle';
  const timeAgo = hideTimeAgo ? 'Avada-SP__Footer--hide' : '';
  return (
    <div className={wrapperClass}>
      <div className="Avava-SP__Inner">
        <div className="Avava-SP__Container">
          <a href="#" className={'Avava-SP__LinkWrapper'}>
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
                <span className={timeAgo}>{relativeDate} </span>
                <span className="uni-blue">
                  <i className="fa fa-check" aria-hidden="true" /> by Avada
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

NotificationPopup.propTypes = {};

export default NotificationPopup;
