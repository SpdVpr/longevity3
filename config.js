// Configuration file for the application
// This file is bundled with the client-side code

const config = {
  // Strapi API URL
  strapiApiUrl: process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com',

  // Strapi API token
  strapiApiToken: process.env.STRAPI_API_TOKEN,

  // Site URL
  siteUrl: 'https://www.longevitygrow.com',

  // Debug mode
  debug: process.env.NODE_ENV === 'development'
};

// Log the configuration for debugging
if (config.debug) {
  console.log('Config loaded:', {
    strapiApiUrl: config.strapiApiUrl,
    strapiApiTokenExists: !!config.strapiApiToken,
    siteUrl: config.siteUrl
  });
}

export default config;
