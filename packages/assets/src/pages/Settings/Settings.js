import './Settings.css';

import {
  Checkbox,
  FormLayout,
  Frame,
  InlineGrid,
  Layout,
  LegacyCard,
  LegacyTabs,
  Page,
  Select,
  Spinner
} from '@shopify/polaris';
import React, {useState} from 'react';

import DesktopPositionInput from '@assets/components/DesktopPositionInput/DesktopPositionInput';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup';
import PageInput from '@assets/components/PageInput/PageInput';
import SliderRange from '@assets/components/SliderRange/SliderRange';
import {api} from '@assets/helpers';
import defaultSettings from '@assets/const/defaultSettings.';
import useActiveToast from '@assets/hooks/toast/useActiveToast';
import useConfirmModal from '@assets/hooks/popup/useConfirmModal';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import useSelectedTab from '@assets/hooks/tabs/useSelectedTab';

/**
 * @return {JSX.Element}
 */
export default function Settings() {
  const {tabSelected, handleTabChange} = useSelectedTab(0);
  const {toastMarkup, handleActiveToastChange} = useActiveToast(false, '');
  const [loading, setLoading] = useState(false);
  const {data: settings, setData: setSettings, fetched, setFetched} = useFetchApi({
    url: '/settings',
    defaultData: defaultSettings
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

      console.log(res);

      setSettings(res.data);
      closeModal();
      setLoading(false);
      setFetched(true);

      handleActiveToastChange('Save successfully');
    } catch (err) {
      console.log(err);
      setLoading(false);
      handleActiveToastChange('Save failed');
    }
  };

  const {modal, openModal, closeModal} = useConfirmModal({
    title: 'Save change',
    content: 'Do you want to update your setting change',
    confirmAction: handleSaveSettings
  });

  const handleSettingsChange = (key, value) => {
    setFetched(false);
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
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

  if (loading) {
    return (
      <div className="loading">
        <Spinner size={'small'} />
      </div>
    );
  }

  return (
    <div style={{marginBottom: '50px'}}>
      <Frame>
        <Page
          title="Settings"
          subtitle="Dicide how your notifications will display"
          primaryAction={{
            content: 'Save',
            onAction: async () => {
              openModal();
            }
          }}
        >
          <Layout sectioned>
            <InlineGrid columns={['oneThird', 'twoThirds']}>
              <div>
                <NotificationPopup
                  firstName="Son NH"
                  city="Hanoi"
                  country="Vietnam"
                  productName="Nike Dunk Low"
                  productImage="https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/c960a73e-8565-4cc6-9329-d2449c1944df/dunk-low-shoes-kKHp1z.png"
                  time="a day ago"
                />
              </div>
              <LegacyCard>
                <LegacyTabs tabs={tabs} selected={tabSelected} onSelect={handleTabChange}>
                  <LegacyCard.Section>{tabs[tabSelected].body}</LegacyCard.Section>
                </LegacyTabs>
              </LegacyCard>
            </InlineGrid>
          </Layout>
          {toastMarkup}
        </Page>
        {modal}
      </Frame>
    </div>
  );
}
Settings.propTypes = {};
