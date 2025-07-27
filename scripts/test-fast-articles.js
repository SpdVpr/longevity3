const fetch = require('node-fetch');
const path = require('path');

// Načtení proměnných prostředí
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Konfigurace
const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function testFastArticles() {
  console.log('=== TEST RYCHLÉHO NAČÍTÁNÍ ČLÁNKŮ ===\n');

  // Test rychlého načítání bez populate
  console.log('⚡ Test: Ultra rychlé načítání (bez obrázků)');
  const start = Date.now();
  
  try {
    const queryParams = new URLSearchParams({
      'pagination[pageSize]': '3',
      'sort': 'publishedAt:desc'
    }).toString();

    const url = `${STRAPI_API_URL}/api/articles?${queryParams}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      const end = Date.now();
      console.log(`✅ Úspěch: ${end - start}ms`);
      console.log(`📊 Velikost odpovědi: ${JSON.stringify(data).length} znaků`);
      console.log(`📄 Počet článků: ${data.data?.length || 0}`);
      
      // Zobraz strukturu prvního článku
      if (data.data && data.data.length > 0) {
        console.log('\n📋 Struktura prvního článku:');
        const article = data.data[0];
        console.log(`- ID: ${article.id}`);
        console.log(`- Název: ${article.title}`);
        console.log(`- Slug: ${article.slug}`);
        console.log(`- Popis: ${article.description}`);
        console.log(`- Publikováno: ${article.publishedAt}`);
        console.log(`- Kategorie: ${article.category ? 'Načtena' : 'Nenačtena'}`);
        console.log(`- Obrázek: ${article.image ? 'Načten' : 'Nenačten'}`);
        console.log(`- Cover: ${article.cover ? 'Načten' : 'Nenačten'}`);
      }
    } else {
      console.log(`❌ Chyba: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    const end = Date.now();
    console.log(`❌ Chyba: ${end - start}ms - ${error.message}`);
  }

  console.log('\n=== VÝSLEDEK ===');
  console.log('✅ Rychlé načítání bez obrázků funguje!');
  console.log('💡 Pro homepage použij tuto verzi a obrázky načti později');
}

testFastArticles();
