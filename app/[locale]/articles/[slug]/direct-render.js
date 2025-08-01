// This file provides direct rendering of Strapi blocks
// It's imported in the article page component

// Strapi API configuration from environment variables
export const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
export const API_TOKEN = process.env.STRAPI_API_TOKEN;

// Function to get the raw article data with blocks
export async function getArticleWithBlocks(slug, locale = 'en') {
  try {
    console.log(`DIRECT-RENDER: Fetching article with slug ${slug}`);

    // Use the populate=deep parameter to get all nested relations
    const url = `${API_URL}/api/articles?filters[slug][$eq]=${slug}&populate=deep&locale=${locale}`;
    console.log('DIRECT-RENDER: URL:', url);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      cache: 'no-store' // Disable caching to always get fresh data
    });

    if (!response.ok) {
      console.error('DIRECT-RENDER: Failed to fetch article:', response.status, response.statusText);
      throw new Error(`Failed to fetch article: ${response.status}`);
    }

    const data = await response.json();
    console.log('DIRECT-RENDER: Article data received');

    // Log the full data structure for debugging
    console.log('DIRECT-RENDER: Full article data:', JSON.stringify(data, null, 2));

    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      console.error('DIRECT-RENDER: Article not found or invalid data format');
      return null;
    }

    // Get the first article (should be the only one with this slug)
    const article = data.data[0];
    console.log('DIRECT-RENDER: Article ID:', article.id);

    // Check if the article has blocks
    let blocks = [];

    if (article.attributes && article.attributes.blocks) {
      console.log('DIRECT-RENDER: Found blocks in attributes');
      blocks = article.attributes.blocks;
    } else if (article.blocks) {
      console.log('DIRECT-RENDER: Found blocks directly in article');
      blocks = article.blocks;
    }

    // Log the blocks structure
    console.log('DIRECT-RENDER: Blocks structure:', JSON.stringify(blocks, null, 2));
    console.log('DIRECT-RENDER: Number of blocks:', blocks.length);

    // Create a processed article object
    const processedArticle = {
      id: article.id,
      title: article.attributes ? article.attributes.title : article.title,
      excerpt: article.attributes ? article.attributes.description : article.description,
      slug: article.attributes ? article.attributes.slug : article.slug,
      publishedAt: article.attributes ? article.attributes.publishedAt : article.publishedAt,
      blocks: blocks,
      rawData: article // Keep the raw data for debugging
    };

    // Get the image URL
    if (article.attributes && article.attributes.cover && article.attributes.cover.data) {
      processedArticle.image = article.attributes.cover.data.attributes.url;
      if (processedArticle.image.startsWith('/')) {
        processedArticle.image = `${API_URL}${processedArticle.image}`;
      }
    } else if (article.cover && article.cover.url) {
      processedArticle.image = article.cover.url;
      if (processedArticle.image.startsWith('/')) {
        processedArticle.image = `${API_URL}${processedArticle.image}`;
      }
    } else if (article.cover) {
      // Handle the case where cover is a direct URL
      processedArticle.image = typeof article.cover === 'string' ? article.cover : article.cover.url;
      if (processedArticle.image && processedArticle.image.startsWith('/')) {
        processedArticle.image = `${API_URL}${processedArticle.image}`;
      }
    }

    // Get the category
    if (article.attributes && article.attributes.category && article.attributes.category.data) {
      processedArticle.category = {
        id: article.attributes.category.data.id,
        name: article.attributes.category.data.attributes.name,
        slug: article.attributes.category.data.attributes.slug
      };
    } else if (article.category) {
      processedArticle.category = {
        id: article.category.id || 0,
        name: article.category.name || '',
        slug: article.category.slug || ''
      };
    }

    // Clean up the blocks to ensure they're in the correct format
    processedArticle.blocks = blocks.map(block => {
      // Make sure the block has the __component property
      if (!block.__component && block.type) {
        block.__component = `shared.${block.type}`;
      }

      // Handle rich text blocks
      if (block.__component === 'shared.rich-text' && !block.body && block.content) {
        block.body = block.content;
      }

      return block;
    });

    return processedArticle;
  } catch (error) {
    console.error('DIRECT-RENDER: Error fetching article with blocks:', error);
    return null;
  }
}

// React component to render a Strapi block
export function RenderBlock({ block, index }) {
  console.log(`DIRECT-RENDER: Rendering block ${index}:`, block.__component);

  if (!block || !block.__component) {
    console.log(`DIRECT-RENDER: Invalid block at index ${index}`);
    return null;
  }

  // Handle rich text blocks
  if (block.__component === 'shared.rich-text') {
    console.log(`DIRECT-RENDER: Rendering rich-text block ${index}`);

    // Check for body field
    if (block.body) {
      console.log(`DIRECT-RENDER: Rich-text block ${index} has body field`);

      // Clean up the body content by removing "Drag" text that appears in the Strapi editor
      let cleanBody = block.body;
      cleanBody = cleanBody.replace(/\n\n\nDrag\n/g, '');
      cleanBody = cleanBody.replace(/\nDrag\n/g, '');
      cleanBody = cleanBody.replace(/Drag\n/g, '');

      return (
        <div
          key={`rich-text-${index}`}
          dangerouslySetInnerHTML={{ __html: cleanBody }}
          className="mb-6 article-content"
        />
      );
    }
    // Check for content field (alternative field name)
    else if (block.content) {
      console.log(`DIRECT-RENDER: Rich-text block ${index} has content field`);

      // Clean up the content
      let cleanContent = block.content;
      cleanContent = cleanContent.replace(/\n\n\nDrag\n/g, '');
      cleanContent = cleanContent.replace(/\nDrag\n/g, '');
      cleanContent = cleanContent.replace(/Drag\n/g, '');

      return (
        <div
          key={`rich-text-${index}`}
          dangerouslySetInnerHTML={{ __html: cleanContent }}
          className="mb-6 article-content"
        />
      );
    }
    // No content found
    else {
      console.log(`DIRECT-RENDER: Rich-text block ${index} has no content`);
      return (
        <div key={`rich-text-${index}`} className="my-4 p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-500">Empty rich text block</p>
        </div>
      );
    }
  }

  // Handle media blocks
  if (block.__component === 'shared.media' && block.media) {
    console.log(`DIRECT-RENDER: Rendering media block ${index}`);

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

    console.log(`DIRECT-RENDER: Media block ${index} URL:`, imageUrl);

    return (
      <div key={`media-${index}`} className="my-8">
        <img
          src={imageUrl}
          alt={altText}
          className="w-full rounded-lg"
        />
      </div>
    );
  }

  // Handle quote blocks
  if (block.__component === 'shared.quote' && block.quote) {
    console.log(`DIRECT-RENDER: Rendering quote block ${index}`);
    return (
      <blockquote
        key={`quote-${index}`}
        className="border-l-4 border-gray-300 pl-4 italic my-8"
      >
        {block.quote}
      </blockquote>
    );
  }

  // Handle slider blocks
  if (block.__component === 'shared.slider' && block.files) {
    console.log(`DIRECT-RENDER: Rendering slider block ${index}`);

    let images = [];

    if (block.files.data && Array.isArray(block.files.data)) {
      images = block.files.data.map(file => {
        let imageUrl = file.attributes.url;
        if (imageUrl.startsWith('/')) {
          imageUrl = `${API_URL}${imageUrl}`;
        }
        return {
          url: imageUrl,
          alt: file.attributes.alternativeText || 'Slider image'
        };
      });
    }

    return (
      <div key={`slider-${index}`} className="my-8">
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {images.map((image, i) => (
            <div key={`slide-${i}`} className="flex-shrink-0">
              <img
                src={image.url}
                alt={image.alt}
                className="h-64 w-auto rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback for unknown block types
  console.log(`DIRECT-RENDER: Unknown block component: ${block.__component}`);
  return (
    <div key={`unknown-${index}`} className="my-4 p-4 bg-gray-100 rounded">
      <p className="text-sm text-gray-500">Unsupported content block: {block.__component}</p>
    </div>
  );
}

// React component to render all blocks
export function RenderBlocks({ blocks }) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    console.log('DIRECT-RENDER: No blocks to render');
    return (
      <div className="bg-yellow-50 p-6 rounded-lg mb-6">
        <h3 className="text-yellow-800 font-bold mb-2">No Content Blocks</h3>
        <p className="text-yellow-700">
          This article does not have any content blocks.
        </p>
      </div>
    );
  }

  console.log('DIRECT-RENDER: Rendering', blocks.length, 'blocks');

  return (
    <div className="article-content">
      {blocks.map((block, index) => (
        <RenderBlock key={index} block={block} index={index} />
      ))}
    </div>
  );
}
