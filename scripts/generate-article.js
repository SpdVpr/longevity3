/**
 * Script pro generování článků pomocí Perplexity AI a jejich přidání do Strapi CMS
 *
 * Použití:
 * node scripts/generate-article.js --title="Název článku" --category="kategorie" --tags="tag1,tag2" --locale="en"
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { program } = require('commander');

// Načtení proměnných prostředí ze souboru .env.local
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Konfigurace
const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

// Definice příkazů
program
  .option('--title <title>', 'Název článku')
  .option('--category <category>', 'Kategorie článku (slug)')
  .option('--tags <tags>', 'Tagy článku (oddělené čárkou)')
  .option('--locale <locale>', 'Jazyk článku', 'en')
  .option('--image <image>', 'URL obrázku článku')
  .option('--author <author>', 'Autor článku', 'Longevity Team')
  .option('--output <output>', 'Výstupní soubor pro uložení článku', 'article.json');

program.parse(process.argv);
const options = program.opts();

// Kontrola povinných parametrů
if (!options.title || !options.category) {
  console.error('Chyba: Parametry --title a --category jsou povinné');
  process.exit(1);
}

// Kontrola API klíčů
if (!PERPLEXITY_API_KEY) {
  console.error('Chyba: Proměnná prostředí PERPLEXITY_API_KEY není nastavena');
  process.exit(1);
}

if (!STRAPI_API_TOKEN) {
  console.error('Chyba: Proměnná prostředí STRAPI_API_TOKEN není nastavena');
  process.exit(1);
}

/**
 * Generuje obsah článku pomocí Perplexity AI
 */
async function generateArticleContent(title, category, tags) {
  console.log(`Generuji obsah pro článek: ${title}`);
  console.log(`API klíč Perplexity: ${PERPLEXITY_API_KEY ? 'Nastaven' : 'Chybí'}`);
  console.log(`Kategorie: ${category}`);
  console.log(`Tagy: ${tags || 'žádné'}`);


  // Create prompt for Perplexity AI
  const prompt = `
    Write a professional article on the topic "${title}" for a longevity website.

    The article should be in the "${category}" category and include the following tags: ${tags || 'no specific tags'}.

    The article should have the following structure:
    1. Introduction - brief presentation of the topic and its significance for longevity
    2. Main body - divided into several subsections with headings
    3. Conclusion - summary of main points and practical tips

    The article should be based on scientific findings and include references to studies.

    First, provide a short excerpt (150-200 characters) that will serve as a meta description for the article.

    Then, write the main content of the article. Format the content as follows:

    - Use "## " (double hash followed by a space) at the beginning of a line to indicate a main section heading (H2)
    - Use "### " (triple hash followed by a space) at the beginning of a line to indicate a subsection heading (H3)
    - Use "- " (dash followed by a space) at the beginning of a line to create bullet points
    - Leave a blank line between paragraphs, headings, and lists

    The article should be approximately 1500-2000 words long and written in English.
    Use scientific language but make it accessible to a general audience interested in health and longevity.

    Do not include any HTML tags or formatting in your response. Just provide the raw text with clear paragraph breaks and markdown-style headings and lists.
  `;

  try {
    console.log('Volám Perplexity API...');
    console.log('URL:', 'https://api.perplexity.ai/chat/completions');
    console.log('Model:', 'sonar');

    // Volání Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000
      })
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract excerpt and content
    const excerptMatch = content.match(/^(.*?)(?:\n\n|\r\n\r\n)/);
    const excerpt = excerptMatch ? excerptMatch[1].replace(/<[^>]*>/g, '').trim() : '';
    const articleContent = content.replace(excerptMatch ? excerptMatch[0] : '', '').trim();

    console.log('Vygenerovaný obsah článku:');
    console.log('Excerpt:', excerpt);
    console.log('Content preview:', articleContent.substring(0, 200) + '...');
    console.log('Content length:', articleContent.length);

    // Convert markdown headings to HTML
    let htmlContent = articleContent
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/^#### (.*?)$/gm, '<h4>$1</h4>');

    // Convert markdown lists to HTML
    htmlContent = htmlContent.replace(/^- (.*?)$/gm, '<li>$1</li>');

    // Wrap paragraphs in <p> tags (any line that doesn't start with <h2>, <h3>, <h4>, <li>)
    const lines = htmlContent.split('\n\n');
    htmlContent = lines.map(line => {
      line = line.trim();
      if (line && !line.startsWith('<h') && !line.startsWith('<li>')) {
        return `<p>${line}</p>`;
      }
      return line;
    }).join('\n\n');

    // Wrap lists in <ul> tags
    htmlContent = htmlContent.replace(/(<li>.*?<\/li>\n)+/gs, match => `<ul>\n${match}</ul>\n`);

    console.log('HTML content preview:', htmlContent.substring(0, 200) + '...');

    return {
      excerpt,
      content: htmlContent
    };
  } catch (error) {
    console.error('Chyba při generování obsahu:', error);
    throw error;
  }
}

/**
 * Konvertuje HTML obsah do Strapi blocks formátu
 */
function convertHtmlToStrapiBlocks(htmlContent) {
  const blocks = [];

  // Split content by HTML tags
  const sections = htmlContent.split(/(<h[1-6][^>]*>.*?<\/h[1-6]>|<p>.*?<\/p>|<ul>.*?<\/ul>|<ol>.*?<\/ol>)/g);

  sections.forEach(section => {
    if (!section.trim()) return;

    if (section.match(/<h[1-6]/)) {
      // Heading
      const level = parseInt(section.match(/<h([1-6])/)[1]);
      const text = section.replace(/<\/?h[1-6][^>]*>/g, '').trim();
      blocks.push({
        type: 'heading',
        level: level,
        children: [{ type: 'text', text: text }]
      });
    } else if (section.match(/<p>/)) {
      // Paragraph
      const text = section.replace(/<\/?p>/g, '').trim();
      if (text) {
        blocks.push({
          type: 'paragraph',
          children: [{ type: 'text', text: text }]
        });
      }
    } else if (section.match(/<ul>|<ol>/)) {
      // List
      const listType = section.includes('<ul>') ? 'unordered' : 'ordered';
      const items = section.match(/<li>(.*?)<\/li>/g) || [];
      const listItems = items.map(item => ({
        type: 'list-item',
        children: [{ type: 'text', text: item.replace(/<\/?li>/g, '').trim() }]
      }));
      if (listItems.length > 0) {
        blocks.push({
          type: 'list',
          format: listType,
          children: listItems
        });
      }
    }
  });

  return blocks;
}

/**
 * Odešle článek přímo do Strapi CMS
 */
async function sendArticleToStrapi(articleData) {
  console.log('Odesílám článek do Strapi CMS...');

  try {
    // Create slug from title
    const slug = articleData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Prepare data for Strapi using the blocks structure
    const strapiData = {
      data: {
        title: articleData.title,
        description: articleData.excerpt || articleData.title,
        slug: slug,
        blocks: [
          {
            __component: 'shared.rich-text',
            body: `<div class="article-content">${articleData.content}</div>`
          }
        ],
        publishedAt: articleData.publishedAt,
        locale: articleData.locale
      }
    };

    console.log('Odesílám data do Strapi:', JSON.stringify(strapiData, null, 2));

    const response = await fetch(`${STRAPI_API_URL}/api/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      },
      body: JSON.stringify(strapiData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Strapi API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Článek byl úspěšně vytvořen v Strapi:', data.data.id);
    return data;
  } catch (error) {
    console.error('Chyba při odesílání článku do Strapi:', error);
    throw error;
  }
}

/**
 * Hlavní funkce
 */
async function main() {
  try {
    // Parsování tagů
    const tags = options.tags ? options.tags.split(',').map(tag => tag.trim()) : [];

    // Generování obsahu článku
    const { excerpt, content } = await generateArticleContent(options.title, options.category, options.tags);

    // Vytvoření dat článku
    const articleData = {
      title: options.title,
      excerpt,
      content,
      category: options.category,
      tags,
      author: options.author,
      image: options.image,
      locale: options.locale,
      publishedAt: new Date().toISOString()
    };

    // Uložení článku do souboru
    fs.writeFileSync(
      path.join(process.cwd(), options.output),
      JSON.stringify(articleData, null, 2)
    );
    console.log(`Článek byl uložen do souboru: ${options.output}`);

    // Odeslání článku do Strapi CMS
    const result = await sendArticleToStrapi(articleData);
    console.log('Článek byl úspěšně přidán do Strapi CMS');

    return result;
  } catch (error) {
    console.error('Chyba při generování článku:', error);
    process.exit(1);
  }
}

// Spuštění hlavní funkce
main();
