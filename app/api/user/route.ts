import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

// Create a new instance of PrismaClient for this API route
const prisma = new PrismaClient();

// GET /api/user or GET /api/user?id=123
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'You must be signed in to access user data' },
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
    console.log('Prisma user model in GET method:', prisma.user);

    // If Prisma client is not properly initialized, return error
    if (!prisma.user) {
      console.error('Prisma user model is undefined');
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    // If ID is provided, check if user exists
    if (id) {
      console.log(`Checking if user with ID ${id} exists`);
      
      try {
        // Get user
        const user = await prisma.user.findUnique({
          where: {
            id,
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        });

        if (!user) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        // Check if user is trying to access their own data
        if (user.id !== session.user.id) {
          return NextResponse.json(
            { error: 'You can only access your own user data' },
            { status: 403 }
          );
        }

        return NextResponse.json(user);
      } catch (error) {
        console.error(`Error checking user with ID ${id}:`, error);
        return NextResponse.json(
          { error: `Error checking user: ${error instanceof Error ? error.message : 'Unknown error'}` },
          { status: 500 }
        );
      }
    }
    // Otherwise, return the current user
    else {
      console.log(`Fetching current user: ${session.user.id}`);
      
      try {
        // Get user
        const user = await prisma.user.findUnique({
          where: {
            id: session.user.id,
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        });

        if (!user) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        return NextResponse.json(user);
      } catch (error) {
        console.error('Error fetching current user:', error);
        return NextResponse.json(
          { error: `Error fetching user: ${error instanceof Error ? error.message : 'Unknown error'}` },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Error accessing user data:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
