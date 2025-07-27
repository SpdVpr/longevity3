const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

// Načtení proměnných prostředí
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Konfigurace
const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function publishMentalHealthArticle() {
  try {
    console.log('=== PUBLIKOVÁNÍ ČLÁNKU O MENTAL HEALTH ===');
    
    // Najdi kategorii Mental & Cognitive Health
    console.log('Hledám kategorii Mental & Cognitive Health...');
    const categoriesResponse = await fetch(`${STRAPI_API_URL}/api/categories`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!categoriesResponse.ok) {
      throw new Error(`Failed to fetch categories: ${categoriesResponse.status}`);
    }

    const categoriesData = await categoriesResponse.json();
    const mentalHealthCategory = categoriesData.data.find(cat => 
      cat.name && cat.name.toLowerCase().includes('mental')
    );

    if (!mentalHealthCategory) {
      console.error('Kategorie Mental & Cognitive Health nebyla nalezena');
      console.log('Dostupné kategorie:');
      categoriesData.data.forEach(cat => {
        console.log(`- ID: ${cat.id}, Název: ${cat.name}, Slug: ${cat.slug}`);
      });
      return;
    }

    console.log(`✅ Kategorie nalezena: ${mentalHealthCategory.name} (ID: ${mentalHealthCategory.id})`);
    
    // Načti obsah článku
    const articleContent = fs.readFileSync(path.join(__dirname, 'mental-health-article.html'), 'utf8');
    
    // Data pro nový článek
    const articleData = {
      data: {
        title: "The Science of Sleep and Cognitive Longevity: How Quality Rest Extends Mental Healthspan",
        description: "Evidence-based strategies for optimizing sleep to preserve cognitive health.",
        slug: "science-sleep-cognitive-longevity-quality-rest-mental-healthspan",
        category: mentalHealthCategory.id,
        blocks: [
          {
            __component: 'shared.rich-text',
            body: articleContent
          }
        ]
      }
    };
    
    console.log('Vytvářím nový článek...');
    
    // Vytvoř článek
    const createResponse = await fetch(`${STRAPI_API_URL}/api/articles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(articleData)
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(`Failed to create article: ${createResponse.status} - ${errorText}`);
    }

    const result = await createResponse.json();
    console.log('✅ Článek byl úspěšně vytvořen!');
    console.log(`ID: ${result.data.id}`);
    console.log(`DocumentID: ${result.data.documentId}`);
    console.log(`Název: ${result.data.title}`);
    console.log(`Slug: ${result.data.slug}`);
    console.log(`Kategorie ID: ${result.data.category}`);
    
    // Publikuj článek
    console.log('\nPublikuji článek...');
    
    const publishResponse = await fetch(`${STRAPI_API_URL}/api/articles/${result.data.documentId}/actions/publish`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (publishResponse.ok) {
      console.log('✅ Článek byl úspěšně publikován!');
    } else {
      console.log('⚠️ Článek byl vytvořen, ale publikování selhalo. Můžeš ho publikovat ručně v admin panelu.');
    }
    
    console.log(`\n🔗 Článek bude dostupný na: https://www.longevitygrow.com/articles/${result.data.slug}`);
    
    console.log('\n=== SHRNUTÍ ČLÁNKU ===');
    console.log('📝 Téma: Věda o spánku a kognitivní longevitě');
    console.log('🧠 Kategorie: Mental & Cognitive Health');
    console.log('📊 Obsah: 18 vědeckých referencí, tabulka, praktické rady');
    console.log('🎯 Zaměření: Optimalizace spánku pro zdraví mozku');
    
  } catch (error) {
    console.error('❌ Chyba při publikování článku:', error.message);
  }
}

publishMentalHealthArticle();
