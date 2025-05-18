// Script to check environment variables

require('dotenv').config({ path: '.env.local' });

console.log('Environment Variables:');
console.log('NEXT_PUBLIC_STRAPI_API_URL:', process.env.NEXT_PUBLIC_STRAPI_API_URL || 'Not set');
console.log('STRAPI_API_TOKEN exists:', !!process.env.STRAPI_API_TOKEN);
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'Not set');
console.log('NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

// Check if .env.local file exists
const fs = require('fs');
console.log('\n.env.local file exists:', fs.existsSync('.env.local'));

// If .env.local exists, print its contents (excluding sensitive values)
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const envLines = envContent.split('\n');
  
  console.log('\n.env.local file contents (keys only):');
  envLines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const key = line.split('=')[0];
      console.log(`- ${key}: ${key.includes('TOKEN') || key.includes('SECRET') ? '[REDACTED]' : 'Value set'}`);
    }
  });
}

// Create a sample .env.production file for Vercel
const envProductionContent = `NEXT_PUBLIC_STRAPI_API_URL=https://special-acoustics-b9adb26838.strapiapp.com
STRAPI_API_TOKEN=${process.env.STRAPI_API_TOKEN || 'YOUR_API_TOKEN_HERE'}
NEXTAUTH_URL=https://www.longevitygrow.com
NEXTAUTH_SECRET=${process.env.NEXTAUTH_SECRET || 'YOUR_NEXTAUTH_SECRET_HERE'}
DATABASE_URL=${process.env.DATABASE_URL || 'YOUR_DATABASE_URL_HERE'}
`;

fs.writeFileSync('.env.production', envProductionContent);
console.log('\nCreated .env.production file for Vercel deployment');
