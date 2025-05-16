import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET /api/profile/[userId]
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'You must be signed in to view this profile' },
        { status: 401 }
      );
    }

    // Check if user is trying to access their own profile
    if (session.user.id !== params.userId) {
      return NextResponse.json(
        { error: 'You can only view your own profile' },
        { status: 403 }
      );
    }

    // Get profile data
    const profile = await prisma.profile.findUnique({
      where: {
        userId: params.userId,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

// PUT /api/profile/[userId]
export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'You must be signed in to update this profile' },
        { status: 401 }
      );
    }

    // Check if user is trying to update their own profile
    if (session.user.id !== params.userId) {
      return NextResponse.json(
        { error: 'You can only update your own profile' },
        { status: 403 }
      );
    }

    const data = await req.json();

    // Validate input
    if (data.height && (isNaN(data.height) || data.height < 0)) {
      return NextResponse.json(
        { error: 'Height must be a positive number' },
        { status: 400 }
      );
    }

    if (data.weight && (isNaN(data.weight) || data.weight < 0)) {
      return NextResponse.json(
        { error: 'Weight must be a positive number' },
        { status: 400 }
      );
    }

    // Convert goals array to string for SQLite
    const goalsString = data.goals ? JSON.stringify(data.goals) : null;

    // Update profile
    const profile = await prisma.profile.update({
      where: {
        userId: params.userId,
      },
      data: {
        bio: data.bio,
        birthdate: data.birthdate ? new Date(data.birthdate) : null,
        gender: data.gender,
        height: data.height ? parseFloat(data.height) : null,
        weight: data.weight ? parseFloat(data.weight) : null,
        goals: goalsString,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
