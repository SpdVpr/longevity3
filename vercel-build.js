#!/usr/bin/env node

/**
 * Vercel build script - this will be called by the vercel-build npm script
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Vercel Build Script Starting...');
console.log('📍 Working directory:', process.cwd());
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');

// List some key files to verify we're in the right place
const keyFiles = ['package.json', 'next.config.js', 'prisma/schema.prisma'];
keyFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`📄 ${file}: ${exists ? '✅ exists' : '❌ missing'}`);
});

// Create a minimal prisma schema if it doesn't exist to prevent build errors
if (!fs.existsSync('prisma')) {
  console.log('📁 Creating prisma directory...');
  fs.mkdirSync('prisma', { recursive: true });
}

if (!fs.existsSync('prisma/schema.prisma')) {
  console.log('📄 Creating minimal prisma schema...');
  const minimalSchema = `// Minimal Prisma schema for build compatibility
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// Placeholder model
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
}`;
  fs.writeFileSync('prisma/schema.prisma', minimalSchema);
}

try {
  console.log('\n🔍 Step 1: Generating Prisma client...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated successfully');
  } catch (prismaError) {
    console.log('⚠️ Prisma generation failed, continuing without it:', prismaError.message);
  }

  console.log('\n🔧 Step 2: Forcing API URL configuration...');
  execSync('node scripts/force-api-url.js', { stdio: 'inherit' });

  console.log('\n🔄 Step 3: Replacing localhost references...');
  execSync('node scripts/replace-localhost.js', { stdio: 'inherit' });

  console.log('\n🏗️ Step 4: Building Next.js application...');
  execSync('npx next build', { stdio: 'inherit' });

  console.log('\n🔧 Step 5: Running post-build replacements...');
  execSync('node scripts/post-build-replace.js', { stdio: 'inherit' });
  
  console.log('\n✅ Vercel build completed successfully!');
  process.exit(0);
  
} catch (error) {
  console.error('\n❌ Vercel build failed!');
  console.error('Error:', error.message);
  
  // Try to provide helpful debugging info
  if (error.message.includes('Prisma')) {
    console.error('\n🔍 Prisma-related error detected. Checking Prisma setup...');
    console.error('DATABASE_URL:', process.env.DATABASE_URL || 'NOT SET');
    console.error('Prisma schema exists:', fs.existsSync('prisma/schema.prisma'));
  }
  
  process.exit(1);
}
