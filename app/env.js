// This file sets the environment variables for the client-side code
// It's imported in the root layout.js file

// Set the Strapi API URL
if (!process.env.NEXT_PUBLIC_STRAPI_API_URL) {
  process.env.NEXT_PUBLIC_STRAPI_API_URL = 'https://special-acoustics-b9adb26838.strapiapp.com';
  console.log('Setting NEXT_PUBLIC_STRAPI_API_URL from env.js:', process.env.NEXT_PUBLIC_STRAPI_API_URL);
}

// Set the API token if it's not already set
if (!process.env.STRAPI_API_TOKEN) {
  process.env.STRAPI_API_TOKEN = '20096e270ae3b90065ca95970e34cda9ef7f3de056a0d9adb2edae62f158651bc218a1234832b338b1251291099daf1049d60d759f1935c2e2371f20f2cee68a6909567ade4b3f1c7be51f8effb548e7511570359ec3c6cbd33e83c6bac8e8c9f2eda66441986eb27f15897ccda1564dcd335552da089dff40317b9950c23477';
  console.log('Setting STRAPI_API_TOKEN from env.js');
}

// Export the environment variables for client-side use
export const strapiApiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
export const strapiApiToken = process.env.STRAPI_API_TOKEN;

console.log('env.js: NEXT_PUBLIC_STRAPI_API_URL =', strapiApiUrl);
console.log('env.js: STRAPI_API_TOKEN exists =', !!strapiApiToken);
