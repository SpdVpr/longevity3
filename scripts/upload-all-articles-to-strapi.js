const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Strapi API configuration
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// Check if token is available
if (!STRAPI_TOKEN) {
  console.error('❌ Error: STRAPI_API_TOKEN environment variable is not set');
  process.exit(1);
}

// Article mapping with categories
const articles = [
  // NUTRITION CATEGORY
  {
    file: 'nutrition-01-intermittent-fasting.html',
    title: 'Intermittent Fasting and Cellular Autophagy: A Scientific Approach to Longevity',
    slug: 'intermittent-fasting-cellular-autophagy-longevity',
    category: 'nutrition',
    excerpt: 'Science behind intermittent fasting and cellular autophagy for longevity.',
    featured: true
  },
  {
    file: 'nutrition-02-mediterranean-diet.html',
    title: 'Mediterranean Diet and Brain Health: Neuroprotective Benefits for Cognitive Longevity',
    slug: 'mediterranean-diet-brain-health-cognitive-longevity',
    category: 'nutrition',
    excerpt: 'Mediterranean diet benefits for brain health and cognitive longevity.',
    featured: false
  },
  {
    file: 'nutrition-03-micronutrients.html',
    title: 'Essential Micronutrients for Longevity: Vitamins and Minerals That Support Healthy Aging',
    slug: 'essential-micronutrients-longevity-healthy-aging',
    category: 'nutrition',
    excerpt: 'Critical micronutrients for cellular function and healthy aging.',
    featured: false
  },
  {
    file: 'nutrition-04-plant-based.html',
    title: 'Plant-Based Nutrition and Aging: Harnessing Phytonutrients for Longevity',
    slug: 'plant-based-nutrition-aging-phytonutrients-longevity',
    category: 'nutrition',
    excerpt: 'Plant-based nutrition and phytonutrients for longevity and health.',
    featured: false
  },
  {
    file: 'nutrition-05-hydration.html',
    title: 'Hydration and Cellular Health: The Foundation of Optimal Aging',
    slug: 'hydration-cellular-health-optimal-aging',
    category: 'nutrition',
    excerpt: 'Proper hydration for cellular health and longevity support.',
    featured: false
  },

  // FITNESS CATEGORY
  {
    file: 'fitness-01-strength-training.html',
    title: 'Strength Training for Bone Health: Building Resilience Against Age-Related Bone Loss',
    slug: 'strength-training-bone-health-age-related-loss',
    category: 'fitness',
    excerpt: 'Strength training for bone density and age-related bone loss prevention.',
    featured: true
  },
  {
    file: 'fitness-02-flexibility-mobility.html',
    title: 'Flexibility and Mobility in Aging: Maintaining Range of Motion for Lifelong Independence',
    slug: 'flexibility-mobility-aging-range-motion-independence',
    category: 'fitness',
    excerpt: 'Flexibility and mobility strategies for lifelong independence.',
    featured: false
  },
  {
    file: 'fitness-03-cardiovascular-training.html',
    title: 'Cardiovascular Training Protocols: Heart Health Strategies for Longevity',
    slug: 'cardiovascular-training-protocols-heart-health-longevity',
    category: 'fitness',
    excerpt: 'Cardiovascular training protocols for heart health and longevity.',
    featured: false
  },
  {
    file: 'fitness-04-balance-training.html',
    title: 'Balance Training for Fall Prevention: Maintaining Stability and Confidence in Aging',
    slug: 'balance-training-fall-prevention-stability-aging',
    category: 'fitness',
    excerpt: 'Balance training strategies for fall prevention and stability.',
    featured: false
  },
  {
    file: 'fitness-05-recovery-rest.html',
    title: 'Recovery and Rest Days: The Science of Optimal Recovery for Aging Athletes',
    slug: 'recovery-rest-days-science-optimal-aging-athletes',
    category: 'fitness',
    excerpt: 'Recovery and rest importance for fitness and health in aging.',
    featured: false
  },

  // MENTAL HEALTH CATEGORY
  {
    file: 'mental-health-01-stress-management.html',
    title: 'Stress Management Techniques: Evidence-Based Approaches for Mental Resilience and Longevity',
    slug: 'stress-management-techniques-mental-resilience-longevity',
    category: 'mental-health',
    excerpt: 'Stress management techniques for mental resilience and longevity.',
    featured: true
  },
  {
    file: 'mental-health-02-meditation-neuroplasticity.html',
    title: 'Meditation and Neuroplasticity: How Mindfulness Practices Reshape the Aging Brain',
    slug: 'meditation-neuroplasticity-mindfulness-aging-brain',
    category: 'mental-health',
    excerpt: 'Meditation and mindfulness for neuroplasticity and brain health.',
    featured: false
  },
  {
    file: 'mental-health-03-social-connections.html',
    title: 'Social Connections and Mental Health: The Longevity Benefits of Strong Relationships',
    slug: 'social-connections-mental-health-longevity-relationships',
    category: 'mental-health',
    excerpt: 'Social connections and relationships for mental health and longevity.',
    featured: false
  },
  {
    file: 'mental-health-04-cognitive-training.html',
    title: 'Cognitive Training and Brain Games: Evidence-Based Approaches to Maintaining Mental Sharpness',
    slug: 'cognitive-training-brain-games-mental-sharpness',
    category: 'mental-health',
    excerpt: 'Cognitive training methods for maintaining mental sharpness.',
    featured: false
  },
  {
    file: 'mental-health-05-sleep-mental-health.html',
    title: 'Sleep and Mental Health: The Bidirectional Relationship Between Rest and Psychological Well-Being',
    slug: 'sleep-mental-health-rest-psychological-wellbeing',
    category: 'mental-health',
    excerpt: 'Sleep quality and mental health relationship in aging.',
    featured: false
  },

  // SUPPLEMENTS CATEGORY
  {
    file: 'supplements-01-omega-3-fatty-acids.html',
    title: 'Omega-3 Fatty Acids: Essential Nutrients for Brain Health, Cardiovascular Function, and Longevity',
    slug: 'omega-3-fatty-acids-brain-health-cardiovascular-longevity',
    category: 'supplements',
    excerpt: 'Omega-3 fatty acids for brain health, cardiovascular function, longevity.',
    featured: true
  },
  {
    file: 'supplements-02-vitamin-d-longevity.html',
    title: 'Vitamin D and Longevity: The Sunshine Vitamin\'s Role in Healthy Aging and Disease Prevention',
    slug: 'vitamin-d-longevity-sunshine-vitamin-healthy-aging',
    category: 'supplements',
    excerpt: 'Vitamin D for healthy aging and disease prevention.',
    featured: false
  },
  {
    file: 'supplements-03-magnesium-health.html',
    title: 'Magnesium: The Master Mineral for Cellular Energy, Heart Health, and Longevity',
    slug: 'magnesium-master-mineral-cellular-energy-heart-health',
    category: 'supplements',
    excerpt: 'Magnesium for cellular energy, heart health, and longevity.',
    featured: false
  },
  {
    file: 'supplements-04-probiotics-gut-health.html',
    title: 'Probiotics and Gut Health: The Microbiome\'s Role in Longevity and Healthy Aging',
    slug: 'probiotics-gut-health-microbiome-longevity-aging',
    category: 'supplements',
    excerpt: 'Probiotics and gut health for longevity and healthy aging.',
    featured: false
  },
  {
    file: 'supplements-05-antioxidants-aging.html',
    title: 'Antioxidants and Aging: Combating Oxidative Stress for Cellular Health and Longevity',
    slug: 'antioxidants-aging-oxidative-stress-cellular-health',
    category: 'supplements',
    excerpt: 'Antioxidants combat oxidative stress for cellular health.',
    featured: false
  }
];

// Function to read HTML content and extract article content
function extractArticleContent(filePath) {
  try {
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    
    // Extract content from the article-content div
    const match = htmlContent.match(/<div class="article-content">([\s\S]*?)<\/div>/);
    if (match) {
      return match[1].trim();
    }
    
    return htmlContent;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

// Function to upload article to Strapi
async function uploadArticleToStrapi(articleData) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      },
      body: JSON.stringify({
        data: {
          title: articleData.title,
          slug: articleData.slug,
          description: articleData.excerpt,
          blocks: [
            {
              __component: "shared.rich-text",
              body: articleData.content
            }
          ],
          publishedAt: new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log(`✅ Successfully uploaded: ${articleData.title}`);
    return result;
  } catch (error) {
    console.error(`❌ Error uploading ${articleData.title}:`, error);
    return null;
  }
}

// Main function to upload all articles
async function uploadAllArticles() {
  console.log('🚀 Starting upload of all articles to Strapi CMS...\n');
  
  let successCount = 0;
  let errorCount = 0;

  for (const article of articles) {
    const filePath = path.join(__dirname, article.file);
    
    console.log(`📄 Processing: ${article.title}`);
    
    // Extract content from HTML file
    const content = extractArticleContent(filePath);
    
    if (!content) {
      console.error(`❌ Could not extract content from ${article.file}`);
      errorCount++;
      continue;
    }

    // Prepare article data
    const articleData = {
      title: article.title,
      slug: article.slug,
      content: content,
      excerpt: article.excerpt,
      category: article.category,
      featured: article.featured
    };

    // Upload to Strapi
    const result = await uploadArticleToStrapi(articleData);
    
    if (result) {
      successCount++;
    } else {
      errorCount++;
    }

    // Add delay between uploads to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n📊 Upload Summary:');
  console.log(`✅ Successfully uploaded: ${successCount} articles`);
  console.log(`❌ Failed uploads: ${errorCount} articles`);
  console.log(`📝 Total articles: ${articles.length}`);
  
  if (successCount === articles.length) {
    console.log('\n🎉 All articles uploaded successfully!');
  } else {
    console.log('\n⚠️  Some articles failed to upload. Please check the errors above.');
  }
}

// Run the upload process
if (require.main === module) {
  uploadAllArticles().catch(console.error);
}

module.exports = { uploadAllArticles, articles };
