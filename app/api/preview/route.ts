/**
 * API route for enabling preview mode
 * This allows editors to preview content before publishing
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Secret key for preview mode authentication
const PREVIEW_SECRET = process.env.PREVIEW_SECRET || 'your-preview-secret-key';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get('secret');
    const slug = searchParams.get('slug');
    const type = searchParams.get('type') || 'article';
    const locale = searchParams.get('locale') || 'en';
    
    // Validate secret
    if (secret !== PREVIEW_SECRET) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Validate slug
    if (!slug) {
      return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
    }
    
    // Set preview cookie
    cookies().set('preview', 'true', {
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });
    
    // Determine redirect URL based on content type
    let redirectUrl = '';
    
    switch (type) {
      case 'article':
        redirectUrl = `/${locale}/articles/${slug}`;
        break;
        
      case 'category':
        redirectUrl = `/${locale}/${slug}`;
        break;
        
      case 'tag':
        redirectUrl = `/${locale}/tags/${slug}`;
        break;
        
      default:
        redirectUrl = `/${locale}`;
    }
    
    // Redirect to the content page
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error('Error enabling preview mode:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
