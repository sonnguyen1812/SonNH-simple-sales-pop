(function() {
  const BASE_URL = 'http://localhost:5050/scripttag';

  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.async = !0;
  scriptElement.src = `${BASE_URL}/index.min.js?v=${new Date().getTime()}`;
  console.log('Script URL:', scriptElement.src);
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(scriptElement, firstScript);
})();
