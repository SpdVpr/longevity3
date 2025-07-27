const fetch = require('node-fetch');
const path = require('path');

// Načtení proměnných prostředí
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Konfigurace
const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function inspectArticleContent(articleSlug = 'complete-guide-to-longevity-supplements') {
  try {
    console.log('=== INSPEKCE OBSAHU ČLÁNKU ===');

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

    // Vypíš všechny články
    console.log('\n=== VŠECHNY ČLÁNKY ===');
    data.data.forEach(article => {
      console.log(`ID: ${article.id}, Slug: ${article.slug}, Název: ${article.title}`);
    });

    // Najdi článek podle slug
    const article = data.data.find(a => a.slug === articleSlug);

    if (!article) {
      console.error(`Článek s slug "${articleSlug}" nebyl nalezen`);
      return;
    }
    
    console.log(`Název: ${article.title}`);
    console.log(`Popis: ${article.description}`);
    console.log(`Slug: ${article.slug}`);
    console.log(`Bloků: ${article.blocks ? article.blocks.length : 0}`);
    
    if (article.blocks && Array.isArray(article.blocks)) {
      article.blocks.forEach((block, index) => {
        console.log(`\n--- BLOK ${index + 1} ---`);
        console.log(`Komponenta: ${block.__component}`);
        
        if (block.body) {
          console.log(`Délka obsahu: ${block.body.length} znaků`);
          console.log(`CELÝ OBSAH:`);
          console.log(block.body);
          
          // Analýza HTML struktury
          const hasH2 = block.body.includes('<h2>');
          const hasH3 = block.body.includes('<h3>');
          const hasTable = block.body.includes('<table>');
          const hasStrong = block.body.includes('<strong>');
          const hasUL = block.body.includes('<ul>');
          const hasOL = block.body.includes('<ol>');
          
          console.log(`\nHTML elementy:`);
          console.log(`- H2 nadpisy: ${hasH2 ? '✓' : '✗'}`);
          console.log(`- H3 nadpisy: ${hasH3 ? '✓' : '✗'}`);
          console.log(`- Tabulky: ${hasTable ? '✓' : '✗'}`);
          console.log(`- Tučný text: ${hasStrong ? '✓' : '✗'}`);
          console.log(`- Nečíslované seznamy: ${hasUL ? '✓' : '✗'}`);
          console.log(`- Číslované seznamy: ${hasOL ? '✓' : '✗'}`);
        }
      });
    }
    
  } catch (error) {
    console.error('Chyba při inspekci článku:', error.message);
  }
}

inspectArticleContent();
