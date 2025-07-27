const { generateAndPublishArticle } = require('./generate-article-lib');

/**
 * Script pro generování jednoho článku
 * 
 * Použití:
 * node scripts/generate-single-article.js "Název článku" "kontext kategorie"
 */

// Získání argumentů z příkazové řádky
const title = process.argv[2];
const categoryContext = process.argv[3] || 'longevity and health';

if (!title) {
  console.error('Chyba: Musíte zadat název článku');
  console.log('Použití: node scripts/generate-single-article.js "Název článku" "kontext kategorie"');
  console.log('Příklad: node scripts/generate-single-article.js "Benefits of Green Tea for Longevity" "nutrition and longevity"');
  process.exit(1);
}

console.log('=== GENEROVÁNÍ JEDNOHO ČLÁNKU ===');
console.log(`Název: ${title}`);
console.log(`Kontext: ${categoryContext}`);

generateAndPublishArticle(title, null, categoryContext)
  .then(result => {
    if (result.success) {
      console.log('\n✓ Článek byl úspěšně vygenerován a publikován!');
      console.log(`ID článku: ${result.article.id}`);
      console.log(`URL v Strapi: https://special-acoustics-b9adb26838.strapiapp.com/admin/content-manager/collectionType/api::article.article/${result.article.id}`);
    } else {
      console.error('\n✗ Generování článku selhalo:', result.error);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n✗ Neočekávaná chyba:', error.message);
    process.exit(1);
  });
