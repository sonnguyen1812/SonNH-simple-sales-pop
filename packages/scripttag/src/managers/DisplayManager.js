import NotificationPopup from '../components/NotificationPopup/NotificationPopup';
import React from 'react';
import {delay} from '../helpers/delay';
import {insertAfter} from '../helpers/insertHelpers';
import {render} from 'preact';
import {replaceSubstring} from '../helpers/replaceSubstring';

export default class DisplayManager {
  constructor() {
    this.notifications = [];
    this.settings = {};
    this.shopifyDomain = 'https://' + Shopify.shop;
  }

  async initialize({notifications, settings}) {
    this.notifications = notifications;
    this.settings = settings;
    this.insertContainer();

    let currentUrl = window.location.href;
    currentUrl = currentUrl.replace(this.shopifyDomain, '');

    if (!this.allowShow(currentUrl, settings)) return;

    await this.displayFromSetting(settings, notifications);
  }

  fadeOut() {
    const container = document.querySelector('#Avada-SalePop');
    container.innerHTML = '';
  }

  display({notification, position, truncateProductName, hideTimeAgo}) {
    const container = document.querySelector('#Avada-SalePop');
    render(
      <NotificationPopup
        {...notification}
        position={position}
        truncateProductName={truncateProductName}
        hideTimeAgo={hideTimeAgo}
      />,
      container
    );
  }

  insertContainer() {
    const popupEl = document.createElement('div');
    popupEl.id = `Avada-SalePop`;
    popupEl.classList.add('Avada-SalePop__OuterWrapper');
    const targetEl = document.querySelector('body').firstChild;
    if (targetEl) {
      insertAfter(popupEl, targetEl);
    }

    return popupEl;
  }

  deleteContainer() {
    const popupEl = document.getElementById('Avada-SalePop');
    popupEl.remove();
  }

  async displayFromSetting(settings, notifications) {
    await delay(settings.firstDelay);
    const toDisplayNotications = notifications.slice(0, settings.maxPopsDisplay);

    for (const notifcation of toDisplayNotications) {
      await this.displayNotification(notifcation, settings);
      await delay(settings.displayDuration);
      this.fadeOut();
      await delay(settings.popsInterval);
    }
  }

  // getPopsToDisplay() {
  //   return this.notifications.randonmize()
  // }

  filterPageUrls(urls) {
    const urlsArr = urls.split('\n');
    return replaceSubstring(urlsArr, this.shopifyDomain);
  }

  allowShow(currentUrl, settings) {
    const excludedUrls = this.filterPageUrls(settings.excludedUrls);
    const includedUrls = this.filterPageUrls(settings.includedUrls);

    if (excludedUrls.includes(currentUrl)) return false;

    if (settings.allowShow === 'specific' && includedUrls.includes(currentUrl)) return true;

    return settings.allowShow === 'all';
  }

  async displayNotification(currentNotification, settings) {
    this.insertContainer();
    await delay(settings.popsInterval);
    await this.display({
      notification: currentNotification,
      position: settings.position,
      truncateProductName: settings.truncateProductName
    });
    await delay(settings.displayDuration);
    this.fadeOut();
    this.deleteContainer();
  }
}
