const fetch = require('node-fetch');
const path = require('path');

// Načtení proměnných prostředí
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Konfigurace
const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

/**
 * Generuje obsah článku pomocí Perplexity AI
 */
async function generateArticleContent(title, categoryContext = '') {
  console.log(`Generuji obsah pro článek: ${title}`);
  
  const prompt = `Write a comprehensive, well-researched article about "${title}" for a longevity and health website. 

Requirements:
- Write in English
- Target audience: people interested in longevity, health optimization, and wellness
- Length: 1500-2000 words
- Include scientific references and studies where relevant
- Structure with clear headings and subheadings
- Make it engaging and informative
- Focus on practical, actionable advice
${categoryContext ? `- Context: This article is for the ${categoryContext} category` : ''}

Please provide the article content in HTML format with proper headings (h2, h3), paragraphs, and lists.
Start with a brief meta description (150-200 characters) on the first line.

Format your response with:
1. First line: Meta description
2. Then the full article content in HTML format

Use proper HTML tags:
- <h2> for main sections
- <h3> for subsections  
- <p> for paragraphs
- <ul> and <li> for lists
- <strong> for emphasis`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extract meta description (first line) and content
    const lines = content.split('\n');
    const excerpt = lines[0].replace(/^Meta description:\s*/i, '').trim();
    let articleContent = lines.slice(1).join('\n').trim();

    // Clean up the content - remove meta description if it appears in the content
    articleContent = articleContent.replace(/^Meta description:\s*.*$/im, '').trim();
    articleContent = articleContent.replace(/^\*\*Meta description:\*\*\s*.*$/im, '').trim();

    // Remove any leading/trailing whitespace and empty lines
    articleContent = articleContent.replace(/^\s*\n+/, '').replace(/\n+\s*$/, '');

    return {
      excerpt: excerpt || `Comprehensive guide about ${title} for longevity and health optimization.`,
      content: articleContent || content
    };

  } catch (error) {
    console.error('Error generating article with Perplexity:', error);
    throw error;
  }
}

/**
 * Vytvoří článek v Strapi CMS
 */
async function createArticleInStrapi(articleData, categoryId = null) {
  console.log(`Vytvářím článek v Strapi: ${articleData.title}`);
  
  try {
    // Create slug from title
    const slug = articleData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Prepare description (max 80 characters)
    let description = articleData.excerpt || articleData.title;
    if (description.length > 80) {
      description = description.substring(0, 77) + '...';
    }

    // Prepare data for Strapi using the blocks structure
    const strapiData = {
      data: {
        title: articleData.title,
        description: description,
        slug: slug,
        blocks: [
          {
            __component: 'shared.rich-text',
            body: `<div class="article-content">${articleData.content}</div>`
          }
        ],
        publishedAt: new Date().toISOString(),
        locale: 'en'
      }
    };

    // Add category if provided
    if (categoryId) {
      strapiData.data.category = categoryId;
    }

    const response = await fetch(`${STRAPI_API_URL}/api/articles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(strapiData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Strapi API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    console.log(`Článek vytvořen s ID: ${result.data.id}`);
    return result.data;

  } catch (error) {
    console.error('Error creating article in Strapi:', error);
    throw error;
  }
}

/**
 * Hlavní funkce pro generování a publikování článku
 */
async function generateAndPublishArticle(title, categoryId = null, categoryContext = '') {
  try {
    console.log('=== ZAČÍNÁM GENEROVÁNÍ ČLÁNKU ===');
    
    // Step 1: Generate article content with Perplexity
    const articleData = await generateArticleContent(title, categoryContext);
    console.log('✓ Obsah článku vygenerován');
    console.log(`Název: ${title}`);
    console.log(`Excerpt: ${articleData.excerpt}`);
    console.log(`Délka obsahu: ${articleData.content.length} znaků`);
    
    // Step 2: Create article in Strapi
    const strapiArticle = await createArticleInStrapi({
      title: title,
      excerpt: articleData.excerpt,
      content: articleData.content
    }, categoryId);
    console.log('✓ Článek publikován do Strapi CMS');
    
    console.log('=== GENEROVÁNÍ ČLÁNKU DOKONČENO ===');
    
    return {
      success: true,
      article: strapiArticle,
      generatedData: articleData
    };

  } catch (error) {
    console.error('=== GENEROVÁNÍ ČLÁNKU SELHALO ===');
    console.error('Chyba:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  generateArticleContent,
  createArticleInStrapi,
  generateAndPublishArticle
};
