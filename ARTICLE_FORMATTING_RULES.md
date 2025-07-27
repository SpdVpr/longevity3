# Pravidla pro formátování článků v Strapi CMS

## Povinné požadavky pro všechny články

### 1. HTML struktura místo Markdown
- ❌ **Špatně:** `**tučný text**`
- ✅ **Správně:** `<strong>tučný text</strong>`

### 2. Odstavce s <br> pro správné formátování
- ❌ **Špatně:** Dlouhé odstavce bez zalomení
- ✅ **Správně:** Používej `<br><br>` pro oddělení myšlenek v odstavci

```html
<p>První myšlenka nebo věta.<br><br>

Druhá myšlenka nebo věta s novým řádkem.<br><br>

Třetí myšlenka pokračuje logicky.</p>
```

### 3. Tabulky jako HTML
- ❌ **Špatně:** Markdown tabulky s `|` znaky
- ✅ **Správně:** HTML tabulky s CSS třídami

```html
<table class="supplements-table">
<thead>
<tr>
<th>Sloupec 1</th>
<th>Sloupec 2</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Hodnota 1</strong></td>
<td>Hodnota 2</td>
</tr>
</tbody>
</table>
```

### 4. Povinná sekce References s URL odkazy
Každý článek MUSÍ obsahovat sekci s referencemi na konci. Sekce musí být oddělená novým řádkem a tučně:

```html
<br><br>

<h2><strong>References</strong></h2>
<ol>
<li>Autor, A. et al. (2024). <a href="https://doi.org/10.1000/example" target="_blank">"Název studie."</a> <em>Journal Name</em>, 12(3), 123-145.</li>
<li>Autor, B. et al. (2023). <a href="https://pubmed.ncbi.nlm.nih.gov/12345678" target="_blank">"Název studie."</a> <em>Journal Name</em>, 11(2), 67-89.</li>
</ol>
```

**Důležité:**
- Nadpis References musí být tučný: `<h2><strong>References</strong></h2>`
- Název studie v uvozovkách je hypertextový odkaz, ne samostatný URL
- Odkaz se otevře v novém okně (`target="_blank"`)

### 5. Odkazy na zdroje v textu
- Používej `<sup>[číslo]</sup>` pro odkazy na reference
- Příklad: `Vitamin D3 má pozitivní účinky<sup>[1]</sup>.`

### 6. Správná struktura nadpisů
```html
<h2>Hlavní sekce</h2>
<h3>Podsekce</h3>
<p>Odstavec textu...</p>
```

### 7. Meta description
**POZOR:** Meta description se NEPŘIDÁVÁ do obsahu článku! Je pouze pro SEO a zadává se v Strapi do pole "Description" (max 80 znaků).

❌ **Špatně:** Přidávat do článku:
```html
<p><strong>Meta description:</strong> Krátký popis článku pro SEO.</p>
```

✅ **Správně:** Článek začíná přímo nadpisem:
```html
<div class="article-content">
<h2>Název článku</h2>
```

### 8. Wrapper div
Celý obsah zabal do:
```html
<div class="article-content">
  <!-- obsah článku -->
</div>
```

### 9. Seznamy
```html
<ul>
<li><strong>Položka 1:</strong> Popis položky</li>
<li><strong>Položka 2:</strong> Popis položky</li>
</ul>
```

## Dostupné CSS třídy pro tabulky

### .supplements-table
- Stylizovaná tabulka s turquoise hlavičkou
- Střídavé barvy řádků
- Zaoblené rohy a stíny

### Příklad kompletního článku

```html
<div class="article-content">
<h2>Název článku</h2>

<h3>Úvod</h3>
<p>Úvodní text s odkazem na studii<sup>[1]</sup>.<br><br>

Další odstavec s důležitými informacemi.</p>

<h2>Hlavní obsah</h2>
<p>Text s <strong>důležitými</strong> informacemi.<br><br>

Pokračování textu s dalšími informacemi.</p>

<table class="supplements-table">
<thead>
<tr>
<th>Doplněk</th>
<th>Účinky</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Vitamin D3</strong></td>
<td>Podporuje zdraví kostí<sup>[2]</sup></td>
</tr>
</tbody>
</table>

<h2>Závěr</h2>
<p>Závěrečný text s několika myšlenkami.<br><br>

Další důležitá informace na závěr.</p>

<br><br>

<h2><strong>References</strong></h2>
<ol>
<li>Autor, A. (2024). <a href="https://doi.org/10.1000/example1" target="_blank">"Název studie."</a> <em>Journal</em>, 1, 1-10.</li>
<li>Autor, B. (2023). <a href="https://doi.org/10.1000/example2" target="_blank">"Další studie."</a> <em>Journal</em>, 2, 11-20.</li>
</ol>
</div>
```

## Kontrolní seznam před publikováním

- [ ] Meta description zadána v Strapi (max 80 znaků) - NENÍ v obsahu článku!
- [ ] Článek začíná přímo nadpisem H2, bez meta description
- [ ] Používá `<strong>` místo `**`
- [ ] Odstavce používají `<br><br>` pro správné zalomení
- [ ] Tabulky jsou v HTML formátu s CSS třídami
- [ ] Obsahuje sekci References s `<br><br>` před ní
- [ ] Nadpis References je tučný: `<h2><strong>References</strong></h2>`
- [ ] Názvy studií jsou hypertextové odkazy, ne samostatné URL
- [ ] Odkazy se otevírají v novém okně (`target="_blank"`)
- [ ] Odkazy na zdroje používají `<sup>[číslo]</sup>`
- [ ] Správná struktura nadpisů (H2, H3)
- [ ] Zabaleno v `<div class="article-content">`
- [ ] Seznamy používají HTML `<ul>` a `<li>`

## Poznámka pro AI asistenty

Při generování nebo úpravě článků VŽDY dodržuj tato pravidla:

1. **NIKDY nepřidávej meta description do obsahu článku** - je pouze pro Strapi pole "Description"
2. **Článek začíná přímo nadpisem H2**
3. **References nadpis musí být tučný a oddělený novým řádkem**
4. **Názvy studií jsou hypertextové odkazy, ne samostatné URL**
5. **Každý článek musí být kompletní s referencemi a správným HTML formátováním**
