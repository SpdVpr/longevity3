const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Initializing database...');
    
    // Check if database is accessible
    const userCount = await prisma.user.count();
    console.log(`Database has ${userCount} users`);
    
    // Check if models are defined
    console.log('Checking models...');
    console.log('User model:', !!prisma.user);
    console.log('WorkoutPlan model:', !!prisma.workoutPlan);
    console.log('BioAgeResult model:', !!prisma.bioAgeResult);
    console.log('CaloricNeedsResult model:', !!prisma.caloricNeedsResult);
    
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
