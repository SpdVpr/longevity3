import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

// Create a new instance of PrismaClient for this API route
const prisma = new PrismaClient();

// POST /api/caloric-needs
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      console.error('Authentication error: No session found');
      return NextResponse.json(
        { error: 'You must be signed in to save caloric needs results' },
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

    if (!data.bmr) {
      console.error('Missing bmr in request data');
      return NextResponse.json(
        { error: 'Missing bmr field' },
        { status: 400 }
      );
    }

    if (!data.tdee) {
      console.error('Missing tdee in request data');
      return NextResponse.json(
        { error: 'Missing tdee field' },
        { status: 400 }
      );
    }

    if (!data.targetCalories) {
      console.error('Missing targetCalories in request data');
      return NextResponse.json(
        { error: 'Missing targetCalories field' },
        { status: 400 }
      );
    }

    // Check if user is trying to save results for their own account
    if (session.user.id !== data.userId) {
      console.error(`User ID mismatch: session user ID (${session.user.id}) doesn't match request user ID (${data.userId})`);
      return NextResponse.json(
        { error: 'You can only save results for your own account' },
        { status: 403 }
      );
    }

    // Convert objects to strings for SQLite if they aren't already strings
    let macroBreakdownString = typeof data.macroBreakdown === 'string'
      ? data.macroBreakdown
      : JSON.stringify(data.macroBreakdown || {});

    let recommendationsString = typeof data.recommendations === 'string'
      ? data.recommendations
      : JSON.stringify(data.recommendations || []);

    let formDataString = typeof data.formData === 'string'
      ? data.formData
      : JSON.stringify(data.formData || {});

    console.log('Processed strings for database:');
    console.log('macroBreakdownString:', macroBreakdownString.substring(0, 100) + '...');
    console.log('recommendationsString:', recommendationsString.substring(0, 100) + '...');
    console.log('formDataString:', formDataString.substring(0, 100) + '...');

    // Prepare data for database
    const resultData = {
      userId: data.userId,
      bmr: data.bmr,
      tdee: data.tdee,
      targetCalories: data.targetCalories,
      macroBreakdown: macroBreakdownString,
      recommendations: recommendationsString,
      formData: formDataString,
      name: data.name || `Caloric Needs ${new Date().toLocaleDateString()}`,
    };

    console.log('Creating caloric needs result with data:', resultData);

    // Create caloric needs result
    console.log('Prisma client:', prisma);
    console.log('Prisma caloricNeedsResult model:', prisma.caloricNeedsResult);

    // Try to create the caloric needs result
    let caloricNeedsResult;
    try {
      caloricNeedsResult = await prisma.caloricNeedsResult.create({
        data: resultData,
      });
    } catch (createError) {
      console.error('Error creating caloric needs result:', createError);
      throw new Error(`Failed to create caloric needs result: ${createError instanceof Error ? createError.message : 'Unknown error'}`);
    }

    console.log('Caloric needs result created successfully:', caloricNeedsResult);
    return NextResponse.json(caloricNeedsResult, { status: 201 });
  } catch (error) {
    console.error('Error saving caloric needs result:', error);
    return NextResponse.json(
      { error: `Something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// GET /api/caloric-needs or GET /api/caloric-needs?id=123
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'You must be signed in to view caloric needs results' },
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
    console.log('Prisma caloricNeedsResult model in GET method:', prisma.caloricNeedsResult);

    // If Prisma client is not properly initialized, create a new instance
    if (!prisma.caloricNeedsResult) {
      console.error('Prisma caloricNeedsResult model is undefined, returning empty array');
      return NextResponse.json([]);
    }

    const userId = session.user.id;
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    // If ID is provided, return a specific caloric needs result
    if (id) {
      console.log(`Fetching caloric needs result with ID: ${id}`);

      try {
        // Get caloric needs result
        const caloricNeedsResult = await prisma.caloricNeedsResult.findUnique({
          where: {
            id,
          },
        });

        if (!caloricNeedsResult) {
          return NextResponse.json(
            { error: 'Caloric needs result not found' },
            { status: 404 }
          );
        }

        // Check if user is trying to access their own result
        if (caloricNeedsResult.userId !== userId) {
          return NextResponse.json(
            { error: 'You can only view your own caloric needs results' },
            { status: 403 }
          );
        }

        // Parse JSON strings for SQLite
        const formattedResult = {
          ...caloricNeedsResult,
          macroBreakdown: JSON.parse(caloricNeedsResult.macroBreakdown || '{}'),
          recommendations: JSON.parse(caloricNeedsResult.recommendations || '[]'),
          formData: JSON.parse(caloricNeedsResult.formData || '{}'),
        };

        return NextResponse.json(formattedResult);
      } catch (error) {
        console.error(`Error fetching caloric needs result with ID ${id}:`, error);
        return NextResponse.json(
          { error: `Error fetching caloric needs result: ${error instanceof Error ? error.message : 'Unknown error'}` },
          { status: 500 }
        );
      }
    }
    // Otherwise, return all caloric needs results for the user
    else {
      console.log(`Fetching all caloric needs results for user: ${userId}`);

      try {
        // Get caloric needs results for user
        const caloricNeedsResults = await prisma.caloricNeedsResult.findMany({
          where: {
            userId,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        console.log(`Found ${caloricNeedsResults.length} caloric needs results`);

        // Parse JSON strings for SQLite
        const formattedResults = caloricNeedsResults.map(result => ({
          ...result,
          macroBreakdown: JSON.parse(result.macroBreakdown || '{}'),
          recommendations: JSON.parse(result.recommendations || '[]'),
          formData: JSON.parse(result.formData || '{}'),
        }));

        return NextResponse.json(formattedResults);
      } catch (error) {
        console.error('Error fetching caloric needs results:', error);
        return NextResponse.json(
          { error: `Error fetching caloric needs results: ${error instanceof Error ? error.message : 'Unknown error'}` },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Error fetching caloric needs result:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
