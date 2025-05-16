const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create a new instance of PrismaClient
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Fixing database issues...');
    
    // 1. Check if Prisma client is properly initialized
    console.log('Checking Prisma client...');
    console.log('Prisma client:', prisma);
    console.log('Prisma workoutPlan model:', prisma.workoutPlan);
    console.log('Prisma caloricNeedsResult model:', prisma.caloricNeedsResult);
    
    // 2. Run prisma generate to regenerate Prisma client
    console.log('Regenerating Prisma client...');
    try {
      execSync('npx prisma generate', { stdio: 'inherit' });
    } catch (error) {
      console.error('Error regenerating Prisma client:', error);
    }
    
    // 3. Run prisma db push to create tables
    console.log('Pushing database schema...');
    try {
      execSync('npx prisma db push', { stdio: 'inherit' });
    } catch (error) {
      console.error('Error pushing database schema:', error);
    }
    
    // 4. Check if tables were created
    console.log('Checking if tables were created...');
    
    // Check User table
    try {
      const userCount = await prisma.user.count();
      console.log(`User table has ${userCount} records`);
    } catch (error) {
      console.error('Error counting users:', error);
    }
    
    // Check WorkoutPlan table
    try {
      const workoutPlanCount = await prisma.workoutPlan.count();
      console.log(`WorkoutPlan table has ${workoutPlanCount} records`);
    } catch (error) {
      console.error('Error counting workout plans:', error);
    }
    
    // Check CaloricNeedsResult table
    try {
      const caloricNeedsResultCount = await prisma.caloricNeedsResult.count();
      console.log(`CaloricNeedsResult table has ${caloricNeedsResultCount} records`);
    } catch (error) {
      console.error('Error counting caloric needs results:', error);
    }
    
    // 5. Try to create a test workout plan
    try {
      console.log('Creating test workout plan...');
      const testWorkoutPlan = await prisma.workoutPlan.create({
        data: {
          userId: 'test-user-id',
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
    
    console.log('Database fix completed');
  } catch (error) {
    console.error('Error fixing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
