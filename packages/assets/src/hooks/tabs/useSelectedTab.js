import {useCallback, useState} from 'react';

export default function useSelectedTab(defaultState = 0) {
  const [tabSelected, setTabSelected] = useState(defaultState);

  const handleTabChange = useCallback(selectedTabIndex => setTabSelected(selectedTabIndex), []);

  return {
    tabSelected,
    handleTabChange
  };
}
