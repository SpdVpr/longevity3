const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

// Načtení proměnných prostředí
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Konfigurace
const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function publishFitnessArticle() {
  try {
    console.log('=== PUBLIKOVÁNÍ ČLÁNKU O FITNESS ===');
    
    // Načti obsah článku
    const articleContent = fs.readFileSync(path.join(__dirname, 'fitness-article.html'), 'utf8');
    
    // Aktualizuj existující článek (ID 29)
    const articleData = {
      data: {
        blocks: [
          {
            __component: 'shared.rich-text',
            body: articleContent
          }
        ]
      }
    };
    
    console.log('Aktualizuji existující článek (ID 29)...');

    // Aktualizuj článek
    const createResponse = await fetch(`${STRAPI_API_URL}/api/articles/cktlexjcbzqbkoctq9d1ysjc`, {
      method: 'PUT',
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
    console.log('✅ Článek byl úspěšně aktualizován!');
    console.log(`ID: ${result.data.id}`);
    console.log(`Název: ${result.data.title}`);
    console.log(`Slug: ${result.data.slug}`);
    
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
    
    console.log(`\n🔗 Článek bude dostupný na: https://www.longevitygrow.com/en/articles/${result.data.slug}`);
    
  } catch (error) {
    console.error('❌ Chyba při publikování článku:', error.message);
  }
}

publishFitnessArticle();
