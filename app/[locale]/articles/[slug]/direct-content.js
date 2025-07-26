// This file provides direct content fetching and rendering for articles
// It's a simpler approach that focuses on getting the content directly

// HARDCODED Strapi API URL and token
export const API_URL = 'https://special-acoustics-b9adb26838.strapiapp.com';
export const API_TOKEN = '20096e270ae3b90065ca95970e34cda9ef7f3de056a0d9adb2edae62f158651bc218a1234832b338b1251291099daf1049d60d759f1935c2e2371f20f2cee68a6909567ade4b3f1c7be51f8effb548e7511570359ec3c6cbd33e83c6bac8e8c9f2eda66441986eb27f15897ccda1564dcd335552da089dff40317b9950c23477';

// Function to get article content directly
export async function getArticleContent(slug, locale = 'en') {
  try {
    console.log(`DIRECT-CONTENT: *** STARTING DIRECT CONTENT FETCH *** Fetching article with slug ${slug}`);

    // Use a simple fetch with the slug filter
    const url = `${API_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*&locale=${locale}`;
    console.log('DIRECT-CONTENT: URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      cache: 'no-store' // Disable caching to always get fresh data
    });
    
    if (!response.ok) {
      console.error('DIRECT-CONTENT: Failed to fetch article:', response.status, response.statusText);
      throw new Error(`Failed to fetch article: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('DIRECT-CONTENT: Article data received');
    
    // Log the full data structure for debugging
    console.log('DIRECT-CONTENT: Full article data:', JSON.stringify(data, null, 2));
    
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      console.error('DIRECT-CONTENT: Article not found or invalid data format');
      return {
        title: 'Article Not Found',
        content: '<p>The requested article could not be found.</p>',
        image: null
      };
    }
    
    // Get the first article (should be the only one with this slug)
    const article = data.data[0];
    console.log('DIRECT-CONTENT: Article ID:', article.id);
    
    // Extract the article content
    let content = '';
    let title = '';
    let image = null;
    
    if (article.attributes) {
      // Standard Strapi v4 structure
      title = article.attributes.title || '';
      
      // Get image
      if (article.attributes.cover && article.attributes.cover.data) {
        const imageData = article.attributes.cover.data.attributes;
        image = imageData.url;
        if (image.startsWith('/')) {
          image = `${API_URL}${image}`;
        }
      }
      
      // Get blocks
      if (article.attributes.blocks && Array.isArray(article.attributes.blocks)) {
        const blocks = article.attributes.blocks;
        console.log('DIRECT-CONTENT: Found blocks in attributes:', blocks.length);
        
        // Extract content from blocks
        content = extractContentFromBlocks(blocks);
      }
    } else {
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
        console.log('DIRECT-CONTENT: Found blocks directly in article:', blocks.length);
        
        // Extract content from blocks
        content = extractContentFromBlocks(blocks);
      }
    }
    
    // If no content was extracted, return an error message
    if (!content) {
      console.error('DIRECT-CONTENT: No content found in article');
      return {
        title,
        content: '<p>No content found in this article.</p>',
        image
      };
    }
    
    return {
      title,
      content,
      image
    };
  } catch (error) {
    console.error('DIRECT-CONTENT: Error fetching article content:', error);
    return {
      title: 'Error',
      content: '<p>An error occurred while fetching the article content.</p>',
      image: null
    };
  }
}

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
    } else if (block.__component === 'shared.media') {
      console.log(`DIRECT-CONTENT: Block ${index} is media`);
      
      if (block.media) {
        let imageUrl = '';
        let altText = 'Article image';
        
        if (block.media.data && block.media.data.attributes) {
          imageUrl = block.media.data.attributes.url;
          altText = block.media.data.attributes.alternativeText || 'Article image';
        } else if (block.media.url) {
          imageUrl = block.media.url;
        } else if (typeof block.media === 'string') {
          imageUrl = block.media;
        }
        
        if (imageUrl.startsWith('/')) {
          imageUrl = `${API_URL}${imageUrl}`;
        }
        
        content += `<div class="my-8"><img src="${imageUrl}" alt="${altText}" class="w-full rounded-lg" /></div>`;
        console.log(`DIRECT-CONTENT: Added media content from block ${index}`);
      }
    } else if (block.__component === 'shared.quote') {
      console.log(`DIRECT-CONTENT: Block ${index} is quote`);
      
      if (block.quote) {
        content += `<blockquote class="border-l-4 border-gray-300 pl-4 italic my-8">${block.quote}</blockquote>`;
        console.log(`DIRECT-CONTENT: Added quote content from block ${index}`);
      }
    } else if (block.__component === 'shared.slider') {
      console.log(`DIRECT-CONTENT: Block ${index} is slider`);
      
      if (block.files && block.files.data && Array.isArray(block.files.data)) {
        content += '<div class="my-8"><div class="flex overflow-x-auto space-x-4 pb-4">';
        
        block.files.data.forEach((file, i) => {
          let imageUrl = file.attributes.url;
          if (imageUrl.startsWith('/')) {
            imageUrl = `${API_URL}${imageUrl}`;
          }
          
          content += `<div class="flex-shrink-0"><img src="${imageUrl}" alt="${file.attributes.alternativeText || 'Slider image'}" class="h-64 w-auto rounded-lg" /></div>`;
        });
        
        content += '</div></div>';
        console.log(`DIRECT-CONTENT: Added slider content from block ${index}`);
      }
    } else {
      console.log(`DIRECT-CONTENT: Unknown block component: ${block.__component}`);
    }
  });
  
  console.log('DIRECT-CONTENT: Extracted content length:', content.length);
  return content;
}

// React component to render article content (removed JSX for compatibility)
export function ArticleContent({ content }) {
  // This component is not used in the current implementation
  // Content is rendered directly in the page component
  return null;
}
