const fetch = require('node-fetch');
const path = require('path');

// Načtení proměnných prostředí
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Konfigurace
const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function testFeaturedArticlesSpeed() {
  console.log('=== TEST RYCHLOSTI NAČÍTÁNÍ FEATURED ARTICLES ===\n');

  // Test 1: Původní neoptimalizovaný dotaz
  console.log('🔍 Test 1: Původní neoptimalizovaný dotaz (s Content)');
  const start1 = Date.now();
  
  try {
    const queryParams1 = new URLSearchParams({
      'populate[0]': 'category',
      'populate[1]': 'author',
      'populate[2]': 'cover',
      'populate[3]': 'image',
      'populate[4]': 'tags',
      'populate[5]': 'Content',
      'pagination[pageSize]': '3',
      'sort': 'publishedAt:desc'
    }).toString();

    const url1 = `${STRAPI_API_URL}/api/articles?${queryParams1}`;
    
    const response1 = await fetch(url1, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      }
    });

    if (response1.ok) {
      const data1 = await response1.json();
      const end1 = Date.now();
      console.log(`✅ Úspěch: ${end1 - start1}ms`);
      console.log(`📊 Velikost odpovědi: ${JSON.stringify(data1).length} znaků`);
      console.log(`📄 Počet článků: ${data1.data?.length || 0}\n`);
    } else {
      console.log(`❌ Chyba: ${response1.status} ${response1.statusText}\n`);
    }
  } catch (error) {
    const end1 = Date.now();
    console.log(`❌ Chyba: ${end1 - start1}ms - ${error.message}\n`);
  }

  // Test 2: Optimalizovaný dotaz
  console.log('🚀 Test 2: Optimalizovaný dotaz (základní populate)');
  const start2 = Date.now();

  try {
    const queryParams2 = new URLSearchParams({
      'populate': '*',
      'pagination[pageSize]': '3',
      'sort': 'publishedAt:desc'
    }).toString();

    const url2 = `${STRAPI_API_URL}/api/articles?${queryParams2}`;
    
    const response2 = await fetch(url2, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      }
    });

    if (response2.ok) {
      const data2 = await response2.json();
      const end2 = Date.now();
      console.log(`✅ Úspěch: ${end2 - start2}ms`);
      console.log(`📊 Velikost odpovědi: ${JSON.stringify(data2).length} znaků`);
      console.log(`📄 Počet článků: ${data2.data?.length || 0}\n`);
    } else {
      console.log(`❌ Chyba: ${response2.status} ${response2.statusText}\n`);
    }
  } catch (error) {
    const end2 = Date.now();
    console.log(`❌ Chyba: ${end2 - start2}ms - ${error.message}\n`);
  }

  // Test 3: Minimální dotaz
  console.log('⚡ Test 3: Minimální dotaz (jen základní data)');
  const start3 = Date.now();
  
  try {
    const queryParams3 = new URLSearchParams({
      'fields[0]': 'title',
      'fields[1]': 'slug',
      'fields[2]': 'description',
      'fields[3]': 'publishedAt',
      'pagination[pageSize]': '3',
      'sort': 'publishedAt:desc'
    }).toString();

    const url3 = `${STRAPI_API_URL}/api/articles?${queryParams3}`;
    
    const response3 = await fetch(url3, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      }
    });

    if (response3.ok) {
      const data3 = await response3.json();
      const end3 = Date.now();
      console.log(`✅ Úspěch: ${end3 - start3}ms`);
      console.log(`📊 Velikost odpovědi: ${JSON.stringify(data3).length} znaků`);
      console.log(`📄 Počet článků: ${data3.data?.length || 0}\n`);
    } else {
      console.log(`❌ Chyba: ${response3.status} ${response3.statusText}\n`);
    }
  } catch (error) {
    const end3 = Date.now();
    console.log(`❌ Chyba: ${end3 - start3}ms - ${error.message}\n`);
  }

  console.log('=== DOPORUČENÍ ===');
  console.log('✅ Použij optimalizovaný dotaz (Test 2) pro nejlepší poměr rychlosti a dat');
  console.log('✅ Minimální dotaz (Test 3) je nejrychlejší, ale chybí obrázky a kategorie');
  console.log('❌ Vyhni se načítání Content bloku pro homepage - je velmi pomalý');
}

testFeaturedArticlesSpeed();
