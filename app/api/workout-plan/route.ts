import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

// Create a new instance of PrismaClient for this API route
const prisma = new PrismaClient();

// POST /api/workout-plan
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      console.error('Authentication error: No session found');
      return NextResponse.json(
        { error: 'You must be signed in to save workout plans' },
        { status: 401 }
      );
    }

    // Log session info for debugging
    console.log('Session user:', {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email
    });

    // Parse request body
    let data;
    try {
      const text = await req.text();
      console.log('Request body:', text);
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate input
    if (!data.userId) {
      console.error('Missing userId in request data');
      return NextResponse.json(
        { error: 'Missing userId field' },
        { status: 400 }
      );
    }

    if (!data.calorieTarget) {
      console.error('Missing calorieTarget in request data');
      return NextResponse.json(
        { error: 'Missing calorieTarget field' },
        { status: 400 }
      );
    }

    if (!data.workoutPlan) {
      console.error('Missing workoutPlan in request data');
      return NextResponse.json(
        { error: 'Missing workoutPlan field' },
        { status: 400 }
      );
    }

    if (!data.mealPlan) {
      console.error('Missing mealPlan in request data');
      return NextResponse.json(
        { error: 'Missing mealPlan field' },
        { status: 400 }
      );
    }

    // Check if user is trying to save results for their own account
    if (session.user.id !== data.userId) {
      console.error(`User ID mismatch: session user ID (${session.user.id}) doesn't match request user ID (${data.userId})`);
      return NextResponse.json(
        { error: 'You can only save workout plans for your own account' },
        { status: 403 }
      );
    }

    // Convert objects to strings for SQLite if they aren't already strings
    let macroBreakdownString = typeof data.macroBreakdown === 'string'
      ? data.macroBreakdown
      : JSON.stringify(data.macroBreakdown || {});

    let workoutPlanString = typeof data.workoutPlan === 'string'
      ? data.workoutPlan
      : JSON.stringify(data.workoutPlan || []);

    let mealPlanString = typeof data.mealPlan === 'string'
      ? data.mealPlan
      : JSON.stringify(data.mealPlan || []);

    let recommendationsString = typeof data.recommendations === 'string'
      ? data.recommendations
      : JSON.stringify(data.recommendations || []);

    let formDataString = typeof data.formData === 'string'
      ? data.formData
      : JSON.stringify(data.formData || {});

    console.log('Processed strings for database:');
    console.log('macroBreakdownString:', macroBreakdownString.substring(0, 100) + '...');
    console.log('workoutPlanString:', workoutPlanString.substring(0, 100) + '...');
    console.log('mealPlanString:', mealPlanString.substring(0, 100) + '...');
    console.log('recommendationsString:', recommendationsString.substring(0, 100) + '...');
    console.log('formDataString:', formDataString.substring(0, 100) + '...');

    // Prepare data for database
    const planData = {
      userId: data.userId,
      calorieTarget: data.calorieTarget,
      macroBreakdown: macroBreakdownString,
      workoutPlan: workoutPlanString,
      mealPlan: mealPlanString,
      recommendations: recommendationsString,
      formData: formDataString,
      name: data.name || `Workout Plan ${new Date().toLocaleDateString()}`,
    };

    console.log('Creating workout plan with data:', planData);

    // Create workout plan
    console.log('Prisma client:', prisma);
    console.log('Prisma workoutPlan model:', prisma.workoutPlan);

    // Try to create the workout plan
    let workoutPlan;
    try {
      workoutPlan = await prisma.workoutPlan.create({
        data: planData,
      });
    } catch (createError) {
      console.error('Error creating workout plan:', createError);
      throw new Error(`Failed to create workout plan: ${createError instanceof Error ? createError.message : 'Unknown error'}`);
    }

    console.log('Workout plan created successfully:', workoutPlan);
    return NextResponse.json(workoutPlan, { status: 201 });
  } catch (error) {
    console.error('Error saving workout plan:', error);
    return NextResponse.json(
      { error: `Something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// GET /api/workout-plan or GET /api/workout-plan?id=123
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'You must be signed in to view workout plans' },
        { status: 401 }
      );
    }

    // Log session info for debugging
    console.log('Session user:', {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email
    });

    // Check if Prisma client is properly initialized
    console.log('Prisma client in GET method:', prisma);
    console.log('Prisma workoutPlan model in GET method:', prisma.workoutPlan);

    // If Prisma client is not properly initialized, create a new instance
    if (!prisma.workoutPlan) {
      console.error('Prisma workoutPlan model is undefined, returning empty array');
      return NextResponse.json([]);
    }

    const userId = session.user.id;
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    // If ID is provided, return a specific workout plan
    if (id) {
      console.log(`Fetching workout plan with ID: ${id}`);

      try {
        // Get workout plan
        const workoutPlan = await prisma.workoutPlan.findUnique({
          where: {
            id,
          },
        });

        if (!workoutPlan) {
          return NextResponse.json(
            { error: 'Workout plan not found' },
            { status: 404 }
          );
        }

        // Check if user is trying to access their own workout plan
        if (workoutPlan.userId !== userId) {
          return NextResponse.json(
            { error: 'You can only view your own workout plans' },
            { status: 403 }
          );
        }

        // Parse JSON strings for SQLite
        const formattedPlan = {
          ...workoutPlan,
          macroBreakdown: JSON.parse(workoutPlan.macroBreakdown || '{}'),
          workoutPlan: JSON.parse(workoutPlan.workoutPlan || '[]'),
          mealPlan: JSON.parse(workoutPlan.mealPlan || '[]'),
          recommendations: JSON.parse(workoutPlan.recommendations || '[]'),
          formData: JSON.parse(workoutPlan.formData || '{}'),
        };

        return NextResponse.json(formattedPlan);
      } catch (error) {
        console.error(`Error fetching workout plan with ID ${id}:`, error);
        return NextResponse.json(
          { error: `Error fetching workout plan: ${error instanceof Error ? error.message : 'Unknown error'}` },
          { status: 500 }
        );
      }
    }
    // Otherwise, return all workout plans for the user
    else {
      console.log(`Fetching all workout plans for user: ${userId}`);

      try {
        // Get workout plans for user
        const workoutPlans = await prisma.workoutPlan.findMany({
          where: {
            userId,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        console.log(`Found ${workoutPlans.length} workout plans`);

        // Parse JSON strings for SQLite
        const formattedPlans = workoutPlans.map(plan => ({
          ...plan,
          macroBreakdown: JSON.parse(plan.macroBreakdown || '{}'),
          workoutPlan: JSON.parse(plan.workoutPlan || '[]'),
          mealPlan: JSON.parse(plan.mealPlan || '[]'),
          recommendations: JSON.parse(plan.recommendations || '[]'),
          formData: JSON.parse(plan.formData || '{}'),
        }));

        return NextResponse.json(formattedPlans);
      } catch (error) {
        console.error('Error fetching workout plans:', error);
        return NextResponse.json(
          { error: `Error fetching workout plans: ${error instanceof Error ? error.message : 'Unknown error'}` },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Error fetching workout plan:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
