#!/bin/bash

# Přejmenování package.json
echo "Renaming package.json to package.json.bak"
mv package.json package.json.bak

# Použití vercel-package.json
echo "Using vercel-package.json as package.json"
cp vercel-package.json package.json

# Instalace závislostí
echo "Installing dependencies"
npm install
npm install next-auth@latest react-icons@latest --force

# Generování Prisma klienta
echo "Generating Prisma client"
npx prisma generate

# Úprava next.config.ts pro vypnutí Tailwind CSS
echo "Modifying next.config.ts to disable Tailwind CSS"
sed -i 's/experimental: {/experimental: {\n    tailwindcss: false,/g' next.config.ts

# Výpis nainstalovaných balíčků
echo "Installed packages:"
npm list next-auth react-icons

# Build Next.js aplikace
echo "Building Next.js application"
npx next build

# Obnovení původního package.json
echo "Restoring original package.json"
mv package.json.bak package.json
