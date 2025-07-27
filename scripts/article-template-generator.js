/**
 * Template pro generování článků s správným formátováním
 * Všechny články musí obsahovat:
 * - Správné HTML formátování s <strong> místo **
 * - Tabulky jako HTML <table> místo markdown
 * - Sekci References na konci
 * - Správné odstavce a strukturu
 */

function generateArticleTemplate(title, content) {
  return `<div class="article-content">
<h2>${title}</h2>

${content}

<br><br>

<h2><strong>References</strong></h2>
<ol>
<li>Autor, A. et al. (2024). <a href="https://doi.org/10.1000/example1" target="_blank">"Název studie."</a> <em>Journal Name</em>, 12(3), 123-145.</li>
<li>Autor, B. et al. (2023). <a href="https://doi.org/10.1000/example2" target="_blank">"Název studie."</a> <em>Journal Name</em>, 11(2), 67-89.</li>
<li>Autor, C. et al. (2024). <a href="https://doi.org/10.1000/example3" target="_blank">"Název studie."</a> <em>Journal Name</em>, 13(1), 234-256.</li>
<li>Autor, D. et al. (2023). <a href="https://doi.org/10.1000/example4" target="_blank">"Název studie."</a> <em>Journal Name</em>, 10(4), 345-367.</li>
<li>Autor, E. et al. (2024). <a href="https://doi.org/10.1000/example5" target="_blank">"Název studie."</a> <em>Journal Name</em>, 14(2), 456-478.</li>
</ol>
</div>`;
}

// Příklad použití pro článek o doplňcích
const supplementsArticleContent = `<h3>Introduction</h3>
<p>As the global population ages, interest in extending both lifespan and healthspan—the period of life spent in good health—has surged. Longevity supplements have emerged as a promising strategy to counteract age-related decline at the cellular and systemic levels.</p>

<h2>What Are Longevity Supplements?</h2>
<p>Longevity supplements are dietary agents formulated to optimize aging by enhancing cellular function, reducing oxidative damage, and modulating key pathways linked to aging hallmarks.</p>

<h2>Key Biological Targets</h2>

<h3>Combating Oxidative Stress</h3>
<p>Oxidative stress and chronic inflammation are central drivers of cellular aging. Key supplements include:</p>

<ul>
<li><strong>Polyphenols</strong> such as resveratrol help activate sirtuins<sup>[1]</sup></li>
<li><strong>Curcumin</strong> exhibits anti-inflammatory effects<sup>[2]</sup></li>
</ul>

<h2>Top Evidence-Based Supplements</h2>
<p>Scientific research has identified these supplements with solid evidence:</p>

<table class="supplements-table">
<thead>
<tr>
<th>Supplement</th>
<th>Key Benefits</th>
<th>Evidence Level</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Vitamin D3</strong></td>
<td>Slows telomere shortening</td>
<td>High - RCT studies<sup>[3]</sup></td>
</tr>
<tr>
<td><strong>Taurine</strong></td>
<td>Increases lifespan in animals</td>
<td>Medium - Animal studies<sup>[4]</sup></td>
</tr>
<tr>
<td><strong>Resveratrol</strong></td>
<td>Activates sirtuins</td>
<td>Medium - Multiple studies<sup>[5]</sup></td>
</tr>
</tbody>
</table>

<h2>Practical Guidelines</h2>

<h3>Safety Considerations</h3>
<p>Before starting any supplement regimen:</p>

<ul>
<li>Consult with healthcare providers</li>
<li>Choose supplements with clinical backing</li>
<li>Monitor for interactions with medications</li>
</ul>

<h2>Conclusion</h2>
<p>Longevity supplements offer a scientifically informed approach to healthy aging. The strongest evidence supports vitamin D3, taurine, and resveratrol for their positive effects on biological aging processes.</p>

<p><strong>Key takeaways:</strong></p>
<ul>
<li>Select supplements based on scientific evidence</li>
<li>Integrate with healthy lifestyle practices</li>
<li>Monitor effects through biomarkers when possible</li>
</ul>`;

// Generuj kompletní článek
const completeArticle = generateArticleTemplate(
  "Complete Guide to Longevity Supplements",
  supplementsArticleContent
);

console.log("=== TEMPLATE PRO ČLÁNEK O DOPLŇCÍCH ===");
console.log(completeArticle);

// Pravidla pro všechny budoucí články
console.log("\n=== PRAVIDLA PRO VŠECHNY ČLÁNKY ===");
console.log("1. NIKDY nepřidávej meta description do obsahu článku!");
console.log("2. Článek začíná přímo nadpisem H2");
console.log("3. Používej <strong> místo ** pro tučný text");
console.log("4. Používej <br><br> pro správné zalomení odstavců");
console.log("5. Vytvárej HTML tabulky s class='supplements-table' nebo podobnou");
console.log("6. References nadpis musí být tučný a oddělený: <h2><strong>References</strong></h2>");
console.log("7. Názvy studií jsou hypertextové odkazy, ne samostatné URL");
console.log("8. Odkazy se otevírají v novém okně (target='_blank')");
console.log("9. Používej <sup>[číslo]</sup> pro odkazy na zdroje");
console.log("10. Strukturuj obsah s H2 a H3 nadpisy");
console.log("11. Zabal vše do <div class='article-content'>");
console.log("12. Description v Strapi max 80 znaků!");

module.exports = { generateArticleTemplate };
