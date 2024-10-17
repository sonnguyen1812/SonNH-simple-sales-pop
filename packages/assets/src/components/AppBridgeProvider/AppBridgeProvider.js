import React, {useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {NavigationMenu, Provider} from '@shopify/app-bridge-react';
import {useHistory, useLocation} from 'react-router-dom';
import {getUrl} from '@assets/helpers/getUrl';

export default function AppBridgeProvider({children}) {
  const {push} = useHistory();
  const location = useLocation();
  const [appBridgeConfig] = useState(() => {
    const localStorageHost = localStorage.getItem('avada-dev-host');
    const host = new URLSearchParams(location.search).get('host') || localStorageHost;
    localStorage.setItem('avada-dev-host', host);

    return {
      host,
      apiKey: import.meta.env.VITE_SHOPIFY_API_KEY,
      forceRedirect: true
    };
  });
  const history = useMemo(() => ({replace: path => push(path, {replace: true})}), [push]);
  const router = useMemo(() => ({location, history}), [location, history]);

  return (
    <Provider router={router} config={appBridgeConfig}>
      <NavigationMenu
        matcher={(link, location) => {
          return getUrl(link.destination) === location.pathname;
        }}
        navigationLinks={[
          {
            label: 'Notifications',
            destination: '/notifications'
          },
          {
            label: 'Settings',
            destination: '/settings'
          }
        ]}
      />
      {children}
    </Provider>
  );
}

AppBridgeProvider.propTypes = {
  children: PropTypes.any
};
