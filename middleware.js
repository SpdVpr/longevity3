import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Export a custom middleware function
export default async function middleware(request) {
  // Special handling for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check for protected routes
  const protectedPaths = ['/dashboard', '/dashboard/profile', '/dashboard/bioage-history'];
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.includes(path)
  );

  if (isProtectedPath) {
    const token = await getToken({ req: request });

    // If the user is not authenticated, redirect to the sign-in page
    if (!token) {
      // Create the sign-in URL with the current URL as the callbackUrl
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', request.url);

      return NextResponse.redirect(signInUrl);
    }
  }

  // For all other routes, continue
  return NextResponse.next();
}

export const config = {
  // Only match protected paths that need authentication
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*'
  ]
};
