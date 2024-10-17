import './Notifications.css';

import {Card, Layout, Page, ResourceList} from '@shopify/polaris';
import React, {useState} from 'react';

import Empty from '@assets/components/Empty/Empty';
import renderItem from './RenderItem';
import useFilter from '@assets/hooks/form/useFilter';
import usePaginate from '@assets/hooks/api/usePaginate';

export default function Notifications() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortValue, setSortValue] = useState('desc');

  const {
    data: notifications,
    loading,
    setLoading,
    nextPage,
    prevPage,
    count,
    pageInfo,
    onQueriesChange
  } = usePaginate({
    url: '/notifications',
    defaultSort: sortValue,
    defaultLimit: 5,
    searchKey: 'productName'
  });

  const resourceName = {
    singular: 'notification',
    plural: 'notifications'
  };
  const sortNotifications = async selected => {
    setSortValue(selected);

    await onQueriesChange(
      {
        page: pageInfo.pageNumber,
        sort: selected,
        limit: 5,
        ['productName']: queryValue
      },
      true
    );
  };

  const searchChange = async value => {
    setQueryValue(value);

    setTimeout(async () => {
      await onQueriesChange(
        {
          page: 1,
          ['productName']: value,
          limit: 5,
          sort: sortValue
        },
        true
      );
    }, 3000);
  };

  const {filterControl, queryValue, setQueryValue} = useFilter({
    defaultQuery: '',
    onSearchChange: searchChange
  });

  return (
    <div className="space-bottom">
      <Page title="Notifications" subtitle="List of sales notification from Shopify">
        <Layout>
          <Layout.Section>
            <Card>
              <ResourceList
                filterControl={filterControl}
                loading={loading}
                resourceName={resourceName}
                items={notifications || []}
                totalItemsCount={count}
                renderItem={renderItem}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                selectable
                sortValue={sortValue}
                sortOptions={[
                  {label: 'Newest update', value: 'desc'},
                  {label: 'Oldest update', value: 'asc'}
                ]}
                onSortChange={selected => sortNotifications(selected)}
                pagination={{
                  hasNext: pageInfo.pageNumber < pageInfo.totalPage,
                  hasPrevious: pageInfo.pageNumber > 1,
                  label: `page ${pageInfo.pageNumber || ''} of ${pageInfo.totalPage || ''}`,
                  onNext: nextPage,
                  onPrevious: prevPage
                }}
                emptyState={<Empty />}
              />
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </div>
  );
}
