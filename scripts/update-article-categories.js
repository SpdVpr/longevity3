const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// Category mapping
const categoryMapping = {
  'nutrition': 9,
  'fitness': 7,
  'mental-health': 8,
  'supplements': 10
};

// Article slugs and their categories
const articleCategories = {
  // NUTRITION
  'intermittent-fasting-cellular-autophagy-longevity': 'nutrition',
  'mediterranean-diet-brain-health-cognitive-longevity': 'nutrition',
  'essential-micronutrients-longevity-healthy-aging': 'nutrition',
  'plant-based-nutrition-aging-phytonutrients-longevity': 'nutrition',
  'hydration-cellular-health-optimal-aging': 'nutrition',
  
  // FITNESS
  'strength-training-bone-health-age-related-loss': 'fitness',
  'flexibility-mobility-aging-range-motion-independence': 'fitness',
  'cardiovascular-training-protocols-heart-health-longevity': 'fitness',
  'balance-training-fall-prevention-stability-aging': 'fitness',
  'recovery-rest-days-science-optimal-aging-athletes': 'fitness',
  
  // MENTAL HEALTH
  'stress-management-techniques-mental-resilience-longevity': 'mental-health',
  'meditation-neuroplasticity-mindfulness-aging-brain': 'mental-health',
  'social-connections-mental-health-longevity-relationships': 'mental-health',
  'cognitive-training-brain-games-mental-sharpness': 'mental-health',
  'sleep-mental-health-rest-psychological-wellbeing': 'mental-health',
  
  // SUPPLEMENTS
  'omega-3-fatty-acids-brain-health-cardiovascular-longevity': 'supplements',
  'vitamin-d-longevity-sunshine-vitamin-healthy-aging': 'supplements',
  'magnesium-master-mineral-cellular-energy-heart-health': 'supplements',
  'probiotics-gut-health-microbiome-longevity-aging': 'supplements',
  'antioxidants-aging-oxidative-stress-cellular-health': 'supplements'
};

async function updateArticleCategories() {
  try {
    console.log('🔄 Updating article categories...\n');
    
    // Get all articles
    const response = await fetch(`${STRAPI_URL}/api/articles?pagination[limit]=100`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`📄 Found ${data.data.length} articles to check`);
    
    let updatedCount = 0;
    let skippedCount = 0;

    for (const article of data.data) {
      const slug = article.slug;
      const expectedCategory = articleCategories[slug];
      
      if (!expectedCategory) {
        console.log(`⏭️  Skipping article: ${slug} (not in our list)`);
        skippedCount++;
        continue;
      }

      const categoryId = categoryMapping[expectedCategory];
      
      if (!categoryId) {
        console.log(`❌ No category ID found for: ${expectedCategory}`);
        continue;
      }

      // Update the article
      console.log(`🔄 Updating ${slug} -> category: ${expectedCategory} (ID: ${categoryId})`);
      
      const updateResponse = await fetch(`${STRAPI_URL}/api/articles/${article.documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRAPI_TOKEN}`
        },
        body: JSON.stringify({
          data: {
            category: categoryId
          }
        })
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.log(`❌ Failed to update ${slug}: ${updateResponse.status} - ${errorText}`);
        continue;
      }

      console.log(`✅ Successfully updated: ${slug}`);
      updatedCount++;
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n📊 Update Summary:');
    console.log(`✅ Successfully updated: ${updatedCount} articles`);
    console.log(`⏭️  Skipped: ${skippedCount} articles`);
    console.log(`📝 Total processed: ${data.data.length} articles`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateArticleCategories();
