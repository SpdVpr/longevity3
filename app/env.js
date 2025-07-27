// This file sets the environment variables for the client-side code
// It's imported in the root layout.js file

// Set the Strapi API URL
if (!process.env.NEXT_PUBLIC_STRAPI_API_URL) {
  process.env.NEXT_PUBLIC_STRAPI_API_URL = 'https://special-acoustics-b9adb26838.strapiapp.com';
  console.log('Setting NEXT_PUBLIC_STRAPI_API_URL from env.js:', process.env.NEXT_PUBLIC_STRAPI_API_URL);
}

// Check if API token is set
if (!process.env.STRAPI_API_TOKEN) {
  console.warn('STRAPI_API_TOKEN is not set in environment variables');
}

// Export the environment variables for client-side use
export const strapiApiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
export const strapiApiToken = process.env.STRAPI_API_TOKEN;

console.log('env.js: NEXT_PUBLIC_STRAPI_API_URL =', strapiApiUrl);
console.log('env.js: STRAPI_API_TOKEN exists =', !!strapiApiToken);
