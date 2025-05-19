// This file helps debug the article data structure
// It's imported in the article page component

// HARDCODED Strapi API URL and token
const API_URL = 'https://special-acoustics-b9adb26838.strapiapp.com';
const API_TOKEN = '20096e270ae3b90065ca95970e34cda9ef7f3de056a0d9adb2edae62f158651bc218a1234832b338b1251291099daf1049d60d759f1935c2e2371f20f2cee68a6909567ade4b3f1c7be51f8effb548e7511570359ec3c6cbd33e83c6bac8e8c9f2eda66441986eb27f15897ccda1564dcd335552da089dff40317b9950c23477';

// Function to get the raw article data for debugging
export async function getRawArticleData(slug, locale = 'en') {
  try {
    console.log(`DEBUG - Fetching raw article data for slug ${slug}`);
    
    const url = `${API_URL}/api/articles?filters[slug][$eq]=${slug}&populate=deep&locale=${locale}`;
    console.log('DEBUG - URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });
    
    if (!response.ok) {
      console.error('DEBUG - Failed to fetch article:', response.status, response.statusText);
      throw new Error(`Failed to fetch article: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('DEBUG - Raw article data received');
    
    // Log the full data structure
    console.log('DEBUG - Full article data structure:', JSON.stringify(data, null, 2));
    
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      console.error('DEBUG - Article not found or invalid data format');
      return null;
    }
    
    const article = data.data[0];
    
    // Log the article structure
    console.log('DEBUG - Article ID:', article.id);
    console.log('DEBUG - Article has attributes:', !!article.attributes);
    console.log('DEBUG - Article has documentId:', !!article.documentId);
    
    // Check for blocks
    if (article.attributes && article.attributes.blocks) {
      console.log('DEBUG - Article has blocks in attributes');
      console.log('DEBUG - Number of blocks:', article.attributes.blocks.length);
      
      // Log the first block
      if (article.attributes.blocks.length > 0) {
        const firstBlock = article.attributes.blocks[0];
        console.log('DEBUG - First block component:', firstBlock.__component);
        console.log('DEBUG - First block has body:', !!firstBlock.body);
        console.log('DEBUG - First block body preview:', firstBlock.body ? firstBlock.body.substring(0, 100) + '...' : 'N/A');
      }
    } else if (article.blocks) {
      console.log('DEBUG - Article has blocks directly');
      console.log('DEBUG - Number of blocks:', article.blocks.length);
      
      // Log the first block
      if (article.blocks.length > 0) {
        const firstBlock = article.blocks[0];
        console.log('DEBUG - First block component:', firstBlock.__component);
        console.log('DEBUG - First block has body:', !!firstBlock.body);
        console.log('DEBUG - First block body preview:', firstBlock.body ? firstBlock.body.substring(0, 100) + '...' : 'N/A');
      }
    } else {
      console.log('DEBUG - Article does not have blocks');
    }
    
    return article;
  } catch (error) {
    console.error('DEBUG - Error fetching raw article data:', error);
    return null;
  }
}

// Function to extract content from blocks
export function extractContentFromBlocks(blocks) {
  if (!blocks || !Array.isArray(blocks)) {
    console.log('DEBUG - No blocks to extract content from');
    return '';
  }
  
  console.log('DEBUG - Extracting content from', blocks.length, 'blocks');
  
  let content = '';
  
  blocks.forEach((block, index) => {
    console.log(`DEBUG - Processing block ${index}, component: ${block.__component}`);
    
    if (block.__component === 'shared.rich-text') {
      console.log(`DEBUG - Block ${index} is rich-text`);
      console.log(`DEBUG - Block ${index} has body:`, !!block.body);
      
      if (block.body) {
        content += block.body;
        console.log(`DEBUG - Added rich-text content from block ${index}`);
      }
    } else if (block.__component === 'shared.media') {
      console.log(`DEBUG - Block ${index} is media`);
      console.log(`DEBUG - Block ${index} has media:`, !!block.media);
      
      if (block.media) {
        let url = '';
        
        if (block.media.data && block.media.data.attributes) {
          url = block.media.data.attributes.url || '';
        } else if (block.media.url) {
          url = block.media.url;
        }
        
        if (url) {
          // If the URL is relative, prepend the API URL
          if (url.startsWith('/')) {
            url = `${API_URL}${url}`;
          }
          
          content += `<img src="${url}" alt="Article image" class="w-full rounded-lg" />`;
          console.log(`DEBUG - Added media content from block ${index}`);
        }
      }
    } else if (block.__component === 'shared.quote') {
      console.log(`DEBUG - Block ${index} is quote`);
      console.log(`DEBUG - Block ${index} has quote:`, !!block.quote);
      
      if (block.quote) {
        content += `<blockquote>${block.quote}</blockquote>`;
        console.log(`DEBUG - Added quote content from block ${index}`);
      }
    } else {
      console.log(`DEBUG - Unknown block component: ${block.__component}`);
    }
  });
  
  console.log('DEBUG - Extracted content length:', content.length);
  return content;
}
