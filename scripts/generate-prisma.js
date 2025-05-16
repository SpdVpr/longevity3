// Skript pro generování Prisma klienta
const { execSync } = require('child_process');

try {
  console.log('Generování Prisma klienta...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma klient byl úspěšně vygenerován.');
} catch (error) {
  console.error('Chyba při generování Prisma klienta:', error);
  process.exit(1);
}
