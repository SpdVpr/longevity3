### 5.1 Základní technické SEO
- Implementace správné struktury URL:
  - /kategorie/podkategorie/tema/
  - /cs/kategorie/podkategorie/tema/ pro českou verzi

- Nastavení meta tagů:
  - Dynamické title tagy podle šablony
  - Meta description s klíčovými slovy
  - Open Graph a Twitter Card tagy

- Implementace hreflang pro vícejazyčný obsah:
  ```html
  <link rel="alternate" hreflang="en" href="https://domain.com/path/" />
  <link rel="alternate" hreflang="cs" href="https://domain.com/cs/path/" />
  ```

### 5.2 Strukturovaná data
- Implementace JSON-LD schémat:
  - Article schema pro články
  - FAQPage pro FAQ sekce
  - HowTo pro návody
  - MedicalWebPage pro zdravotní obsah
  - BreadcrumbList pro navigaci

- Příklad implementace Article schema:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Jak intermitentní půst ovlivňuje dlouhověkost",
    "author": {
      "@type": "Person",
      "name": "Jméno Autora",
      "url": "https://domain.com/authors/jmeno-autora/"
    },
    "datePublished": "2023-05-15T08:00:00+01:00",
    "dateModified": "2023-05-20T10:30:00+01:00",
    "publisher": {
      "@type": "Organization",
      "name": "Longevity Hub",
      "logo": {
        "@type": "ImageObject",
        "url": "https://domain.com/logo.png",
        "width": 600,
        "height": 60
      }
    },
    "description": "Komplexní průvodce tím, jak intermitentní půst může prodloužit život a zlepšit zdraví."
  }
  ```

### 5.3 Výkonnostní optimalizace
- Implementace Core Web Vitals optimalizací:
  - LCP (Largest Contentful Paint) < 2.5s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1

- Strategie pro rychlé načítání:
  - Code splitting a lazy loading komponent
  - Preloading kritických zdrojů
  - Optimalizace fontů (font-display: swap)
  - Minimalizace CSS a JavaScript

- Implementace caching strategie:
  - Browser caching s dlouhou expirací pro statické zdroje
  - CDN pro globální distribuci obsahu
  - Implementace service workeru pro offline přístup