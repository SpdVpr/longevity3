// This script overrides the API URL at runtime
// It's loaded in the HTML head before any other JavaScript

(function() {
  // Set the API URL and token from environment variables
  window.STRAPI_API_URL = 'https://special-acoustics-b9adb26838.strapiapp.com';
  // Note: API token should be set via environment variables, not hardcoded
  window.STRAPI_API_TOKEN = null; // Will be set by server-side rendering
  
  // Override fetch to intercept requests to special-acoustics-b9adb26838.strapiapp.com
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    // Check if the URL contains special-acoustics-b9adb26838.strapiapp.com
    if (typeof url === 'string' && url.includes('special-acoustics-b9adb26838.strapiapp.com')) {
      // Replace special-acoustics-b9adb26838.strapiapp.com with the Strapi cloud URL
      const newUrl = url.replace('https://special-acoustics-b9adb26838.strapiapp.com', window.STRAPI_API_URL);
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
