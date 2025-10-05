# Google Search Console - Průvodce po nasazení SEO oprav

## 1. Okamžité kroky po nasazení

### A. Ověření nasazení
1. Otevřete: https://www.longevitygrow.com/sitemap.xml
2. Zkontrolujte, že vidíte seznam všech URL
3. Otevřete: https://www.longevitygrow.com/robots.txt
4. Ověřte, že obsahuje odkaz na sitemap

### B. Test jednoho článku
1. Otevřete libovolný článek, např.:
   - https://www.longevitygrow.com/en/articles/intermittent-fasting-a-modern-approach-to-nutrition-for-longevity
2. Klikněte pravým tlačítkem → "Zobrazit zdrojový kód"
3. Hledejte (Ctrl+F):
   - `<link rel="canonical"` - mělo by být přítomno
   - `application/ld+json` - strukturovaná data
   - `og:url` - Open Graph tagy

## 2. Google Search Console - Základní nastavení

### A. Přidání/ověření sitemap
1. Otevřete [Google Search Console](https://search.google.com/search-console)
2. Vyberte property: `longevitygrow.com`
3. V levém menu klikněte na **Sitemaps**
4. Do pole "Add a new sitemap" zadejte: `sitemap.xml`
5. Klikněte **Submit**

### B. Kontrola stavu sitemap
- Počkejte 5-10 minut
- Obnovte stránku
- Měli byste vidět:
  - Status: **Success**
  - Discovered URLs: **[počet článků + statické stránky]**

## 3. Požadavek na reindexaci článků

### Metoda 1: Jednotlivé URL (doporučeno pro důležité články)

1. V Google Search Console klikněte na **URL Inspection** (nahoře)
2. Zadejte URL článku, např.:
   ```
   https://www.longevitygrow.com/en/articles/intermittent-fasting-a-modern-approach-to-nutrition-for-longevity
   ```
3. Klikněte **Enter**
4. Počkejte na analýzu (10-30 sekund)
5. Pokud vidíte "URL is not on Google" nebo "URL has issues":
   - Klikněte **Request Indexing**
   - Počkejte 1-2 minuty na validaci
   - Klikněte **Request Indexing** znovu
6. Opakujte pro 5-10 nejdůležitějších článků

### Metoda 2: Hromadná reindexace přes sitemap

1. Jděte na **Sitemaps**
2. Klikněte na váš sitemap
3. Google automaticky začne crawlovat URL ze sitemap
4. Tento proces trvá 1-7 dní

## 4. Monitoring a kontrola

### A. Coverage Report (Pokrytí)

1. V levém menu klikněte na **Coverage** nebo **Pages**
2. Sledujte tyto metriky:
   - **Valid** (Platné) - mělo by růst
   - **Error** (Chyby) - mělo by klesat
   - **Excluded** (Vyloučené) - zkontrolujte důvody

### B. Kontrola konkrétních chyb

Pokud stále vidíte "Duplicate without user-selected canonical":

1. Klikněte na chybu
2. Zobrazí se seznam postižených URL
3. Pro každou URL:
   - Klikněte na URL
   - Klikněte **Inspect URL**
   - Zkontrolujte, zda má kanonickou URL
   - Pokud ano, klikněte **Request Indexing**

### C. Performance (Výkon)

1. Klikněte na **Performance** v levém menu
2. Sledujte:
   - **Total clicks** - mělo by růst
   - **Total impressions** - mělo by růst
   - **Average CTR** - mělo by se zlepšovat
   - **Average position** - mělo by klesat (lepší pozice)

## 5. Časová osa očekávaných změn

### Den 1-3 (Okamžitě po nasazení)
- ✅ Sitemap je přijata
- ✅ Robots.txt je čitelný
- ⏳ Google začíná crawlovat nové URL

### Týden 1
- ✅ První články jsou reindexovány
- ✅ Kanonické URL jsou rozpoznány
- ⏳ Chyby "Duplicate without canonical" začínají mizet

### Týden 2-3
- ✅ Většina článků je reindexována
- ✅ Strukturovaná data jsou rozpoznána
- ✅ Rich snippets se mohou začít zobrazovat

### Měsíc 1
- ✅ Všechny články by měly být indexovány
- ✅ Chyby by měly být vyřešeny
- ✅ Pozice ve vyhledávání se zlepšují

## 6. Řešení problémů

### Problém: Sitemap není přijata

**Řešení:**
1. Zkontrolujte, že sitemap je dostupná: https://www.longevitygrow.com/sitemap.xml
2. Ověřte formát XML (měl by být validní)
3. Zkontrolujte robots.txt: https://www.longevitygrow.com/robots.txt
4. Zkuste znovu odeslat sitemap

### Problém: URL stále není indexována

**Řešení:**
1. Použijte URL Inspection tool
2. Zkontrolujte "Coverage" sekci
3. Hledejte konkrétní chyby:
   - **Crawled - currently not indexed**: Normální, Google indexuje postupně
   - **Discovered - currently not indexed**: Přidejte interní odkazy na článek
   - **Excluded by 'noindex' tag**: Zkontrolujte meta tagy
   - **Soft 404**: Zkontrolujte, že stránka vrací 200 status

### Problém: Duplicate canonical stále přítomna

**Řešení:**
1. Zkontrolujte zdrojový kód stránky
2. Ověřte, že `<link rel="canonical">` je přítomen
3. Ujistěte se, že kanonická URL je absolutní (začíná https://)
4. Požádejte o reindexaci konkrétní URL
5. Počkejte 1-2 týdny na aktualizaci

## 7. Optimalizace po nasazení

### A. Interní odkazy
- Přidejte "Related Articles" sekci na konec každého článku
- Propojte články ve stejné kategorii
- Přidejte odkazy z hlavní stránky na nejdůležitější články

### B. Sociální signály
- Sdílejte články na sociálních sítích
- Přidejte Open Graph obrázky
- Optimalizujte Twitter Card preview

### C. Rychlost stránky
1. V Google Search Console jděte na **Core Web Vitals**
2. Zkontrolujte metriky:
   - LCP (Largest Contentful Paint) - mělo být < 2.5s
   - FID (First Input Delay) - mělo být < 100ms
   - CLS (Cumulative Layout Shift) - mělo být < 0.1

## 8. Pravidelná údržba

### Týdně
- Zkontrolujte Coverage report
- Sledujte nové chyby
- Požádejte o indexaci nových článků

### Měsíčně
- Analyzujte Performance report
- Identifikujte nejlepší a nejhorší články
- Optimalizujte meta descriptions pro články s nízkou CTR

### Čtvrtletně
- Kompletní SEO audit
- Aktualizace starých článků
- Kontrola broken links

## 9. Užitečné nástroje

### Google nástroje
- [Google Search Console](https://search.google.com/search-console)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

### Testování strukturovaných dat
1. Otevřete: https://search.google.com/test/rich-results
2. Zadejte URL článku
3. Klikněte **Test URL**
4. Zkontrolujte, že Article schema je rozpoznáno

### Testování kanonických URL
```bash
# V prohlížeči otevřete Developer Tools (F12)
# V Console zadejte:
document.querySelector('link[rel="canonical"]').href
# Mělo by vrátit: https://www.longevitygrow.com/en/articles/[slug]
```

## 10. Kontaktní informace a podpora

### Pokud máte problémy:
1. Zkontrolujte Vercel deployment logs
2. Zkontrolujte browser console pro JavaScript chyby
3. Použijte Google Search Console URL Inspection
4. Zkontrolujte dokumentaci: `SEO-FIX-CANONICAL-URLS.md`

### Důležité URL pro monitoring:
- Website: https://www.longevitygrow.com
- Sitemap: https://www.longevitygrow.com/sitemap.xml
- Robots: https://www.longevitygrow.com/robots.txt
- Google Search Console: https://search.google.com/search-console
- Vercel Dashboard: https://vercel.com/dashboard

## Závěr

Po provedení všech kroků v tomto průvodci by měly být všechny problémy s duplicitními stránkami vyřešeny. Buďte trpěliví - Google potřebuje čas na reindexaci (1-4 týdny).

**Klíčové metriky úspěchu:**
- ✅ 0 chyb "Duplicate without canonical"
- ✅ Všechny články ve stavu "Valid" v Coverage
- ✅ Rostoucí počet impressions a clicks
- ✅ Strukturovaná data rozpoznána v Rich Results Test

