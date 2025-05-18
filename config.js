// Configuration file for the application
// This file is bundled with the client-side code

const config = {
  // Strapi API URL
  strapiApiUrl: 'https://special-acoustics-b9adb26838.strapiapp.com',
  
  // Strapi API token
  strapiApiToken: '20096e270ae3b90065ca95970e34cda9ef7f3de056a0d9adb2edae62f158651bc218a1234832b338b1251291099daf1049d60d759f1935c2e2371f20f2cee68a6909567ade4b3f1c7be51f8effb548e7511570359ec3c6cbd33e83c6bac8e8c9f2eda66441986eb27f15897ccda1564dcd335552da089dff40317b9950c23477',
  
  // Site URL
  siteUrl: 'https://www.longevitygrow.com',
  
  // Debug mode
  debug: true
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
