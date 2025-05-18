// Script to update the .env file with the cloud Strapi API URL and token

const fs = require('fs');
const path = require('path');

// Define the new values
const STRAPI_API_URL = 'https://wise-growth-11e60bdab7.strapiapp.com';
const STRAPI_API_TOKEN = '9eb7050f256139edff7084e18e3cbaee2f75905110d1d6ca0389ce91880f73710a21efa0e3a52e6a5a8dcbd5447f72a201aa111c02a9eeb76b8fb6b5291ec6bf3336b520e96a8024f9247ed8a48ce4c84bfbf2583e2fb369631740562e27ef1bb2279fbc30b85c223d5741850c7ce0e27afb5bac1fe1c481bb62681ef463dc61';

// Define the paths to the .env files
const envLocalPath = path.join(__dirname, '.env.local');
const envPath = path.join(__dirname, '.env');

// Function to update the .env file
function updateEnvFile(filePath) {
  try {
    // Check if the file exists
    if (fs.existsSync(filePath)) {
      console.log(`Updating ${filePath}...`);
      
      // Read the file content
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Update the Strapi API URL
      content = content.replace(
        /NEXT_PUBLIC_STRAPI_API_URL=.*/g,
        `NEXT_PUBLIC_STRAPI_API_URL=${STRAPI_API_URL}`
      );
      
      // Update the Strapi API token
      content = content.replace(
        /STRAPI_API_TOKEN=.*/g,
        `STRAPI_API_TOKEN=${STRAPI_API_TOKEN}`
      );
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, content, 'utf8');
      
      console.log(`Successfully updated ${filePath}`);
    } else {
      console.log(`File ${filePath} does not exist, creating it...`);
      
      // Create the file with the new values
      const content = `# Strapi API URL - Cloud instance
NEXT_PUBLIC_STRAPI_API_URL=${STRAPI_API_URL}

# Strapi API Token - Cloud instance
STRAPI_API_TOKEN=${STRAPI_API_TOKEN}
`;
      
      fs.writeFileSync(filePath, content, 'utf8');
      
      console.log(`Successfully created ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

// Update both .env files
updateEnvFile(envLocalPath);
updateEnvFile(envPath);

console.log('Done!');
