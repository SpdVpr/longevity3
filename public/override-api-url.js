// This script overrides the API URL at runtime
// It's loaded in the HTML head before any other JavaScript

(function() {
  // Set the API URL and token from environment variables
  window.STRAPI_API_URL = 'https://special-acoustics-b9adb26838.strapiapp.com';
  // Note: API token should be set via environment variables, not hardcoded
  window.STRAPI_API_TOKEN = null; // Will be set by server-side rendering
  
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
