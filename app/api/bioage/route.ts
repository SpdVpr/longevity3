import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'You must be signed in to save results' },
        { status: 401 }
      );
    }

    const data = await req.json();

    // Validate input
    if (!data.userId || !data.chronologicalAge || !data.biologicalAge) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user is trying to save results for their own account
    if (session.user.id !== data.userId) {
      return NextResponse.json(
        { error: 'You can only save results for your own account' },
        { status: 403 }
      );
    }

    // Convert arrays to strings for SQLite
    const recommendationsString = JSON.stringify(data.recommendations || []);
    const formDataString = JSON.stringify(data.formData || {});

    // Create bio age result
    const bioAgeResult = await prisma.bioAgeResult.create({
      data: {
        userId: data.userId,
        chronologicalAge: data.chronologicalAge,
        biologicalAge: data.biologicalAge,
        ageDifference: data.ageDifference,
        riskLevel: data.riskLevel,
        recommendations: recommendationsString,
        formData: formDataString,
      },
    });

    return NextResponse.json(bioAgeResult, { status: 201 });
  } catch (error) {
    console.error('Error saving bio age result:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'You must be signed in to view results' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get bio age results for user
    const bioAgeResults = await prisma.bioAgeResult.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Parse JSON strings for SQLite
    const formattedResults = bioAgeResults.map(result => ({
      ...result,
      recommendations: JSON.parse(result.recommendations || '[]'),
      formData: JSON.parse(result.formData || '{}'),
    }));

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error('Error fetching bio age results:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
