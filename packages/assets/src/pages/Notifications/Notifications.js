import './Notifications.css';

import {Card, Layout, Page, ResourceList} from '@shopify/polaris';
import React, {useState} from 'react';

import Empty from '@assets/components/Empty/Empty';
import renderItem from './RenderItem';
import useFilter from '@assets/hooks/form/useFilter';
import usePaginate from '@assets/hooks/api/usePaginate';
import useActiveToast from '@assets/hooks/toast/useActiveToast';
import {api} from '@assets/helpers';
import useConfirmModal from '@assets/hooks/popup/useConfirmModal';
import useModal from '@assets/hooks/popup/useModal';

export default function Notifications() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortValue, setSortValue] = useState('desc');
  const [loading, setLoading] = useState(false);
  const {toastMarkup, handleActiveToastChange} = useActiveToast(false, '');

  const {
    data: notifications,
    loading: pageLoading,
    setLoading: setPageLoading,
    nextPage,
    prevPage,
    count,
    pageInfo,
    onQueriesChange,
    fetchApi
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

  // Giữ nguyên hàm cũ
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

  // Giữ nguyên hàm cũ
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

  // Giữ nguyên hook filter
  const {filterControl, queryValue, setQueryValue} = useFilter({
    defaultQuery: '',
    onSearchChange: searchChange
  });

  // Thêm hàm xử lý bulk delete
  const handleBulkDelete = async () => {
    try {
      setLoading(true);
      await Promise.all(
        selectedItems.map(id =>
          api(`/notifications/${id}`, {
            method: 'DELETE'
          })
        )
      );
      setSelectedItems([]);
      await onQueriesChange(
        {
          page: 1,
          limit: 5,
          sort: sortValue
        },
        true
      );

      closeModal();
      handleActiveToastChange('Delete successfully');
    } catch (error) {
      console.error('Bulk delete error:', error);
      handleActiveToastChange('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  // Thêm confirm modal
  const {modal, openModal, closeModal} = useModal({
    title: 'Delete notifications',
    content: `Are you sure you want to delete ${selectedItems.length} notifications? This cannot be undone.`,
    destructive: true,
    confirmAction: handleBulkDelete,
    primaryAction: {
      content: 'Delete',
      loading: loading,
      destructive: true,
      onAction: handleBulkDelete
    }
  });

  // Thêm bulk actions
  const bulkActions = [
    {
      content: `Delete ${selectedItems.length} notifications`,
      onAction: openModal,
      destructive: true
    }
  ];

  return (
    <div className="space-bottom">
      <Page title="Notifications" subtitle="List of sales notification from Shopify">
        <Layout>
          <Layout.Section>
            <Card>
              <ResourceList
                filterControl={filterControl}
                loading={pageLoading}
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
                bulkActions={bulkActions}
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
        {toastMarkup}
      </Page>
      {modal}
    </div>
  );
}
