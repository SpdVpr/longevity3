// Test script for direct content approach
const axios = require('axios');

// HARDCODED Strapi API URL and token
const API_URL = 'https://special-acoustics-b9adb26838.strapiapp.com';
const API_TOKEN = '20096e270ae3b90065ca95970e34cda9ef7f3de056a0d9adb2edae62f158651bc218a1234832b338b1251291099daf1049d60d759f1935c2e2371f20f2cee68a6909567ade4b3f1c7be51f8effb548e7511570359ec3c6cbd33e83c6bac8e8c9f2eda66441986eb27f15897ccda1564dcd335552da089dff40317b9950c23477';

// Function to extract content from blocks
function extractContentFromBlocks(blocks) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    console.log('DIRECT-CONTENT: No blocks to extract content from');
    return '';
  }

  console.log('DIRECT-CONTENT: Extracting content from', blocks.length, 'blocks');

  let content = '';

  blocks.forEach((block, index) => {
    console.log(`DIRECT-CONTENT: Processing block ${index}, component:`, block.__component);

    if (block.__component === 'shared.rich-text') {
      console.log(`DIRECT-CONTENT: Block ${index} is rich-text`);

      if (block.body) {
        // Clean up the body content by removing "Drag" text that appears in the Strapi editor
        let cleanBody = block.body;
        cleanBody = cleanBody.replace(/\n\n\nDrag\n/g, '');
        cleanBody = cleanBody.replace(/\nDrag\n/g, '');
        cleanBody = cleanBody.replace(/Drag\n/g, '');

        content += cleanBody;
        console.log(`DIRECT-CONTENT: Added rich-text content from block ${index}`);
      } else if (block.content) {
        // Clean up the content
        let cleanContent = block.content;
        cleanContent = cleanContent.replace(/\n\n\nDrag\n/g, '');
        cleanContent = cleanContent.replace(/\nDrag\n/g, '');
        cleanContent = cleanContent.replace(/Drag\n/g, '');

        content += cleanContent;
        console.log(`DIRECT-CONTENT: Added rich-text content from block ${index}`);
      }
    }
  });

  console.log('DIRECT-CONTENT: Extracted content length:', content.length);
  return content;
}

async function testDirectContent() {
  try {
    console.log('Testing direct content approach...');

    const slug = 'aging-clocks-measuring-biological-age-for-longevity-and-healthspan';
    const locale = 'en';

    console.log(`Fetching article with slug: ${slug}`);

    // Use a simple fetch with the slug filter
    const url = `${API_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*&locale=${locale}`;
    console.log('URL:', url);

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });

    const data = response.data;
    console.log('Article data received');

    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      console.error('Article not found or invalid data format');
      return;
    }

    // Get the first article (should be the only one with this slug)
    const article = data.data[0];
    console.log('Article ID:', article.id);

    // Extract the article content
    let content = '';
    let title = '';
    let image = null;

    // Direct properties structure (new Strapi Cloud)
    title = article.title || '';

    // Get image
    if (article.cover) {
      if (typeof article.cover === 'string') {
        image = article.cover;
      } else if (article.cover.url) {
        image = article.cover.url;
      }

      if (image && image.startsWith('/')) {
        image = `${API_URL}${image}`;
      }
    }

    // Get blocks
    if (article.blocks && Array.isArray(article.blocks)) {
      const blocks = article.blocks;
      console.log('Found blocks directly in article:', blocks.length);

      // Extract content from blocks
      content = extractContentFromBlocks(blocks);
    }

    console.log('Result:', {
      title: title,
      hasContent: !!content,
      contentLength: content ? content.length : 0,
      hasImage: !!image
    });

    if (content) {
      console.log('Content preview (first 500 chars):');
      console.log(content.substring(0, 500) + '...');
    }

  } catch (error) {
    console.error('Error testing direct content:', error);
  }
}

testDirectContent();
