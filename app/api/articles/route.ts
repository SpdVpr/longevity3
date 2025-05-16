import { NextRequest, NextResponse } from 'next/server';
import { createArticle } from '@/lib/cms';

// Tajný klíč pro zabezpečení API
const API_SECRET_KEY = process.env.API_SECRET_KEY || 'your-secret-key';

/**
 * POST /api/articles
 * Vytvoří nový článek v Strapi CMS
 */
export async function POST(request: NextRequest) {
  try {
    // Kontrola API klíče
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== API_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or missing API key' },
        { status: 401 }
      );
    }

    // Získání dat z požadavku
    const data = await request.json();

    // Validace dat
    if (!data.title || !data.content || !data.category) {
      return NextResponse.json(
        { error: 'Bad Request: Missing required fields (title, content, category)' },
        { status: 400 }
      );
    }

    // Příprava dat pro Strapi
    const articleData = {
      title: data.title,
      content: data.content, // Use lowercase 'content' for our API
      excerpt: data.excerpt || data.title,
      slug: data.slug || createSlug(data.title),
      category: data.category,
      // tags: data.tags || [], // Tags are handled differently in Strapi
      // author: data.author || 'Longevity Team', // Author is handled differently in Strapi
      image: data.image || null,
      publishedAt: data.publishedAt || new Date().toISOString(),
      locale: data.locale || 'en'
    };

    // Vytvoření článku v Strapi
    const article = await createArticle(articleData);

    // Odpověď s vytvořeným článkem
    return NextResponse.json(
      {
        success: true,
        message: 'Article created successfully',
        data: article
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating article:', error);

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error.message || 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}

/**
 * Vytvoří slug z titulku
 */
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Odstranění speciálních znaků
    .replace(/\s+/g, '-')     // Nahrazení mezer pomlčkami
    .replace(/-+/g, '-')      // Odstranění duplicitních pomlček
    .trim();
}
