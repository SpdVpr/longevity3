// Script to replace all occurrences of special-acoustics-b9adb26838.strapiapp.com in the built files
// This script is run after the build process

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
      findFiles(filePath, fileList);
    } else {
      // Only process JavaScript files
      if (/\.(js|html)$/.test(file)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

// Function to replace special-acoustics-b9adb26838.strapiapp.com with the Strapi API URL in a file
function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file contains special-acoustics-b9adb26838.strapiapp.com
    if (content.includes('special-acoustics-b9adb26838.strapiapp.com')) {
      console.log(`Replacing special-acoustics-b9adb26838.strapiapp.com in ${filePath}`);
      
      // Replace all occurrences of special-acoustics-b9adb26838.strapiapp.com with the Strapi API URL
      const newContent = content.replace(/special-acoustics-b9adb26838.strapiapp.com/g, STRAPI_API_URL.replace('https://', ''));
      
      // Replace all occurrences of https://special-acoustics-b9adb26838.strapiapp.com with the Strapi API URL
      const finalContent = newContent.replace(/http:\/\/special-acoustics-b9adb26838.strapiapp.com/g, STRAPI_API_URL);
      
      // Write the modified content back to the file
      fs.writeFileSync(filePath, finalContent, 'utf8');
      
      console.log(`Replaced special-acoustics-b9adb26838.strapiapp.com in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Main function
function main() {
  console.log('Starting post-build replacement of special-acoustics-b9adb26838.strapiapp.com with', STRAPI_API_URL);
  
  // Find all files in the .next directory
  const files = findFiles('.next');
  
  // Replace special-acoustics-b9adb26838.strapiapp.com in each file
  files.forEach(replaceInFile);
  
  console.log('Finished post-build replacement');
}

// Run the main function
main();
