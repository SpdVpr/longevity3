// This file sets the Strapi configuration globally
// It's imported in the root layout.js file before any other imports

// HARDCODED Strapi API URL and token to ensure they're always correct
window.STRAPI_API_URL = 'https://special-acoustics-b9adb26838.strapiapp.com';
window.STRAPI_API_TOKEN = '20096e270ae3b90065ca95970e34cda9ef7f3de056a0d9adb2edae62f158651bc218a1234832b338b1251291099daf1049d60d759f1935c2e2371f20f2cee68a6909567ade4b3f1c7be51f8effb548e7511570359ec3c6cbd33e83c6bac8e8c9f2eda66441986eb27f15897ccda1564dcd335552da089dff40317b9950c23477';

// Log the configuration
console.log('STRAPI CONFIG - API_URL:', window.STRAPI_API_URL);
console.log('STRAPI CONFIG - API_TOKEN exists:', !!window.STRAPI_API_TOKEN);

// Override any environment variables that might be set incorrectly
if (typeof process !== 'undefined' && process.env) {
  process.env.NEXT_PUBLIC_STRAPI_API_URL = window.STRAPI_API_URL;
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN = window.STRAPI_API_TOKEN;
  process.env.STRAPI_API_TOKEN = window.STRAPI_API_TOKEN;
}
