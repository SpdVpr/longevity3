/**
 * API route for disabling preview mode
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const redirect = searchParams.get('redirect') || '/';
    
    // Clear preview cookie
    cookies().delete('preview');
    
    // Redirect to the specified URL or home page
    return NextResponse.redirect(new URL(redirect, request.url));
  } catch (error) {
    console.error('Error disabling preview mode:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
