const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Creating database tables...');
    
    // Run prisma db push to create tables
    console.log('Running prisma db push...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    // Check if tables were created
    console.log('Checking if tables were created...');
    
    // Check User table
    const userCount = await prisma.user.count();
    console.log(`User table has ${userCount} records`);
    
    // Try to create a test workout plan
    try {
      const testWorkoutPlan = await prisma.workoutPlan.create({
        data: {
          userId: '1', // This should be a valid user ID
          calorieTarget: 2000,
          macroBreakdown: '{}',
          workoutPlan: '[]',
          mealPlan: '[]',
          recommendations: '[]',
          formData: '{}',
          name: 'Test Workout Plan',
        },
      });
      console.log('Created test workout plan:', testWorkoutPlan);
      
      // Delete the test workout plan
      await prisma.workoutPlan.delete({
        where: {
          id: testWorkoutPlan.id,
        },
      });
      console.log('Deleted test workout plan');
    } catch (error) {
      console.error('Error creating test workout plan:', error);
    }
    
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating database tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
