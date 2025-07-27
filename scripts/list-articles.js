const fetch = require('node-fetch');
const path = require('path');

// Načtení proměnných prostředí
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Konfigurace
const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function listAllArticles() {
  try {
    console.log('=== SEZNAM VŠECH ČLÁNKŮ ===');
    
    const response = await fetch(`${STRAPI_API_URL}/api/articles?populate=*`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      console.log('Nebyly nalezeny žádné články');
      return;
    }
    
    console.log(`Celkem nalezeno ${data.data.length} článků:\n`);
    
    data.data.forEach((article, index) => {
      console.log(`${index + 1}. ID: ${article.id}`);
      console.log(`   DocumentID: ${article.documentId || 'Bez documentId'}`);
      console.log(`   Název: ${article.title || 'Bez názvu'}`);
      console.log(`   Slug: ${article.slug || 'Bez slug'}`);
      console.log(`   Popis: ${article.description || 'Bez popisu'}`);
      console.log(`   Vytvořeno: ${article.createdAt}`);
      console.log(`   Publikováno: ${article.publishedAt}`);

      // Zkontroluj obsah
      if (article.blocks && Array.isArray(article.blocks)) {
        console.log(`   Bloků: ${article.blocks.length}`);
        article.blocks.forEach((block, blockIndex) => {
          if (block.__component === 'shared.rich-text') {
            const contentLength = block.body ? block.body.length : 0;
            console.log(`     - Blok ${blockIndex + 1}: rich-text (${contentLength} znaků)`);
          }
        });
      } else {
        console.log(`   Bloků: 0`);
      }

      console.log('   ---');
    });
    
    // Najdi článek "Complete Guide to Longevity Supplements"
    const targetArticle = data.data.find(article => 
      article.title && article.title.toLowerCase().includes('complete guide to longevity supplements')
    );
    
    if (targetArticle) {
      console.log(`\n🎯 NALEZEN CÍLOVÝ ČLÁNEK:`);
      console.log(`   ID: ${targetArticle.id}`);
      console.log(`   Název: ${targetArticle.title}`);
      console.log(`   Slug: ${targetArticle.slug}`);
    } else {
      console.log(`\n❌ Článek "Complete Guide to Longevity Supplements" nebyl nalezen`);
    }
    
  } catch (error) {
    console.error('Chyba při získávání článků:', error.message);
  }
}

listAllArticles();
