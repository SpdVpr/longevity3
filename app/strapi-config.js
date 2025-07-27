// This file sets the Strapi configuration globally
// It's imported in the root layout.js file before any other imports

// Get Strapi configuration from environment variables
window.STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
window.STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Log the configuration
console.log('STRAPI CONFIG - API_URL:', window.STRAPI_API_URL);
console.log('STRAPI CONFIG - API_TOKEN exists:', !!window.STRAPI_API_TOKEN);

// Override any environment variables that might be set incorrectly
if (typeof process !== 'undefined' && process.env) {
  process.env.NEXT_PUBLIC_STRAPI_API_URL = window.STRAPI_API_URL;
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN = window.STRAPI_API_TOKEN;
  process.env.STRAPI_API_TOKEN = window.STRAPI_API_TOKEN;
}
