const fetch = require('node-fetch');
const path = require('path');

// Načtení proměnných prostředí
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Konfigurace
const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function findFitnessArticle() {
  try {
    console.log('=== HLEDÁNÍ FITNESS ČLÁNKU ===');
    
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
    
    console.log(`Celkem článků: ${data.data.length}`);
    
    // Najdi fitness článek
    const fitnessArticle = data.data.find(article => 
      article.title && article.title.includes('Exercise for Longevity')
    );
    
    if (fitnessArticle) {
      console.log('\n=== FITNESS ČLÁNEK NALEZEN ===');
      console.log(`ID: ${fitnessArticle.id}`);
      console.log(`DocumentID: ${fitnessArticle.documentId}`);
      console.log(`Název: ${fitnessArticle.title}`);
      console.log(`Slug: ${fitnessArticle.slug}`);
    } else {
      console.log('Fitness článek nebyl nalezen');
      
      console.log('\n=== VŠECHNY ČLÁNKY ===');
      data.data.forEach(article => {
        console.log(`ID: ${article.id}, DocumentID: ${article.documentId}, Název: ${article.title}`);
      });
    }
    
  } catch (error) {
    console.error('Chyba při hledání článku:', error.message);
  }
}

findFitnessArticle();
