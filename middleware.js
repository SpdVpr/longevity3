import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const locales = ['en'];
const defaultLocale = 'en';

// Export a custom middleware function
export default async function middleware(request) {
  // Special handling for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Handle locale routing
  const pathname = request.nextUrl.pathname;

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // e.g. incoming request is /products
    // The new URL is now /en/products
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
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
  // Match all paths except API routes, static files, and Next.js internals
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|override-api-url.js).*)'
  ]
};
