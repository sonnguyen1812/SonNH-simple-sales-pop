import './settings.css';

import {
  Card,
  Checkbox,
  FormLayout,
  Frame,
  InlineGrid,
  Layout,
  LegacyCard,
  Page,
  Select,
  SkeletonBodyText,
  SkeletonDisplayText,
  Tabs,
  TextContainer
} from '@shopify/polaris';
import React, {useState} from 'react';

import DesktopPositionInput from '@assets/components/DesktopPositionInput/DesktopPositionInput';
import NotificationPopup from '../../../../scripttag/src/components/NotificationPopup/NotificationPopup';
import PageInput from '@assets/components/PageInput/PageInput';
import SliderRange from '@assets/components/SliderRange/SliderRange';
import {api} from '@assets/helpers';
import defaultSettings from '@assets/const/defaultSettings';
import useActiveToast from '@assets/hooks/toast/useActiveToast';
import useModal from '@assets/hooks/popup/useModal';
import useGetApi from '@assets/hooks/api/useGetApi';
import useSelectedTab from '@assets/hooks/tabs/useSelectedTab';

/**
 * @return {JSX.Element}
 */
export default function Settings() {
  const {tabSelected, handleTabChange} = useSelectedTab(0);
  const {toastMarkup, handleActiveToastChange} = useActiveToast(false, '');
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const {data: settings, setData: setSettings, fetched, setFetched} = useGetApi({
    url: '/settings',
    defaultData: defaultSettings,
    onSuccess: () => {
      setIsInitialLoading(false);
    }
  });

  console.log(settings);

  const handleSaveSettings = async () => {
    try {
      if (fetched) {
        handleActiveToastChange('Your setting is not change');
        closeModal();
        return;
      }

      setLoading(true);
      const res = await api('/settings', {
        method: 'PUT',
        body: {data: settings}
      });

      if (res && res.data) {
        // Đảm bảo cập nhật state với toàn bộ dữ liệu trả về
        setSettings(prevSettings => ({
          ...prevSettings, // Giữ lại các giá trị cũ
          ...res.data // Cập nhật với dữ liệu mới
        }));

        setFetched(true);
        closeModal();
        handleActiveToastChange('Save successfully');
      }
    } catch (err) {
      console.error('Save settings error:', err);
      handleActiveToastChange('Save failed');
    } finally {
      setLoading(false);
    }
  };

  const {modal, openModal, closeModal} = useModal({
    title: 'Save change',
    content: 'Do you want to update your setting change',
    confirmAction: handleSaveSettings,
    primaryAction: {
      content: 'Save',
      loading: loading,
      onAction: handleSaveSettings
    }
  });

  const handleSettingsChange = (key, value) => {
    setFetched(false);
    setSettings(prevSettings => {
      const newSettings = {
        ...prevSettings,
        [key]: value
      };
      // Log để debug
      console.log('Settings after change:', newSettings);
      return newSettings;
    });
  };

  const SkeletonSettings = () => {
    return (
      <Layout>
        <Layout.Section variant={'oneThird'}>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </TextContainer>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <LegacyCard.Section>
              <TextContainer>
                <SkeletonDisplayText size="small" />
              </TextContainer>
            </LegacyCard.Section>
            <LegacyCard.Section>
              <SkeletonBodyText lines={3} />
            </LegacyCard.Section>
            <LegacyCard.Section>
              <SkeletonBodyText lines={3} />
            </LegacyCard.Section>
            <LegacyCard.Section>
              <SkeletonBodyText lines={1} />
            </LegacyCard.Section>
            <LegacyCard.Section></LegacyCard.Section>
            <LegacyCard.Section>
              <SkeletonBodyText lines={3} />
            </LegacyCard.Section>
            <LegacyCard.Section>
              <SkeletonBodyText lines={3} />
            </LegacyCard.Section>
            <LegacyCard.Section></LegacyCard.Section>
            <LegacyCard.Section>
              <SkeletonBodyText lines={3} />
            </LegacyCard.Section>
            <LegacyCard.Section>
              <SkeletonBodyText lines={3} />
            </LegacyCard.Section>
            <LegacyCard.Section>
              <SkeletonBodyText lines={1} />
            </LegacyCard.Section>
          </Card>
        </Layout.Section>
      </Layout>
    );
  };

  const pageOptions = [
    {
      label: 'All pages',
      value: 'all',
      body: (
        <LegacyCard.Section key={0}>
          <PageInput
            label={'Excluded pages'}
            value={settings.excludedUrls}
            handleChange={newValue => handleSettingsChange('excludedUrls', newValue)}
            line={4}
          />
        </LegacyCard.Section>
      )
    },
    {
      label: 'Specific page',
      value: 'specific',
      body: (
        <LegacyCard.Section key={1}>
          <PageInput
            label={'Included pages'}
            value={settings.includedUrls}
            handleChange={newValue => handleSettingsChange('includedUrls', newValue)}
            line={4}
          />
          <br />
          <PageInput
            label={'Excluded pages'}
            value={settings.excludedUrls}
            handleChange={newValue => handleSettingsChange('excludedUrls', newValue)}
            line={4}
          />
        </LegacyCard.Section>
      )
    }
  ];

  const tabs = [
    {
      id: 'Display',
      content: 'Display',
      body: (
        <FormLayout>
          <LegacyCard.Section title="APPEARANCE">
            <DesktopPositionInput
              label="Desktop position"
              value={settings.position}
              onChange={newValue => handleSettingsChange('position', newValue)}
              helpText="The display position of the pop on your website"
            />
          </LegacyCard.Section>
          <LegacyCard.Section>
            <Checkbox
              label="Hide time ago"
              checked={settings.hideTimeAgo}
              onChange={newValue => handleSettingsChange('hideTimeAgo', newValue)}
            />
            <Checkbox
              label="Truncate context text"
              helpText="If you product a name is long for one line, it will be truncate to 'Product na...'"
              checked={settings.truncateProductName}
              onChange={newValue => handleSettingsChange('truncateProductName', newValue)}
            />
          </LegacyCard.Section>
          <LegacyCard.Section title="TIMING">
            <InlineGrid columns={2} gap={400}>
              <SliderRange
                label="Display duration"
                min={0}
                max={360}
                helpText="How long each pop will display on your page."
                unit="second"
                rangeValue={settings.displayDuration}
                handleRangeSliderChange={newValue =>
                  handleSettingsChange('displayDuration', newValue)
                }
              />
              <SliderRange
                label="Time before first pop"
                min={0}
                max={360}
                helpText="The delay time before the first notification."
                unit="second"
                rangeValue={settings.firstDelay}
                handleRangeSliderChange={newValue => handleSettingsChange('firstDelay', newValue)}
              />
              <SliderRange
                label="Gap time between two pops"
                min={0}
                max={360}
                helpText="The time interval between two popups notifications"
                unit="second"
                rangeValue={settings.popsInterval}
                handleRangeSliderChange={newValue => handleSettingsChange('popsInterval', newValue)}
              />
              <SliderRange
                label="Maximum of popups"
                min={0}
                max={80}
                helpText="The maximum number of popups allowed to show after page loading. Maximum number is 80."
                unit="pop"
                rangeValue={settings.maxPopsDisplay}
                handleRangeSliderChange={newValue =>
                  handleSettingsChange('maxPopsDisplay', newValue)
                }
              />
            </InlineGrid>
          </LegacyCard.Section>
        </FormLayout>
      )
    },
    {
      id: 'Triggers',
      content: 'Triggers',
      body: (
        <FormLayout>
          <LegacyCard.Section>
            <Select
              label="PAGE RESTRICTION"
              options={[
                ...pageOptions.map(pageOption => ({
                  label: pageOption.label,
                  value: pageOption.value
                }))
              ]}
              value={settings.allowShow}
              onChange={newValue => handleSettingsChange('allowShow', newValue)}
            />
          </LegacyCard.Section>
          {pageOptions.map((pageOption, index) => {
            if (pageOption.value === settings.allowShow) {
              return pageOption.body;
            }
          })}
        </FormLayout>
      )
    }
  ];

  if (isInitialLoading) {
    return (
      <Frame>
        <Page fullWidth title="Settings" subtitle="Dicide how your notifications will display">
          <SkeletonSettings />
        </Page>
      </Frame>
    );
  }

  return (
    <div style={{marginBottom: '50px'}}>
      <Frame>
        <Page
          fullWidth
          title="Settings"
          subtitle="Dicide how your notifications will display"
          primaryAction={{
            content: 'Save',
            onAction: async () => {
              openModal();
            },
            loading: loading
          }}
        >
          <Layout>
            <Layout.Section variant={'oneThird'}>
              <div className={'settings'}>
                <NotificationPopup
                  firstName="Son Ngu Yen"
                  city="Hanoi"
                  country="Vietnam"
                  productName="Nike Dunk Low heheheheheheheheh"
                  productImage="https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/c960a73e-8565-4cc6-9329-d2449c1944df/dunk-low-shoes-kKHp1z.png"
                  hideTimeAgo={settings.hideTimeAgo}
                  truncateProductName={settings.truncateProductName}
                  relativeDate="a day ago"
                />
              </div>
            </Layout.Section>
            <Layout.Section>
              <Card>
                <Tabs tabs={tabs} selected={tabSelected} onSelect={handleTabChange}>
                  <LegacyCard.Section>{tabs[tabSelected].body}</LegacyCard.Section>
                </Tabs>
              </Card>
            </Layout.Section>
          </Layout>
          {toastMarkup}
        </Page>
        {modal}
      </Frame>
    </div>
  );
}
Settings.propTypes = {};
