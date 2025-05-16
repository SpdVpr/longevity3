/**
 * Skript pro přidání článku ze souboru do Strapi CMS
 *
 * Použití:
 * node scripts/add-article-from-file.js --file=sauna-article.html --title="The Benefits of Sauna for Longevity and Heart Health" --category="fitness" --locale="en"
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Parsování argumentů
const options = yargs(hideBin(process.argv))
  .option('file', {
    alias: 'f',
    description: 'Cesta k souboru s obsahem článku',
    type: 'string',
    demandOption: true
  })
  .option('title', {
    alias: 't',
    description: 'Název článku',
    type: 'string',
    demandOption: true
  })
  .option('category', {
    alias: 'c',
    description: 'Kategorie článku (slug)',
    type: 'string',
    demandOption: true
  })
  .option('locale', {
    alias: 'l',
    description: 'Jazyk článku',
    type: 'string',
    default: 'en'
  })
  .option('excerpt', {
    alias: 'e',
    description: 'Výtah z článku',
    type: 'string'
  })
  .option('tags', {
    description: 'Tagy článku (oddělené čárkou)',
    type: 'string'
  })
  .option('image', {
    alias: 'i',
    description: 'URL obrázku článku',
    type: 'string'
  })
  .argv;

// Konfigurace API
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
const API_SECRET_KEY = process.env.STRAPI_API_TOKEN || '7112095489283cc66938cab74538ba69d7eee7b0bc001d6fa67a0fb0fde2d844207ea294ea462ab0bfeabf93b7c5a489a7fcbd0bdeecc6fe268bdaebc16ef8e74e9a26e5ccb036e33a5b20086b4648249b3568f47c10c07fbe14a2d95fe0f90597bdf3d3c7cb9344baa64419e9ad4813e52cff2527e3c1ddf09eb618ba114aba';

/**
 * Vytvoří slug z názvu článku
 */
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Odešle článek do API
 */
async function sendArticleToAPI(articleData) {
  console.log('Odesílám článek do API...');

  try {
    // Prepare data for API
    const apiData = {
      data: {
        title: articleData.title,
        Content: articleData.content,
        // excerpt: articleData.excerpt || articleData.title, // Strapi doesn't accept excerpt field
        slug: articleData.slug || createSlug(articleData.title),
        // category: articleData.category, // Category needs to be handled differently
        locale: articleData.locale,
        publishedAt: new Date().toISOString()
      }
    };

    console.log('Odesílám data do API:', JSON.stringify(apiData, null, 2));

    const response = await fetch(`${API_URL}/api/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_SECRET_KEY}`
      },
      body: JSON.stringify(apiData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Článek byl úspěšně vytvořen:', data.data.id);
    return data;
  } catch (error) {
    console.error('Chyba při odesílání článku:', error);
    throw error;
  }
}

/**
 * Hlavní funkce
 */
async function main() {
  try {
    // Načtení obsahu souboru
    const filePath = path.join(process.cwd(), options.file);
    console.log(`Načítám obsah souboru: ${filePath}`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Soubor ${filePath} neexistuje`);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`Obsah souboru načten, délka: ${content.length} znaků`);

    // Parsování tagů
    const tags = options.tags ? options.tags.split(',').map(tag => tag.trim()) : [];

    // Vytvoření dat článku
    const articleData = {
      title: options.title,
      content: content,
      excerpt: options.excerpt,
      category: options.category,
      tags,
      image: options.image,
      locale: options.locale
    };

    // Odeslání článku do API
    const result = await sendArticleToAPI(articleData);
    console.log('Článek byl úspěšně přidán do CMS');

    return result;
  } catch (error) {
    console.error('Chyba při přidávání článku:', error);
    process.exit(1);
  }
}

// Spuštění hlavní funkce
main();
