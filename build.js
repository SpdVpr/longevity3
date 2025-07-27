#!/usr/bin/env node

/**
 * Custom build script for Vercel deployment
 * This ensures proper build order and handles Prisma conditionally
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting custom build process...');
console.log('📍 Current working directory:', process.cwd());
console.log('📁 Files in current directory:', fs.readdirSync('.').slice(0, 10).join(', '));

// Check if we have the necessary files
const requiredFiles = ['package.json', 'next.config.js'];
const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

if (missingFiles.length > 0) {
  console.error('❌ Missing required files:', missingFiles.join(', '));
  process.exit(1);
}

try {
  // Run our custom build sequence directly
  console.log('🔍 Step 1: Checking Prisma...');
  execSync('node scripts/check-prisma.js', { stdio: 'inherit' });

  console.log('🔧 Step 2: Forcing API URL...');
  execSync('node scripts/force-api-url.js', { stdio: 'inherit' });

  console.log('🔄 Step 3: Replacing localhost references...');
  execSync('node scripts/replace-localhost.js', { stdio: 'inherit' });

  console.log('🏗️ Step 4: Building Next.js app...');
  execSync('npx next build', { stdio: 'inherit' });

  console.log('🔧 Step 5: Post-build replacements...');
  execSync('node scripts/post-build-replace.js', { stdio: 'inherit' });

  console.log('✅ Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error('❌ Error details:', error);
  process.exit(1);
}
