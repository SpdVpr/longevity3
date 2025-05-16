#!/bin/bash

# Create a temporary directory for our standalone app
echo "Creating temporary directory"
mkdir -p temp-app

# Change to the temporary directory
cd temp-app

# Initialize a new Next.js app with the most basic configuration
echo "Initializing a new Next.js app"

# Create package.json
cat > package.json << 'EOL'
{
  "name": "temp-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "@types/node": "20.10.4",
    "@types/react": "18.2.45",
    "typescript": "5.3.3"
  }
}
EOL

# Create tsconfig.json
cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOL

# Create next.config.js
cat > next.config.js << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
EOL

# Create next-env.d.ts
cat > next-env.d.ts << 'EOL'
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
EOL

# Create app directory
mkdir -p app

# Create page.tsx
cat > app/page.tsx << 'EOL'
export default function Home() {
  return (
    <main>
      <h1>Temporary App for Build</h1>
      <p>This is a temporary app created for the build process.</p>
    </main>
  );
}
EOL

# Create layout.tsx
cat > app/layout.tsx << 'EOL'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Temporary App',
  description: 'A temporary app for build purposes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
EOL

# Install dependencies
echo "Installing dependencies"
npm install --no-package-lock

# Build the app
echo "Building the app"
npx next build

# Check if build was successful
if [ -d ".next" ] && [ -f ".next/routes-manifest.json" ]; then
  echo "Build successful, routes-manifest.json found"
  
  # Copy the routes-manifest.json to the parent directory
  echo "Copying routes-manifest.json to parent directory"
  cp .next/routes-manifest.json ../.next/
  
  # Go back to the parent directory
  cd ..
  
  # Clean up
  echo "Cleaning up"
  rm -rf temp-app
  
  exit 0
else
  echo "Build failed, routes-manifest.json not found"
  
  # Go back to the parent directory
  cd ..
  
  # Keep the temp directory for debugging
  echo "Keeping temp directory for debugging"
  
  exit 1
fi
