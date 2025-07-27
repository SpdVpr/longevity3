# 🤖 Automatické generování článků pro Longevity web

Kompletní systém pro automatické generování kvalitních článků o longevitě pomocí Perplexity AI a jejich publikování do Strapi CMS.

## ✨ Funkce

- 🧠 **AI generování obsahu** - Používá Perplexity AI pro vytváření vědecky podložených článků
- 📝 **Strukturovaný obsah** - Automaticky vytváří nadpisy, odstavce a seznamy
- 🚀 **Přímá publikace** - Články se automaticky publikují do Strapi CMS
- 📊 **Hromadné zpracování** - Možnost vygenerovat více článků najednou
- 🔍 **Monitoring** - Detailní logování a zpracování chyb

## 🚀 Rychlý start

### 1. Vygenerování jednoho článku

```bash
node scripts/generate-single-article.js "Benefits of Green Tea for Longevity" "nutrition and longevity"
```

### 2. Testování systému

```bash
node scripts/test-article-generation.js
```

### 3. Hromadné generování

```bash
node scripts/batch-generate-articles.js
```

## 📋 Dostupné scripty

| Script | Popis | Použití |
|--------|-------|---------|
| `generate-single-article.js` | Generuje jeden článek | `node scripts/generate-single-article.js "Název" "kontext"` |
| `batch-generate-articles.js` | Hromadné generování 10 článků | `node scripts/batch-generate-articles.js` |
| `test-article-generation.js` | Rychlý test systému | `node scripts/test-article-generation.js` |
| `generate-article.js` | CLI rozhraní (původní) | `node scripts/generate-article.js --title="..." --category="..."` |

## 🔧 Konfigurace

Systém vyžaduje tyto API klíče v `.env.local`:

```env
# Strapi Cloud
NEXT_PUBLIC_STRAPI_API_URL=https://special-acoustics-b9adb26838.strapiapp.com
STRAPI_API_TOKEN=776e17a82d723119f2caf0e3825ce663395fcf5ee748e43469f3eb5002fd24c5bb5d85142ad5c0ec8a2e4c2db70f37332e2dce04df2b64fb567e84174510c6637611b6405c0d171f23bbbc288f03e31509bfa6c4c46ccc1613ccd8999b8c0b32a3b945fb78678580051c4df58dc58d9b2fc292b45a19d5bcacbea2be5e1eedbd

# Perplexity AI
PERPLEXITY_API_KEY=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
```

## 📚 Předem připravené články

Systém obsahuje 10 připravených témat pro hromadné generování:

1. **The Science of Sleep and Longevity** - lifestyle
2. **Exercise and Aging: How Physical Activity Extends Lifespan** - exercise  
3. **Stress Management for Healthy Aging** - mental-health
4. **The Role of Antioxidants in Anti-Aging** - nutrition
5. **Caloric Restriction and Longevity: What Science Says** - nutrition
6. **Telomeres and Aging: Understanding Cellular Clocks** - science
7. **Hormones and Aging: Maintaining Balance for Longevity** - health
8. **The Gut Microbiome and Healthy Aging** - health
9. **Social Connections and Longevity: The Power of Relationships** - lifestyle
10. **Environmental Factors Affecting Aging and Lifespan** - lifestyle

## 🎯 Kvalita obsahu

Každý vygenerovaný článek obsahuje:

- ✅ **1500-2000 slov** kvalitního obsahu
- ✅ **Vědecké reference** a studie
- ✅ **Strukturované nadpisy** (H2, H3)
- ✅ **Praktické rady** pro čtenáře
- ✅ **SEO optimalizovaný** meta popis
- ✅ **HTML formátování** připravené pro web

## 📊 Výsledky testování

Systém byl úspěšně otestován a vygeneroval:

- ✅ **Článek ID 13**: "Complete Guide to Longevity Supplements"
- ✅ **Článek ID 16**: "Benefits of Green Tea for Longevity"
- ✅ Všechny články jsou publikované a dostupné v Strapi CMS

## 🔍 Monitoring

Systém poskytuje detailní informace o procesu:

```
=== ZAČÍNÁM GENEROVÁNÍ ČLÁNKU ===
Generuji obsah pro článek: Benefits of Green Tea for Longevity
✓ Obsah článku vygenerován
Název: Benefits of Green Tea for Longevity
Excerpt: Discover how green tea promotes longevity through its antioxidants...
Délka obsahu: 6429 znaků
Vytvářím článek v Strapi: Benefits of Green Tea for Longevity
Článek vytvořen s ID: 16
✓ Článek publikován do Strapi CMS
=== GENEROVÁNÍ ČLÁNKU DOKONČENO ===
```

## 🛠️ Technické detaily

### Architektura
- **generate-article-lib.js** - Hlavní knihovna funkcí
- **Perplexity AI** - Generování obsahu pomocí modelu `sonar`
- **Strapi CMS** - Publikování přes REST API
- **Blocks struktura** - Používá `shared.rich-text` komponentu

### Bezpečnost
- ⏱️ **Rate limiting** - Pauzy mezi požadavky
- 🔒 **API klíče** - Bezpečné uložení v .env
- ✅ **Validace** - Kontrola vstupů a výstupů
- 📝 **Logování** - Detailní záznamy o chybách

## 🚨 Troubleshooting

### Časté problémy

**Chyba: "description must be at most 80 characters"**
- ✅ Vyřešeno automatickým zkrácením popisu

**Chyba: "This attribute must be unique" (slug)**
- 💡 Změňte název článku nebo přidejte unikátní identifikátor

**Chyba: "Perplexity API error: 400 Bad Request"**
- 🔍 Zkontrolujte API klíč a model name

## 📈 Další kroky

Pro rozšíření systému můžete:

1. **Přidat kategorie** - Integrace s Strapi kategoriemi
2. **Přidat obrázky** - Automatické generování nebo výběr obrázků
3. **SEO optimalizace** - Automatické generování meta tagů
4. **Plánování** - Cron job pro pravidelné generování
5. **Analytics** - Sledování výkonu článků

## 📞 Podpora

Pro otázky nebo problémy:
- 📖 Přečtěte si detailní dokumentaci v `docs/automatic-article-generation.md`
- 🧪 Spusťte test script pro ověření funkčnosti
- 📝 Zkontrolujte logy pro detailní informace o chybách

---

**Status**: ✅ Plně funkční a otestovaný systém připravený k použití!
