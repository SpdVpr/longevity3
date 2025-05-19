/**
 * Script to force the correct API URL in all JavaScript files
 * This script is run during the build process
 */

const fs = require('fs');
const path = require('path');

// Define the Strapi API URL
const STRAPI_API_URL = 'https://special-acoustics-b9adb26838.strapiapp.com';

// Function to recursively find all files in a directory
function findFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory ${dir} does not exist, skipping`);
    return fileList;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and .git directories
      if (file !== 'node_modules' && file !== '.git') {
        findFiles(filePath, fileList);
      }
    } else {
      // Only process JavaScript and TypeScript files
      if (/\.(js|jsx|ts|tsx)$/.test(file)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

// Function to replace localhost references in a file
function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace localhost:3000
    if (content.includes('localhost:3000')) {
      console.log(`Replacing localhost:3000 in ${filePath}`);
      content = content.replace(/localhost:3000/g, 'www.longevitygrow.com');
      modified = true;
    }
    
    // Replace localhost:1337
    if (content.includes('localhost:1337')) {
      console.log(`Replacing localhost:1337 in ${filePath}`);
      content = content.replace(/localhost:1337/g, STRAPI_API_URL.replace('https://', ''));
      modified = true;
    }
    
    // Replace http://localhost:1337
    if (content.includes('http://localhost:1337')) {
      console.log(`Replacing http://localhost:1337 in ${filePath}`);
      content = content.replace(/http:\/\/localhost:1337/g, STRAPI_API_URL);
      modified = true;
    }
    
    // Replace http://localhost:3000
    if (content.includes('http://localhost:3000')) {
      console.log(`Replacing http://localhost:3000 in ${filePath}`);
      content = content.replace(/http:\/\/localhost:3000/g, 'https://www.longevitygrow.com');
      modified = true;
    }
    
    // Write the modified content back to the file if changes were made
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Main function
function main() {
  console.log('Starting to replace localhost references...');
  
  // Find all files in the current directory
  const files = findFiles('.');
  
  // Replace localhost references in each file
  files.forEach(replaceInFile);
  
  console.log('Finished replacing localhost references');
}

// Run the main function
main();
