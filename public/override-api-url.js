// This script overrides the API URL at runtime
// It's loaded in the HTML head before any other JavaScript

(function() {
  // Override the API URL and token
  window.STRAPI_API_URL = 'https://special-acoustics-b9adb26838.strapiapp.com';
  window.STRAPI_API_TOKEN = '20096e270ae3b90065ca95970e34cda9ef7f3de056a0d9adb2edae62f158651bc218a1234832b338b1251291099daf1049d60d759f1935c2e2371f20f2cee68a6909567ade4b3f1c7be51f8effb548e7511570359ec3c6cbd33e83c6bac8e8c9f2eda66441986eb27f15897ccda1564dcd335552da089dff40317b9950c23477';
  
  // Override fetch to intercept requests to localhost:1337
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    // Check if the URL contains localhost:1337
    if (typeof url === 'string' && url.includes('localhost:1337')) {
      // Replace localhost:1337 with the Strapi cloud URL
      const newUrl = url.replace('http://localhost:1337', window.STRAPI_API_URL);
      console.log('Overriding fetch URL:', url, '->', newUrl);
      
      // Add the API token to the request headers
      const newOptions = options || {};
      newOptions.headers = newOptions.headers || {};
      newOptions.headers['Authorization'] = `Bearer ${window.STRAPI_API_TOKEN}`;
      
      // Call the original fetch with the new URL and options
      return originalFetch(newUrl, newOptions);
    }
    
    // Otherwise, call the original fetch
    return originalFetch(url, options);
  };
  
  console.log('API URL override script loaded');
  console.log('STRAPI_API_URL:', window.STRAPI_API_URL);
  console.log('STRAPI_API_TOKEN exists:', !!window.STRAPI_API_TOKEN);
})();
