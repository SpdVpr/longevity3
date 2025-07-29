/**
 * Shared transformation utilities for Strapi Cloud compatibility
 * This file contains functions to handle different Strapi data formats
 */

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';

/**
 * Extract image URL from Strapi Cloud cover or image field
 * Handles multiple formats: v4 structure, direct URL, formats, arrays, etc.
 */
export function extractImageUrl(imageField: any, fieldName: string = 'image'): string | null {
  if (!imageField) {
    console.log(`Strapi Cloud Transform - No ${fieldName} field found`);
    return null;
  }

  console.log(`Strapi Cloud Transform - Processing ${fieldName} field:`, typeof imageField);
  console.log(`Strapi Cloud Transform - ${fieldName} structure:`, JSON.stringify(imageField, null, 2));

  let imageUrl = null;

  if (imageField.data && imageField.data.attributes) {
    // Standard Strapi v4 structure
    console.log(`Strapi Cloud Transform - Found standard ${fieldName} structure`);
    imageUrl = imageField.data.attributes.url;
  } else if (imageField.url) {
    // Direct URL in object - Strapi Cloud format
    console.log(`Strapi Cloud Transform - Found ${fieldName} with direct URL`);
    imageUrl = imageField.url;
  } else if (imageField.formats && imageField.formats.large) {
    // Strapi Cloud with formats
    console.log(`Strapi Cloud Transform - Found ${fieldName} with formats property`);
    imageUrl = imageField.formats.large.url;
  } else if (Array.isArray(imageField) && imageField.length > 0) {
    // Strapi Cloud array format
    console.log(`Strapi Cloud Transform - Found ${fieldName} as array, using first item`);
    const firstImage = imageField[0];
    if (firstImage.url) {
      imageUrl = firstImage.url;
    } else if (firstImage.formats && firstImage.formats.large) {
      imageUrl = firstImage.formats.large.url;
    }
  } else if (imageField.id && imageField.mime) {
    // Strapi Cloud direct media object
    console.log(`Strapi Cloud Transform - Found ${fieldName} as direct media object`);
    if (imageField.formats && imageField.formats.large) {
      imageUrl = imageField.formats.large.url;
    } else if (imageField.url) {
      imageUrl = imageField.url;
    }
  } else if (typeof imageField === 'string') {
    // Direct URL string
    console.log(`Strapi Cloud Transform - Found ${fieldName} as string URL`);
    imageUrl = imageField;
  } else {
    console.log(`Strapi Cloud Transform - Unknown ${fieldName} format, available properties:`, Object.keys(imageField));
  }

  // If the URL is relative, prepend the API URL
  if (imageUrl && imageUrl.startsWith('/')) {
    imageUrl = `${API_URL}${imageUrl}`;
  }

  console.log(`Strapi Cloud Transform - Final ${fieldName} URL:`, imageUrl);
  return imageUrl;
}

/**
 * Transform article data from Strapi API response with Strapi Cloud compatibility
 */
export function transformArticleDataWithImages(article: any, categorySlug?: string) {
  try {
    console.log('Strapi Cloud Transform - Transforming article data:', {
      id: article.id,
      hasAttributes: !!article.attributes,
      hasDocumentId: !!article.documentId,
      title: article.attributes?.title || article.title
    });

    // Handle different article structures
    let attributes: any;

    if (article.attributes) {
      // Standard Strapi v4 structure with attributes
      attributes = article.attributes;
      console.log('Strapi Cloud Transform - Using standard attributes structure');
    } else if (article.documentId) {
      // New Strapi Cloud structure with documentId and direct properties
      attributes = article;
      console.log('Strapi Cloud Transform - Using direct properties as attributes (documentId structure)');
    } else {
      // Fallback to the article itself
      attributes = article;
      console.log('Strapi Cloud Transform - Using article directly as attributes');
    }

    // Get the image URL - try cover first, then image field
    let imageUrl = extractImageUrl(attributes.cover, 'cover');
    if (!imageUrl) {
      imageUrl = extractImageUrl(attributes.image, 'image');
    }

    // Get the category
    let category = null;
    if (attributes.category) {
      if (attributes.category.data && attributes.category.data.attributes) {
        // Standard Strapi v4 relation
        category = {
          id: attributes.category.data.id,
          name: attributes.category.data.attributes.name,
          slug: attributes.category.data.attributes.slug
        };
      } else if (attributes.category.id && (attributes.category.name || attributes.category.slug)) {
        // Direct category object
        category = {
          id: attributes.category.id,
          name: attributes.category.name || attributes.category.slug,
          slug: attributes.category.slug || attributes.category.name?.toLowerCase().replace(/\s+/g, '-')
        };
      } else if (typeof attributes.category === 'string') {
        // Just a category name or slug
        category = {
          id: null,
          name: attributes.category,
          slug: categorySlug || attributes.category.toLowerCase().replace(/\s+/g, '-')
        };
      }
    } else if (categorySlug) {
      // Use provided category slug as fallback
      category = {
        id: null,
        name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
        slug: categorySlug
      };
    }

    const transformedArticle = {
      id: article.id,
      documentId: article.documentId || null,
      title: attributes.title || 'Untitled',
      description: attributes.description || '',
      slug: attributes.slug || '',
      image: imageUrl,
      category: category,
      publishedAt: attributes.publishedAt || attributes.createdAt || new Date().toISOString(),
      createdAt: attributes.createdAt || new Date().toISOString(),
      updatedAt: attributes.updatedAt || new Date().toISOString()
    };

    console.log('Strapi Cloud Transform - Final transformed article:', {
      id: transformedArticle.id,
      title: transformedArticle.title,
      hasImage: !!transformedArticle.image,
      imageUrl: transformedArticle.image,
      categorySlug: transformedArticle.category?.slug
    });

    return transformedArticle;

  } catch (error) {
    console.error('Strapi Cloud Transform - Error transforming article data:', error);
    return {
      id: article.id || 'unknown',
      title: article.title || article.attributes?.title || 'Error loading article',
      description: '',
      slug: '',
      image: null,
      category: null,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}
