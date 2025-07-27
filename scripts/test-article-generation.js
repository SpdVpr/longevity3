const { generateAndPublishArticle } = require('./generate-article-lib');

/**
 * Rychlý test generování článků
 */

const testArticles = [
  {
    title: "Quick Test: Vitamin D and Longevity",
    context: "supplements and longevity"
  },
  {
    title: "Quick Test: Meditation for Healthy Aging", 
    context: "mental health and longevity"
  }
];

async function testArticleGeneration() {
  console.log('=== TESTOVÁNÍ GENEROVÁNÍ ČLÁNKŮ ===');
  
  for (let i = 0; i < testArticles.length; i++) {
    const article = testArticles[i];
    console.log(`\n--- Test ${i + 1}: ${article.title} ---`);
    
    try {
      const result = await generateAndPublishArticle(
        article.title,
        null,
        article.context
      );
      
      if (result.success) {
        console.log(`✓ Test ${i + 1} úspěšný - ID: ${result.article.id}`);
      } else {
        console.error(`✗ Test ${i + 1} neúspěšný:`, result.error);
      }
      
      // Krátká pauza mezi testy
      if (i < testArticles.length - 1) {
        console.log('Čekám 5 sekund...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      
    } catch (error) {
      console.error(`✗ Test ${i + 1} - neočekávaná chyba:`, error.message);
    }
  }
  
  console.log('\n=== TESTOVÁNÍ DOKONČENO ===');
}

// Spuštění testu
if (require.main === module) {
  testArticleGeneration()
    .then(() => {
      console.log('Test dokončen');
      process.exit(0);
    })
    .catch(error => {
      console.error('Chyba při testování:', error);
      process.exit(1);
    });
}

module.exports = { testArticleGeneration };
