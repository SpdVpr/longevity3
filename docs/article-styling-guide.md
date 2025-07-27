# Průvodce stylováním článků

Tento dokument popisuje, jak jsou články stylované na webu Longevity a jak funguje CSS pro zobrazení obsahu.

## Přehled systému

Články se generují v HTML formátu pomocí Perplexity AI a ukládají se do Strapi CMS. Na webu se pak zobrazují pomocí CSS stylů, které zajišťují profesionální a čitelný vzhled.

## CSS struktura

### Hlavní třída `.article-content`

Všechen obsah článků je zabalen v třídě `.article-content`, která poskytuje:

- **Maximální šířku**: 1000px pro optimální čitelnost
- **Centrování**: Automatické centrování obsahu
- **Typografii**: Georgia serif font pro lepší čitelnost
- **Základní velikost**: 18px pro komfortní čtení

```css
.article-content {
  max-width: 1000px !important;
  margin: 0 auto;
  line-height: 1.7;
  color: #374151;
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 18px;
}
```

## Styly nadpisů

### H1 - Hlavní nadpis
- **Velikost**: 2.25rem (36px)
- **Barva**: #1f2937 (tmavě šedá)
- **Margin**: Bez horního marginu

### H2 - Hlavní sekce
- **Velikost**: 1.875rem (30px)
- **Spodní ohraničení**: 3px solid teal
- **Ikona**: ▶ symbol v teal barvě
- **Padding**: 0.75rem spodní, 1rem levý

```css
.article-content h2::before {
  content: "▶";
  color: var(--teal);
  font-size: 1rem;
  position: absolute;
  left: 0;
  top: 0.25rem;
}
```

### H3 - Podsekce
- **Velikost**: 1.5rem (24px)
- **Barva**: var(--indigo)
- **Ikona**: ● symbol v teal barvě
- **Padding**: 1.5rem levý

```css
.article-content h3::before {
  content: "●";
  color: var(--teal);
  font-size: 0.75rem;
  position: absolute;
  left: 0;
  top: 0.5rem;
}
```

## Styly textu

### Odstavce
- **Velikost**: 1.125rem (18px)
- **Řádkování**: 1.8
- **Spodní margin**: 1.5rem

### První odstavec (úvodní text)
- **Zvýrazněný design**: Světle modrý background
- **Levý border**: 4px solid teal
- **Padding**: 1.5rem
- **Velikost**: 1.25rem
- **Barva**: var(--indigo)

### Zvýraznění textu
- **Tučný text**: Barva var(--indigo)
- **Kurzíva**: Standardní italic

## Styly seznamů

### Nečíslované seznamy (ul)
- **Typ značky**: disc
- **Barva značky**: var(--teal)
- **Levý padding**: 2rem

### Číslované seznamy (ol)
- **Typ značky**: decimal
- **Barva značky**: var(--teal)
- **Levý padding**: 2rem

### Položky seznamu (li)
- **Velikost**: 1.125rem
- **Řádkování**: 1.7
- **Spodní margin**: 0.5rem

## Styly odkazů

```css
.article-content a {
  color: var(--teal);
  text-decoration: underline;
  transition: color 0.2s ease;
}

.article-content a:hover {
  color: var(--teal-dark);
}
```

## Styly citací

```css
.article-content blockquote {
  border-left: 4px solid var(--teal);
  padding-left: 1.5rem;
  margin: 2rem 0;
  font-style: italic;
  color: #6b7280;
  background-color: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.5rem;
}
```

## Styly kódu

### Inline kód
- **Background**: #f3f4f6
- **Padding**: 0.25rem 0.5rem
- **Border radius**: 0.25rem
- **Font**: Courier New monospace
- **Barva**: var(--indigo)

### Blok kódu
- **Background**: #1f2937 (tmavý)
- **Barva textu**: #f9fafb (světlá)
- **Padding**: 1.5rem
- **Overflow**: auto pro horizontální scrollování

## Styly tabulek

```css
.article-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
  font-size: 1rem;
}

.article-content th {
  background-color: var(--teal);
  color: white;
  font-weight: 600;
}

.article-content tr:nth-child(even) {
  background-color: #f9fafb;
}
```

## Styly obrázků

```css
.article-content img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 2rem 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

## Responzivní design

### Mobilní zařízení (max-width: 768px)

```css
@media (max-width: 768px) {
  .article-content {
    padding: 0 1rem;
  }
  
  .article-content h1 {
    font-size: 1.875rem;
  }
  
  .article-content h2 {
    font-size: 1.5rem;
  }
  
  .article-content h3 {
    font-size: 1.25rem;
  }
  
  .article-content p,
  .article-content li {
    font-size: 1rem;
  }
}
```

## Barevná paleta

Systém používá CSS proměnné definované v `:root`:

```css
:root {
  --teal: #0ABAB5;        /* Primární teal */
  --teal-dark: #05807C;   /* Tmavší teal */
  --teal-light: #8AE0DC;  /* Světlejší teal */
  --indigo: #3E5C76;      /* Sekundární indigo */
  --indigo-dark: #293F54; /* Tmavší indigo */
  --indigo-light: #CDD6E0; /* Světlejší indigo */
}
```

## Implementace v komponentách

### RenderBlocks komponenta

```javascript
return (
  <div
    key={`rich-text-${index}`}
    dangerouslySetInnerHTML={{ __html: cleanBody }}
    className="mb-6 article-content"
  />
);
```

### Hlavní článková stránka

```javascript
<article className="prose prose-lg max-w-none" style={{ maxWidth: '1000px', margin: '0 auto' }}>
  {article.content ? (
    <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />
  ) : (
    <RenderBlocks blocks={article.blocks} />
  )}
</article>
```

## Důležité poznámky

1. **!important použití**: Všechny styly používají `!important` pro přepsání Tailwind CSS `prose` třídy
2. **Serif font**: Georgia se používá pro lepší čitelnost dlouhých textů
3. **Teal akcenty**: Všechny interaktivní a zvýrazňující elementy používají teal barvu
4. **Responzivní**: Styly se automaticky přizpůsobují mobilním zařízením
5. **Čistý obsah**: Meta description se automaticky odstraňuje z obsahu článku

## Testování stylů

Pro testování stylů byly vytvořeny testovací články:
- ID 18: "CSS Styling Test: Omega-3 Fatty Acids for Brain Health"
- ID 20: "Final Styling Test: The Power of Meditation for Longevity"  
- ID 22: "Complete Styling Demo: The Science of Healthy Aging"

Tyto články demonstrují všechny stylovací prvky v akci.
