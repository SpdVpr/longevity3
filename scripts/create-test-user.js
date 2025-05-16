// Script pro vytvoření testovacího uživatele
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    // Kontrola, zda testovací uživatel již existuje
    const existingUser = await prisma.user.findUnique({
      where: {
        email: 'test@example.com',
      },
    });

    if (existingUser) {
      console.log('Testovací uživatel již existuje.');
      return;
    }

    // Vytvoření testovacího uživatele
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
      },
    });

    // Vytvoření profilu pro uživatele
    await prisma.profile.create({
      data: {
        userId: user.id,
        bio: 'Testovací uživatel pro vývoj aplikace.',
        gender: 'other',
        goals: JSON.stringify(['Improve fitness', 'Better nutrition']),
      },
    });

    console.log('Testovací uživatel byl úspěšně vytvořen:');
    console.log('Email: test@example.com');
    console.log('Heslo: password123');
    console.log('ID uživatele:', user.id);
  } catch (error) {
    console.error('Chyba při vytváření testovacího uživatele:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
