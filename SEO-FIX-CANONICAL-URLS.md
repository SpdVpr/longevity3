# SEO Fix: Duplicitní stránky bez kanonické verze

## Problém
Google Search Console hlásil: **"Duplicitní stránka bez kanonické verze vybrané uživatelem"**

Tento problém vznikl, protože:
1. Chyběl hlavní `page.tsx` soubor pro dynamické články
2. Články neměly správně nastavené kanonické URL
3. Chyběla funkce `generateMetadata` pro dynamické meta tagy
4. Chyběla funkce `generateStaticParams` pro statické generování stránek

## Řešení

### 1. Vytvořen nový soubor: `app/[locale]/articles/[slug]/page.tsx`

Tento soubor obsahuje:

#### a) `generateMetadata` funkce
- Dynamicky generuje meta tagy pro každý článek
- Nastavuje **kanonické URL** ve formátu: `https://www.longevitygrow.com/en/articles/[slug]`
- Přidává Open Graph tagy pro sociální sítě
- Přidává Twitter Card tagy
- Nastavuje správné `robots` direktivy: `index, follow`

#### b) `generateStaticParams` funkce
- Předgeneruje statické stránky pro všechny články při buildu
- Zlepšuje výkon a SEO
- Google může snadno indexovat všechny stránky

#### c) Strukturovaná data (JSON-LD)
- Přidává Schema.org Article markup
- Pomáhá Googlu lépe pochopit obsah stránky
- Zlepšuje zobrazení ve výsledcích vyhledávání

### 2. Aktualizován `next.config.mjs`

Přidány SEO optimalizace:
```javascript
trailingSlash: false,        // Bez lomítek na konci URL
poweredByHeader: false,      // Bezpečnost - skrytí X-Powered-By
compress: true,              // Komprese pro rychlejší načítání
```

### 3. Vytvořen `public/robots.txt`

Správná konfigurace pro crawlery:
- Povoluje indexaci všech stránek kromě admin/api
- Odkazuje na sitemap.xml
- Nastavuje Crawl-delay pro slušné crawlování

### 4. Aktualizován `app/sitemap.ts`

Vylepšení sitemap:
- Přidána stránka se seznamem článků
- Správné URL s locale prefixy
- Správné priority a frekvence změn
- Lepší zpracování dat z Strapi

## Kanonické URL struktura

Všechny stránky nyní mají správně nastavené kanonické URL:

### Hlavní stránky
- Homepage: `https://www.longevitygrow.com`
- Kategorie: `https://www.longevitygrow.com/nutrition`
- Nástroje: `https://www.longevitygrow.com/tools`

### Články
- Seznam článků: `https://www.longevitygrow.com/en/articles`
- Detail článku: `https://www.longevitygrow.com/en/articles/[slug]`

## Meta tagy pro každý článek

Každý článek nyní obsahuje:

```html
<!-- Kanonická URL -->
<link rel="canonical" href="https://www.longevitygrow.com/en/articles/[slug]" />

<!-- Základní meta tagy -->
<meta name="description" content="[popis článku]" />
<meta name="keywords" content="[klíčová slova]" />
<meta name="robots" content="index, follow" />

<!-- Open Graph -->
<meta property="og:title" content="[název článku]" />
<meta property="og:description" content="[popis]" />
<meta property="og:url" content="https://www.longevitygrow.com/en/articles/[slug]" />
<meta property="og:type" content="article" />
<meta property="og:image" content="[URL obrázku]" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="[název článku]" />
<meta name="twitter:description" content="[popis]" />

<!-- Strukturovaná data (JSON-LD) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[název článku]",
  "datePublished": "[datum publikace]",
  "author": { "@type": "Organization", "name": "Longevity Grow" }
}
</script>
```

## Jak nasadit změny

### 1. Build a deploy
```bash
cd website
npm run build
```

### 2. Nahrát na GitHub
```bash
git add .
git commit -m "SEO fix: Add canonical URLs and proper metadata for articles"
git push origin main
```

### 3. Vercel automaticky nasadí změny

### 4. Ověření v Google Search Console

Po nasazení:
1. Otevřete Google Search Console
2. Jděte na **URL Inspection**
3. Zadejte URL článku (např. `https://www.longevitygrow.com/en/articles/intermittent-fasting`)
4. Klikněte na **Request Indexing**
5. Opakujte pro několik článků

### 5. Kontrola sitemap

1. Otevřete: `https://www.longevitygrow.com/sitemap.xml`
2. Ověřte, že obsahuje všechny články
3. V Google Search Console jděte na **Sitemaps**
4. Přidejte sitemap: `https://www.longevitygrow.com/sitemap.xml`

## Očekávané výsledky

Po nasazení a reindexaci (1-2 týdny):
- ✅ Zmizí chyba "Duplicitní stránka bez kanonické verze"
- ✅ Všechny články budou mít status "Indexováno"
- ✅ Lepší pozice ve vyhledávání díky strukturovaným datům
- ✅ Lepší zobrazení ve výsledcích vyhledávání (rich snippets)
- ✅ Rychlejší indexace nových článků

## Monitoring

Pravidelně kontrolujte:
1. **Google Search Console** → Coverage → Zkontrolujte chyby
2. **Sitemap status** → Kolik URL je indexováno
3. **Performance** → Sledujte kliknutí a zobrazení

## Další doporučení

### 1. Přidat Google Analytics
```javascript
// V app/layout.tsx
<Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
```

### 2. Přidat Google Search Console verification
V `app/page.tsx` je již připraveno:
```javascript
verification: {
  google: "your-google-verification-code",
}
```

### 3. Vytvořit více interních odkazů
- Propojit související články
- Přidat "Related Articles" sekci
- Přidat breadcrumbs (již implementováno)

### 4. Optimalizovat obrázky
- Používat WebP formát
- Přidat alt texty
- Optimalizovat velikost

## Technické detaily

### Proč to fungovalo špatně?

1. **Chyběl page.tsx** → Next.js nemohl vygenerovat stránky
2. **Bez generateMetadata** → Žádné kanonické URL
3. **Bez generateStaticParams** → Stránky se generovaly dynamicky
4. **Špatná sitemap** → Google nenašel všechny stránky

### Jak to funguje nyní?

1. **Build time**: `generateStaticParams` načte všechny články ze Strapi
2. **Next.js** vygeneruje statické HTML stránky pro každý článek
3. **Každá stránka** má správné meta tagy a kanonickou URL
4. **Google** najde stránky přes sitemap.xml
5. **Indexace** proběhne bez problémů

## Kontakt

Pokud máte otázky nebo problémy, zkontrolujte:
- Google Search Console
- Vercel deployment logs
- Browser console pro chyby

