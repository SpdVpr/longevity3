const fetch = require('node-fetch');
const path = require('path');

// Načtení proměnných prostředí
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Konfigurace
const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * Získá článek ze Strapi
 */
async function getArticle(articleId) {
  try {
    // Nejdříve zkusíme získat všechny články a najít ten správný
    console.log('Fetching all articles to find the target article...');

    const response = await fetch(`${STRAPI_API_URL}/api/articles?populate=*`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch articles: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Najdi článek podle ID nebo názvu
    let targetArticle = null;

    if (data.data && Array.isArray(data.data)) {
      // Zkus najít podle ID
      targetArticle = data.data.find(article => article.id == articleId);

      // Pokud nenalezen podle ID, zkus podle názvu
      if (!targetArticle && articleId === '13') {
        targetArticle = data.data.find(article =>
          article.title && article.title.toLowerCase().includes('complete guide to longevity supplements')
        );
      }
    }

    if (!targetArticle) {
      throw new Error(`Article with ID ${articleId} not found`);
    }

    console.log(`Found article: ${targetArticle.title} (ID: ${targetArticle.id}, DocumentID: ${targetArticle.documentId})`);
    return targetArticle;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
}

/**
 * Vyčistí a přeformátuje obsah článku
 */
function cleanAndFormatContent(htmlContent) {
  if (!htmlContent) return htmlContent;
  
  // Odstranění meta description z obsahu
  let cleanContent = htmlContent.replace(/^.*?Meta description:.*?<\/p>/i, '');
  cleanContent = cleanContent.replace(/^\*\*Meta description:\*\*.*?$/im, '');
  
  // Odstranění div wrapperu pokud existuje
  cleanContent = cleanContent.replace(/^<div class="article-content">/, '');
  cleanContent = cleanContent.replace(/<\/div>$/, '');
  
  // Vyčištění prázdných řádků na začátku
  cleanContent = cleanContent.replace(/^(\s*<p>\s*<\/p>\s*)*/, '');
  
  // Zajištění správného formátování nadpisů
  cleanContent = cleanContent.replace(/<h([1-6])>/g, '<h$1>');
  cleanContent = cleanContent.replace(/<\/h([1-6])>/g, '</h$1>');
  
  // Zajištění správného formátování seznamů
  cleanContent = cleanContent.replace(/<ul>\s*<\/ul>/g, '');
  cleanContent = cleanContent.replace(/<ol>\s*<\/ol>/g, '');
  
  // Odstranění prázdných odstavců
  cleanContent = cleanContent.replace(/<p>\s*<\/p>/g, '');
  
  // Vyčištění nadbytečných mezer
  cleanContent = cleanContent.replace(/\s+/g, ' ').trim();
  
  return cleanContent;
}

/**
 * Aktualizuje článek ve Strapi pomocí documentId
 */
async function updateArticle(article, updatedData) {
  try {
    // Použij documentId pro aktualizaci
    const documentId = article.documentId || article.id;
    console.log(`Updating article using documentId: ${documentId}`);

    const response = await fetch(`${STRAPI_API_URL}/api/articles/${documentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: updatedData })
    });

    console.log(`Update response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Update error data:', errorData);
      throw new Error(`Failed to update article: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
}

/**
 * Hlavní funkce pro úpravu formátování článku
 */
async function updateArticleFormatting(articleId) {
  try {
    console.log(`=== AKTUALIZACE FORMÁTOVÁNÍ ČLÁNKU ID: ${articleId} ===`);
    
    // Krok 1: Získání článku
    console.log('Získávám článek ze Strapi...');
    const article = await getArticle(articleId);
    
    console.log(`Název článku: ${article.title}`);
    console.log(`Současný popis: ${article.description}`);
    
    // Krok 2: Zpracování obsahu z blocks
    let content = '';
    if (article.blocks && Array.isArray(article.blocks)) {
      console.log(`Nalezeno ${article.blocks.length} bloků`);
      
      article.blocks.forEach((block, index) => {
        if (block.__component === 'shared.rich-text' && block.body) {
          console.log(`Zpracovávám blok ${index + 1}`);
          content += block.body;
        }
      });
    }
    
    if (!content) {
      console.error('Nebyl nalezen žádný obsah k úpravě');
      return;
    }
    
    console.log(`Původní délka obsahu: ${content.length} znaků`);
    
    // Krok 3: Vyčištění a přeformátování obsahu
    const cleanedContent = cleanAndFormatContent(content);
    console.log(`Vyčištěná délka obsahu: ${cleanedContent.length} znaků`);
    
    // Krok 4: Příprava nových dat
    const updatedBlocks = [
      {
        __component: 'shared.rich-text',
        body: `<div class="article-content">${cleanedContent}</div>`
      }
    ];
    
    // Krok 5: Aktualizace článku
    console.log('Aktualizuji článek ve Strapi...');
    const updatedArticle = await updateArticle(article, {
      blocks: updatedBlocks
    });
    
    console.log('✓ Článek byl úspěšně aktualizován');
    console.log(`URL článku: ${STRAPI_API_URL}/admin/content-manager/collectionType/api::article.article/${articleId}`);
    
    return updatedArticle;
    
  } catch (error) {
    console.error('=== CHYBA PŘI AKTUALIZACI FORMÁTOVÁNÍ ===');
    console.error('Chyba:', error.message);
    throw error;
  }
}

// Export funkcí
module.exports = {
  updateArticleFormatting,
  getArticle,
  updateArticle,
  cleanAndFormatContent
};

// Spuštění, pokud je script volán přímo
if (require.main === module) {
  const articleId = process.argv[2] || '13'; // Default ID 13 pro "Complete Guide to Longevity Supplements"
  
  updateArticleFormatting(articleId)
    .then(() => {
      console.log('\n✓ Formátování článku bylo úspěšně aktualizováno!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n✗ Chyba při aktualizaci formátování:', error.message);
      process.exit(1);
    });
}
