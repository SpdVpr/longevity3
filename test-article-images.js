const { getFeaturedArticlesWithImages } = require('./lib/api');
const { transformArticlesResponse } = require('./lib/utils');

async function testArticleImages() {
  console.log('🧪 Testing article images from Strapi API...\n');

  try {
    // Test the API call
    console.log('📡 Calling getFeaturedArticlesWithImages...');
    const response = await getFeaturedArticlesWithImages(3, 'en');

    console.log('✅ Raw API response received');
    console.log('Response structure:', {
      hasData: !!response?.data,
      dataLength: response?.data?.length || 0,
      hasMeta: !!response?.meta
    });

    if (response?.data && response.data.length > 0) {
      console.log('\n📋 Analyzing first article:');
      const firstArticle = response.data[0];

      console.log('Article structure:', {
        id: firstArticle.id,
        hasAttributes: !!firstArticle.attributes,
        title: firstArticle.attributes?.title || firstArticle.title,
        hasCover: !!firstArticle.attributes?.cover || !!firstArticle.cover,
        hasImage: !!firstArticle.attributes?.image || !!firstArticle.image
      });

      // Check cover field
      if (firstArticle.attributes?.cover) {
        console.log('\n🖼️ Cover field analysis:');
        const cover = firstArticle.attributes.cover;
        console.log('Cover structure:', {
          hasData: !!cover.data,
          hasUrl: !!cover.url,
          hasFormats: !!cover.formats,
          type: typeof cover
        });

        if (cover.data?.attributes?.url) {
          console.log('Cover URL (v4 format):', cover.data.attributes.url);
        } else if (cover.url) {
          console.log('Cover URL (direct):', cover.url);
        } else if (cover.formats) {
          console.log('Cover formats available:', Object.keys(cover.formats));
        }
      }

      // Check image field
      if (firstArticle.attributes?.image) {
        console.log('\n🖼️ Image field analysis:');
        const image = firstArticle.attributes.image;
        console.log('Image structure:', {
          hasData: !!image.data,
          hasUrl: !!image.url,
          hasFormats: !!image.formats,
          type: typeof image
        });

        if (image.data?.attributes?.url) {
          console.log('Image URL (v4 format):', image.data.attributes.url);
        } else if (image.url) {
          console.log('Image URL (direct):', image.url);
        } else if (image.formats) {
          console.log('Image formats available:', Object.keys(image.formats));
        }
      }

      // Test transformation
      console.log('\n🔄 Testing article transformation...');
      const { articles } = transformArticlesResponse(response);

      if (articles.length > 0) {
        const transformedArticle = articles[0];
        console.log('Transformed article:', {
          id: transformedArticle.id,
          title: transformedArticle.title,
          hasImage: !!transformedArticle.image,
          imageUrl: transformedArticle.image || 'NO IMAGE'
        });
      }
    } else {
      console.log('❌ No articles found in response');
    }

  } catch (error) {
    console.error('❌ Error testing article images:', error);
  }
}

// Run the test
testArticleImages();