import {LegacyFilters, Select} from '@shopify/polaris';
import React, {useState} from 'react';

export default function useFilter({searchWith = [], defaultQuery = '', onSearchChange}) {
  const [queryValue, setQueryValue] = useState(defaultQuery);
  // const [searchSelected, setSearchSelected] = useState(searchWith[0] || '');

  const filters = [
    // {
    //   key: 'searchKey',
    //   label: searchSelected || 'Search with',
    //   filter: (
    //     <Select
    //       label={'Search with'}
    //       options={searchWith}
    //       value={searchSelected}
    //       onChange={setSearchSelected}
    //     />
    //   ),
    //   shortcut: true
    // }
  ];

  const filterControl = (
    <LegacyFilters
      queryValue={queryValue}
      filters={filters}
      onQueryChange={value => onSearchChange(value)}
      onQueryClear={() => {
        onSearchChange('');
      }}
      onClearAll={() => setQueryValue('')}
    ></LegacyFilters>
  );

  return {filterControl, queryValue, setQueryValue};
}
