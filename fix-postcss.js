// This file is used to fix the PostCSS configuration for Strapi Cloud
// It will be run before the build process

const fs = require('fs');
const path = require('path');

// Update package.json to include required dependencies
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = require(packageJsonPath);

// Add the required dependencies if they don't exist
if (!packageJson.devDependencies) {
  packageJson.devDependencies = {};
}

packageJson.devDependencies.autoprefixer = packageJson.devDependencies.autoprefixer || "^10.4.16";
packageJson.devDependencies.postcss = packageJson.devDependencies.postcss || "^8.4.31";
packageJson.devDependencies.tailwindcss = packageJson.devDependencies.tailwindcss || "^3.3.5";

// Update the package.json file
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('Updated package.json with required PostCSS dependencies');

// Update the build script to install the dependencies
if (!packageJson.scripts) {
  packageJson.scripts = {};
}

// Add a prebuild script to install the required dependencies
packageJson.scripts.prebuild = "npm install autoprefixer postcss tailwindcss --no-save";

// Update the package.json file again
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('Added prebuild script to install required dependencies');

console.log('PostCSS fix completed successfully');
