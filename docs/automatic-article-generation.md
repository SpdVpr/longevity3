# Automatické generování článků pomocí Perplexity AI

Tento systém umožňuje automatické generování kvalitních článků o longevitě pomocí Perplexity AI a jejich publikování do Strapi CMS.

## Přehled systému

Systém se skládá z několika komponent:

1. **generate-article-lib.js** - Hlavní knihovna funkcí
2. **generate-single-article.js** - Script pro generování jednoho článku
3. **batch-generate-articles.js** - Script pro hromadné generování článků
4. **generate-article.js** - Původní script s CLI rozhraním

## Konfigurace

Systém vyžaduje následující proměnné prostředí v `.env.local`:

```env
# Strapi Cloud API
NEXT_PUBLIC_STRAPI_API_URL=https://special-acoustics-b9adb26838.strapiapp.com
STRAPI_API_TOKEN=your_strapi_api_token_here

# Perplexity AI API
PERPLEXITY_API_KEY=your_perplexity_api_key_here
```

## Použití

### 1. Generování jednoho článku

```bash
node scripts/generate-single-article.js "Název článku" "kontext kategorie"
```

Příklad:
```bash
node scripts/generate-single-article.js "Benefits of Green Tea for Longevity" "nutrition and longevity"
```

### 2. Hromadné generování článků

```bash
node scripts/batch-generate-articles.js
```

Tento script vygeneruje předem definovaný seznam článků s pauzami mezi nimi.

### 3. CLI rozhraní (původní script)

```bash
node scripts/generate-article.js --title="Název článku" --category="kategorie" --tags="tag1,tag2" --locale="en"
```

## Jak systém funguje

### 1. Generování obsahu (Perplexity AI)

- Používá model `sonar` pro generování obsahu
- Vytváří články o délce 1500-2000 slov
- Zaměřuje se na vědecky podložené informace
- Strukturuje obsah s nadpisy a seznamy
- Generuje meta popis (max 80 znaků pro Strapi)

### 2. Publikování do Strapi

- Vytváří slug z názvu článku
- Používá `blocks` strukturu s `shared.rich-text` komponentou
- Nastavuje `publishedAt` na aktuální čas
- Lokalizace nastavena na `en`

### 3. Struktura článku v Strapi

```json
{
  "data": {
    "title": "Název článku",
    "description": "Krátký popis (max 80 znaků)",
    "slug": "nazev-clanku",
    "blocks": [
      {
        "__component": "shared.rich-text",
        "body": "<div class=\"article-content\">HTML obsah článku</div>"
      }
    ],
    "publishedAt": "2025-07-26T19:45:27.753Z",
    "locale": "en"
  }
}
```

## Předem definované články pro hromadné generování

Systém obsahuje seznam 10 článků připravených k vygenerování:

1. The Science of Sleep and Longevity
2. Exercise and Aging: How Physical Activity Extends Lifespan
3. Stress Management for Healthy Aging
4. The Role of Antioxidants in Anti-Aging
5. Caloric Restriction and Longevity: What Science Says
6. Telomeres and Aging: Understanding Cellular Clocks
7. Hormones and Aging: Maintaining Balance for Longevity
8. The Gut Microbiome and Healthy Aging
9. Social Connections and Longevity: The Power of Relationships
10. Environmental Factors Affecting Aging and Lifespan

## Bezpečnostní opatření

- Pauzy mezi generováním článků (10 sekund) aby nedošlo k přetížení API
- Kontrola chyb a logování výsledků
- Validace vstupních parametrů
- Ošetření limitů API (80 znaků pro description)

## Monitoring a ladění

### Úspěšné generování
- Zobrazuje ID vytvořeného článku
- Poskytuje URL pro přístup v Strapi admin
- Loguje délku vygenerovaného obsahu

### Chyby
- Detailní chybové zprávy z Perplexity API
- Validační chyby ze Strapi
- Síťové chyby a timeouty

## Rozšíření systému

### Přidání nových článků do batch generování

Upravte pole `articlesToGenerate` v `batch-generate-articles.js`:

```javascript
{
  title: "Nový název článku",
  category: "kategorie",
  tags: "tag1,tag2,tag3",
  categoryContext: "kontext pro AI"
}
```

### Přizpůsobení promptu

Upravte prompt v `generateArticleContent()` funkci v `generate-article-lib.js` pro změnu stylu nebo zaměření článků.

### Integrace s kategoriemi

Aktuálně systém nevyužívá kategorie ze Strapi. Pro plnou integraci by bylo potřeba:

1. Načíst dostupné kategorie ze Strapi
2. Mapovat názvy kategorií na ID
3. Přidat categoryId do `strapiData`

## Testování

Pro otestování systému:

1. Vygenerujte jeden testovací článek
2. Zkontrolujte výsledek v Strapi admin
3. Ověřte zobrazení na webu
4. Spusťte hromadné generování s menším počtem článků

## Troubleshooting

### Chyba "Invalid key Content"
- Strapi nerozpoznává pole `Content` - použijte `blocks` strukturu

### Chyba "description must be at most 80 characters"
- Zkraťte meta popis na maximálně 80 znaků

### Chyba "This attribute must be unique" (slug)
- Článek s tímto slug už existuje - změňte název nebo slug

### Perplexity API chyby
- Zkontrolujte API klíč
- Ověřte model name (`sonar`)
- Zkontrolujte limity API
