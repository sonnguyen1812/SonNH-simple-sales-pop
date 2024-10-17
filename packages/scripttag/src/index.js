import ApiManager from './managers/ApiManager';
import DisplayManager from './managers/DisplayManager';

console.log('This is the script tag');

(async () => {
  const apiManager = new ApiManager();
  const displayManager = new DisplayManager();
  const {notifications, settings} = await apiManager.getNotifications();
  await displayManager.initialize({notifications, settings});
})();
