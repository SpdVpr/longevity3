const { updateArticleFormatting } = require('./update-article-formatting');

/**
 * Seznam článků k aktualizaci formátování
 * Zahrnuje pouze starší články, které potřebují aktualizaci
 */
const articlesToUpdate = [
  {
    id: '7',
    title: 'Aging Clocks: Measuring Biological Age for Longevity and Healthspan'
  },
  {
    id: '16', 
    title: 'Benefits of Green Tea for Longevity'
  }
  // Poznámka: Články 18, 20, 22 už mají správné formátování
  // Články 9, 11 jsou testovací bez obsahu
];

/**
 * Hromadná aktualizace formátování článků
 */
async function batchUpdateFormatting() {
  console.log('=== HROMADNÁ AKTUALIZACE FORMÁTOVÁNÍ ČLÁNKŮ ===');
  console.log(`Celkem článků k aktualizaci: ${articlesToUpdate.length}`);
  
  const results = [];
  
  for (let i = 0; i < articlesToUpdate.length; i++) {
    const article = articlesToUpdate[i];
    console.log(`\n--- Aktualizuji článek ${i + 1}/${articlesToUpdate.length} ---`);
    console.log(`ID: ${article.id}`);
    console.log(`Název: ${article.title}`);
    
    try {
      await updateArticleFormatting(article.id);
      
      console.log(`✓ Článek "${article.title}" byl úspěšně aktualizován`);
      results.push({
        id: article.id,
        title: article.title,
        success: true
      });
      
      // Pauza mezi aktualizacemi
      if (i < articlesToUpdate.length - 1) {
        console.log('Čekám 3 sekundy před dalším článkem...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
    } catch (error) {
      console.error(`✗ Chyba při aktualizaci článku "${article.title}":`, error.message);
      results.push({
        id: article.id,
        title: article.title,
        success: false,
        error: error.message
      });
    }
  }
  
  // Shrnutí výsledků
  console.log('\n=== SHRNUTÍ VÝSLEDKŮ AKTUALIZACE ===');
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✓ Úspěšně aktualizováno: ${successful.length} článků`);
  console.log(`✗ Neúspěšných: ${failed.length} článků`);
  
  if (successful.length > 0) {
    console.log('\nÚspěšně aktualizované články:');
    successful.forEach(article => {
      console.log(`  - ${article.title} (ID: ${article.id})`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\nNeúspěšné aktualizace:');
    failed.forEach(article => {
      console.log(`  - ${article.title} (ID: ${article.id}): ${article.error}`);
    });
  }
  
  console.log('\n=== HROMADNÁ AKTUALIZACE DOKONČENA ===');
  return results;
}

// Spuštění, pokud je script volán přímo
if (require.main === module) {
  batchUpdateFormatting()
    .then(results => {
      const successful = results.filter(r => r.success).length;
      const total = results.length;
      console.log(`\nFinální výsledek: ${successful}/${total} článků úspěšně aktualizováno`);
      process.exit(successful === total ? 0 : 1);
    })
    .catch(error => {
      console.error('Kritická chyba při hromadné aktualizaci:', error);
      process.exit(1);
    });
}

module.exports = { batchUpdateFormatting, articlesToUpdate };
