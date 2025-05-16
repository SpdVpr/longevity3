import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Create a new instance of PrismaClient for this API route
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Test if prisma is defined
    console.log('Prisma client:', prisma);

    // Test if prisma.workoutPlan is defined
    console.log('Prisma workoutPlan model:', prisma.workoutPlan);

    // Test if other models are defined
    console.log('Prisma user model:', prisma.user);
    console.log('Prisma bioAgeResult model:', prisma.bioAgeResult);
    console.log('Prisma caloricNeedsResult model:', prisma.caloricNeedsResult);

    // Try to access the database
    const userCount = await prisma.user.count();

    return NextResponse.json({
      status: 'success',
      message: 'Prisma client is working',
      prismaClient: !!prisma,
      workoutPlanModel: !!prisma.workoutPlan,
      userModel: !!prisma.user,
      bioAgeResultModel: !!prisma.bioAgeResult,
      caloricNeedsResultModel: !!prisma.caloricNeedsResult,
      userCount
    });
  } catch (error) {
    console.error('Error testing Prisma client:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
