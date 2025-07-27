const fetch = require('node-fetch');
const path = require('path');

// Načtení proměnných prostředí
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Konfigurace
const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function checkCategories() {
  try {
    console.log('=== KONTROLA KATEGORIÍ ===');
    
    const response = await fetch(`${STRAPI_API_URL}/api/categories?populate=*`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const data = await response.json();
    
    console.log(`Celkem kategorií: ${data.data.length}`);
    
    data.data.forEach(category => {
      console.log(`ID: ${category.id}, Slug: ${category.slug}, Název: ${category.name}`);
    });
    
  } catch (error) {
    console.error('Chyba při načítání kategorií:', error.message);
  }
}

checkCategories();
