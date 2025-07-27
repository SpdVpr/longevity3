# Aktualizace formátování existujících článků

Tento dokument popisuje proces aktualizace formátování existujících článků tak, aby používaly nové CSS styly a vypadaly profesionálně.

## Problém

Starší články byly vytvořeny před implementací nových CSS stylů a neměly správné formátování:
- Chyběly CSS třídy pro správné zobrazení
- Obsahovaly meta description v obsahu článku
- Neměly konzistentní HTML strukturu

## Řešení

Vytvořili jsme systém scriptů pro automatickou aktualizaci formátování existujících článků.

## Scripty pro aktualizaci

### 1. `update-article-formatting.js`

Hlavní script pro aktualizaci formátování jednoho článku.

**Použití:**
```bash
node scripts/update-article-formatting.js [articleId]
```

**Funkce:**
- Získá článek ze Strapi pomocí API
- Vyčistí obsah od meta description a nadbytečných elementů
- Přeformátuje HTML strukturu
- Zabalí obsah do `<div class="article-content">`
- Aktualizuje článek ve Strapi

### 2. `batch-update-formatting.js`

Script pro hromadnou aktualizaci více článků najednou.

**Použití:**
```bash
node scripts/batch-update-formatting.js
```

**Funkce:**
- Aktualizuje předem definovaný seznam článků
- Přidává pauzy mezi aktualizacemi
- Poskytuje detailní reporting o výsledcích

### 3. `list-articles.js`

Pomocný script pro zobrazení všech článků a jejich ID.

**Použití:**
```bash
node scripts/list-articles.js
```

## Technické detaily

### Strapi v5 API změny

Strapi v5 používá `documentId` místo `id` pro přístup k jednotlivým záznamům:

```javascript
// Starý způsob (nefunguje)
fetch(`/api/articles/${id}`)

// Nový způsob (funguje)
fetch(`/api/articles/${documentId}`)
```

### Čištění obsahu

Script automaticky čistí obsah článků:

```javascript
function cleanAndFormatContent(htmlContent) {
  // Odstranění meta description
  let cleanContent = htmlContent.replace(/^.*?Meta description:.*?<\/p>/i, '');
  
  // Odstranění div wrapperu
  cleanContent = cleanContent.replace(/^<div class="article-content">/, '');
  cleanContent = cleanContent.replace(/<\/div>$/, '');
  
  // Vyčištění prázdných odstavců
  cleanContent = cleanContent.replace(/<p>\s*<\/p>/g, '');
  
  return cleanContent;
}
```

### Nová struktura obsahu

Po aktualizaci má každý článek tuto strukturu:

```json
{
  "blocks": [
    {
      "__component": "shared.rich-text",
      "body": "<div class=\"article-content\">Vyčištěný HTML obsah</div>"
    }
  ]
}
```

## Aktualizované články

### Úspěšně aktualizované články:

1. **ID 13**: "Complete Guide to Longevity Supplements"
   - DocumentID: `xcx41nbgim22hlxfy4jqkweh`
   - Původní délka: 8199 znaků → Vyčištěno: 7976 znaků

2. **ID 7**: "Aging Clocks: Measuring Biological Age for Longevity and Healthspan"
   - DocumentID: `bgab1l9agy341dhpam7oz7pw`
   - Původní délka: 6546 znaků → Vyčištěno: 6276 znaků

3. **ID 16**: "Benefits of Green Tea for Longevity"
   - DocumentID: `n1oibjzss4ozqy6nkoxp202h`
   - Původní délka: 6464 znaků → Vyčištěno: 6380 znaků

### Články s aktuálním formátováním:

Tyto články už mají správné formátování a nepotřebují aktualizaci:
- **ID 18**: "CSS Styling Test: Omega-3 Fatty Acids for Brain Health"
- **ID 20**: "Final Styling Test: The Power of Meditation for Longevity"
- **ID 22**: "Complete Styling Demo: The Science of Healthy Aging"

## Výsledky aktualizace

### Před aktualizací:
- Články se zobrazovaly bez formátování
- Chyběly CSS styly pro nadpisy, seznamy, odstavce
- Meta description se zobrazovala v obsahu

### Po aktualizaci:
- ✅ Profesionální typografie s Georgia fontem
- ✅ Barevné akcenty v teal a indigo barvách
- ✅ Ikony pro nadpisy (▶ pro H2, ● pro H3)
- ✅ Zvýrazněný první odstavec
- ✅ Správné formátování seznamů a odkazů
- ✅ Responzivní design pro mobilní zařízení

## Monitoring a validace

### Kontrola úspěšnosti:

1. **Vizuální kontrola**: Otevřít článek na webu a zkontrolovat formátování
2. **CSS aplikace**: Ověřit, že se používají správné CSS třídy
3. **Responzivní design**: Otestovat na mobilních zařízeních
4. **Obsah**: Zkontrolovat, že meta description není v obsahu

### URL pro kontrolu:

- https://www.longevitygrow.com/articles/complete-guide-to-longevity-supplements
- https://www.longevitygrow.com/articles/aging-clocks-measuring-biological-age-for-longevity-and-healthspan
- https://www.longevitygrow.com/articles/benefits-of-green-tea-for-longevity

## Budoucí použití

### Pro nové články:
Nové články vytvořené pomocí `generate-single-article.js` už automaticky používají správné formátování.

### Pro ruční aktualizace:
Pokud potřebujete aktualizovat další článek:

```bash
# Najděte ID článku
node scripts/list-articles.js

# Aktualizujte formátování
node scripts/update-article-formatting.js [ID]
```

### Pro hromadné aktualizace:
Upravte seznam `articlesToUpdate` v `batch-update-formatting.js` a spusťte:

```bash
node scripts/batch-update-formatting.js
```

## Troubleshooting

### Chyba "Article not found"
- Zkontrolujte ID článku pomocí `list-articles.js`
- Ověřte, že článek existuje ve Strapi

### Chyba "Failed to update article"
- Zkontrolujte API token
- Ověřte, že máte oprávnění k úpravě článků

### Formátování se nezobrazuje
- Zkontrolujte, že CSS styly jsou načtené
- Ověřte, že článek má třídu `article-content`
- Zkontrolujte browser cache

---

**Status**: ✅ Všechny existující články byly úspěšně aktualizovány a mají nyní profesionální formátování!
