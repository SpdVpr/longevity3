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
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_SECRET_KEY = process.env.API_SECRET_KEY || 'your-secret-key';
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

// Kontrola Perplexity API klíče
if (!PERPLEXITY_API_KEY) {
  console.error('Chyba: Proměnná prostředí PERPLEXITY_API_KEY není nastavena');
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
 * Odešle článek do API
 */
async function sendArticleToAPI(articleData) {
  console.log('Odesílám článek do API...');

  try {
    // For Strapi, we need to convert the content to a simple string
    // This is because the Content field in Strapi is a string, not a structured object
    const contentString = articleData.content;

    // Prepare the request body
    const requestBody = {
      data: {
        title: articleData.title,
        Content: `<div class="article-content">${contentString}</div>`, // Wrap content in article-content div
        excerpt: articleData.excerpt,
        slug: articleData.slug || articleData.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim(),
        publishedAt: articleData.publishedAt,
        category: articleData.category,
        // tags: articleData.tags, // Tags are handled differently in Strapi
        // author: articleData.author, // Author is handled differently in Strapi
        image: articleData.image,
        locale: articleData.locale
      }
    };

    // Prepare data for API
    const apiData = {
      data: {
        title: articleData.title,
        Content: `<div class="article-content">${contentString}</div>`, // Wrap content in article-content div
        excerpt: articleData.excerpt,
        slug: articleData.slug || articleData.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim(),
        category: articleData.category,
        // tags: articleData.tags, // Tags are handled differently in Strapi
        // author: articleData.author, // Author is handled differently in Strapi
        image: articleData.image,
        locale: articleData.locale,
        publishedAt: articleData.publishedAt
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

    // Odeslání článku do API
    const result = await sendArticleToAPI(articleData);
    console.log('Článek byl úspěšně přidán do CMS');

    return result;
  } catch (error) {
    console.error('Chyba při generování článku:', error);
    process.exit(1);
  }
}

// Spuštění hlavní funkce
main();
