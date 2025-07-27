const { generateAndPublishArticle } = require('./generate-article-lib');

// Seznam článků k vygenerování
const articlesToGenerate = [
  {
    title: "The Science of Sleep and Longevity",
    category: "lifestyle",
    tags: "sleep,longevity,health,circadian rhythm",
    categoryContext: "lifestyle and longevity"
  },
  {
    title: "Exercise and Aging: How Physical Activity Extends Lifespan",
    category: "exercise",
    tags: "exercise,aging,longevity,fitness",
    categoryContext: "exercise and fitness for longevity"
  },
  {
    title: "Stress Management for Healthy Aging",
    category: "mental-health",
    tags: "stress,mental health,longevity,meditation",
    categoryContext: "mental health and longevity"
  },
  {
    title: "The Role of Antioxidants in Anti-Aging",
    category: "nutrition",
    tags: "antioxidants,nutrition,anti-aging,supplements",
    categoryContext: "nutrition and longevity"
  },
  {
    title: "Caloric Restriction and Longevity: What Science Says",
    category: "nutrition",
    tags: "caloric restriction,longevity,diet,aging",
    categoryContext: "nutrition and longevity"
  },
  {
    title: "Telomeres and Aging: Understanding Cellular Clocks",
    category: "science",
    tags: "telomeres,aging,cellular biology,longevity",
    categoryContext: "longevity science"
  },
  {
    title: "Hormones and Aging: Maintaining Balance for Longevity",
    category: "health",
    tags: "hormones,aging,health,longevity",
    categoryContext: "health and longevity"
  },
  {
    title: "The Gut Microbiome and Healthy Aging",
    category: "health",
    tags: "microbiome,gut health,aging,probiotics",
    categoryContext: "health and longevity"
  },
  {
    title: "Social Connections and Longevity: The Power of Relationships",
    category: "lifestyle",
    tags: "social connections,longevity,mental health,relationships",
    categoryContext: "lifestyle and longevity"
  },
  {
    title: "Environmental Factors Affecting Aging and Lifespan",
    category: "lifestyle",
    tags: "environment,aging,toxins,longevity",
    categoryContext: "lifestyle and longevity"
  }
];

/**
 * Generuje články postupně s pauzami mezi nimi
 */
async function batchGenerateArticles() {
  console.log('=== SPOUŠTÍM HROMADNÉ GENEROVÁNÍ ČLÁNKŮ ===');
  console.log(`Celkem článků k vygenerování: ${articlesToGenerate.length}`);
  
  const results = [];
  
  for (let i = 0; i < articlesToGenerate.length; i++) {
    const article = articlesToGenerate[i];
    console.log(`\n--- Generuji článek ${i + 1}/${articlesToGenerate.length} ---`);
    console.log(`Název: ${article.title}`);
    
    try {
      const result = await generateAndPublishArticle(
        article.title,
        null, // categoryId - necháme null, protože kategorie zatím nejsou správně nastavené
        article.categoryContext
      );
      
      if (result.success) {
        console.log(`✓ Článek "${article.title}" byl úspěšně vygenerován`);
        results.push({
          title: article.title,
          success: true,
          articleId: result.article.id
        });
      } else {
        console.error(`✗ Chyba při generování článku "${article.title}":`, result.error);
        results.push({
          title: article.title,
          success: false,
          error: result.error
        });
      }
      
      // Pauza mezi články (aby nedošlo k přetížení API)
      if (i < articlesToGenerate.length - 1) {
        console.log('Čekám 10 sekund před dalším článkem...');
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
      
    } catch (error) {
      console.error(`✗ Neočekávaná chyba při generování článku "${article.title}":`, error.message);
      results.push({
        title: article.title,
        success: false,
        error: error.message
      });
    }
  }
  
  // Shrnutí výsledků
  console.log('\n=== SHRNUTÍ VÝSLEDKŮ ===');
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✓ Úspěšně vygenerováno: ${successful.length} článků`);
  console.log(`✗ Neúspěšných: ${failed.length} článků`);
  
  if (successful.length > 0) {
    console.log('\nÚspěšně vygenerované články:');
    successful.forEach(article => {
      console.log(`  - ${article.title} (ID: ${article.articleId})`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\nNeúspěšné články:');
    failed.forEach(article => {
      console.log(`  - ${article.title}: ${article.error}`);
    });
  }
  
  console.log('\n=== HROMADNÉ GENEROVÁNÍ DOKONČENO ===');
  return results;
}

// Spuštění, pokud je script volán přímo
if (require.main === module) {
  batchGenerateArticles()
    .then(results => {
      const successful = results.filter(r => r.success).length;
      const total = results.length;
      console.log(`\nFinální výsledek: ${successful}/${total} článků úspěšně vygenerováno`);
      process.exit(successful === total ? 0 : 1);
    })
    .catch(error => {
      console.error('Kritická chyba při hromadném generování:', error);
      process.exit(1);
    });
}

module.exports = { batchGenerateArticles, articlesToGenerate };
