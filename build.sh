#!/bin/bash

# Instalace závislostí
npm install
npm install tailwindcss@latest postcss@latest autoprefixer@latest next-auth@latest react-icons@latest --force

# Vytvoření node_modules/.bin adresáře, pokud neexistuje
mkdir -p node_modules/.bin

# Generování Prisma klienta
npx prisma generate

# Vytvoření symbolického odkazu pro tailwindcss
if [ ! -f node_modules/.bin/tailwindcss ]; then
  echo "Creating symlink for tailwindcss"
  ln -s ../tailwindcss/lib/cli.js node_modules/.bin/tailwindcss
fi

# Výpis obsahu node_modules/.bin
echo "Contents of node_modules/.bin:"
ls -la node_modules/.bin

# Výpis nainstalovaných balíčků
echo "Installed packages:"
npm list tailwindcss postcss autoprefixer next-auth react-icons

# Build Next.js aplikace
npx next build
