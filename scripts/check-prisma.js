/**
 * This script checks if Prisma is needed for the build process
 * It's used in the build command to conditionally run Prisma generate
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if Prisma schema exists
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const schemaExists = fs.existsSync(schemaPath);

// Check if DATABASE_URL is set
const databaseUrlExists = !!process.env.DATABASE_URL;

console.log('🔍 Checking Prisma requirements:');
console.log('- Prisma schema path:', schemaPath);
console.log('- Prisma schema exists:', schemaExists);
console.log('- DATABASE_URL:', process.env.DATABASE_URL || 'NOT SET');
console.log('- DATABASE_URL exists:', databaseUrlExists);
console.log('- Current working directory:', process.cwd());
console.log('- Node environment:', process.env.NODE_ENV || 'NOT SET');

// If both schema and DATABASE_URL exist, run Prisma generate
if (schemaExists && databaseUrlExists) {
  console.log('✅ Running Prisma generate...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma generate completed successfully');
  } catch (error) {
    console.error('❌ Error running Prisma generate:', error.message);
    console.log('⚠️ Continuing with build process...');
  }
} else {
  console.log('⏭️ Skipping Prisma generate');
  if (!schemaExists) {
    console.log('   Reason: Prisma schema not found');
  }
  if (!databaseUrlExists) {
    console.log('   Reason: DATABASE_URL not set');
  }
}

// Exit with success code
process.exit(0);
