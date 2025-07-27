#!/usr/bin/env node

/**
 * Custom build script for Vercel deployment
 * This ensures proper build order and handles Prisma conditionally
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting custom build process...');

try {
  // Run the npm build script which includes all our custom logic
  console.log('📦 Running npm run build...');
  execSync('npm run build', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
