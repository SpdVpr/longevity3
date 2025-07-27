/**
 * Performance test script for featured articles loading
 */

const STRAPI_API_URL = 'https://special-acoustics-b9adb26838.strapiapp.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || 'your-token-here';

async function testBasicArticlesSpeed() {
  console.log('🚀 Testing basic articles loading speed...');
  const start = Date.now();

  try {
    const queryParams = new URLSearchParams({
      'pagination[pageSize]': '3',
      'sort': 'publishedAt:desc'
    }).toString();

    const url = `${STRAPI_API_URL}/api/articles?${queryParams}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      const end = Date.now();
      console.log(`✅ Basic articles loaded in: ${end - start}ms`);
      console.log(`📊 Response size: ${JSON.stringify(data).length} characters`);
      console.log(`📄 Articles count: ${data.data?.length || 0}`);
      return end - start;
    } else {
      console.log(`❌ Error: ${response.status} ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return null;
  }
}

async function testArticlesWithImagesSpeed() {
  console.log('🖼️ Testing articles with images loading speed...');
  const start = Date.now();

  try {
    const queryParams = new URLSearchParams({
      'populate': '*',
      'pagination[pageSize]': '3',
      'sort': 'publishedAt:desc'
    }).toString();

    const url = `${STRAPI_API_URL}/api/articles?${queryParams}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      const end = Date.now();
      console.log(`✅ Articles with images loaded in: ${end - start}ms`);
      console.log(`📊 Response size: ${JSON.stringify(data).length} characters`);
      console.log(`📄 Articles count: ${data.data?.length || 0}`);
      return end - start;
    } else {
      console.log(`❌ Error: ${response.status} ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return null;
  }
}

async function runPerformanceTest() {
  console.log('🔥 Starting performance test...\n');

  // Test basic articles loading (should be fast)
  const basicTime = await testBasicArticlesSpeed();
  console.log('');

  // Test articles with images loading (slower but optimized)
  const imagesTime = await testArticlesWithImagesSpeed();
  console.log('');

  // Summary
  console.log('📈 Performance Summary:');
  if (basicTime) {
    console.log(`   Basic articles: ${basicTime}ms`);
    if (basicTime < 2000) {
      console.log('   ✅ Basic loading is FAST (< 2s)');
    } else if (basicTime < 5000) {
      console.log('   ⚠️ Basic loading is ACCEPTABLE (2-5s)');
    } else {
      console.log('   ❌ Basic loading is SLOW (> 5s)');
    }
  }

  if (imagesTime) {
    console.log(`   With images: ${imagesTime}ms`);
    if (imagesTime < 5000) {
      console.log('   ✅ Image loading is FAST (< 5s)');
    } else if (imagesTime < 10000) {
      console.log('   ⚠️ Image loading is ACCEPTABLE (5-10s)');
    } else {
      console.log('   ❌ Image loading is SLOW (> 10s)');
    }
  }

  if (basicTime && imagesTime) {
    const difference = imagesTime - basicTime;
    console.log(`   Image overhead: +${difference}ms`);
  }
}

// Run the test
runPerformanceTest().catch(console.error);