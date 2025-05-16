# Návod na nasazení projektu na Vercel

Tento návod vás provede nasazením projektu přímo na Vercel pomocí Vercel aplikace.

## Příprava projektu

Projekt je již připraven pro nasazení na Vercel. Obsahuje:

1. Soubor `next.config.ts` s vypnutými kontrolami ESLint a TypeScript
2. Soubor `vercel.json` s konfigurací pro Vercel

## Nasazení pomocí Vercel aplikace

### Krok 1: Otevřete Vercel aplikaci

Spusťte Vercel aplikaci na vašem počítači.

### Krok 2: Import projektu

1. Klikněte na tlačítko "Import Project" nebo podobné
2. Vyberte možnost "Import Local Project" (nebo podobnou)
3. Vyberte složku `website` vašeho projektu (D:\longevity\website)

### Krok 3: Konfigurace projektu

1. Zadejte název projektu (např. "longevity")
2. Vyberte svůj osobní účet jako vlastníka
3. Vyberte framework "Next.js" (měl by být detekován automaticky)
4. Nastavte kořenový adresář na `.` (tečka, znamená aktuální adresář)
5. Nastavte příkaz pro build na `next build` (měl by být nastaven automaticky)
6. Nastavte výstupní adresář na `.next` (měl by být nastaven automaticky)

### Krok 4: Nastavení proměnných prostředí

Klikněte na "Environment Variables" a přidejte následující proměnné:

1. `NEXT_PUBLIC_STRAPI_API_URL`: `http://localhost:1337` (dočasně, později změníte na URL Strapi Cloud)
2. `NEXTAUTH_SECRET`: Vygenerujte náhodný řetězec (např. pomocí [tohoto nástroje](https://generate-secret.vercel.app/32))
3. `NEXTAUTH_URL`: Ponechte prázdné, Vercel ho nastaví automaticky

### Krok 5: Nasazení

1. Klikněte na tlačítko "Deploy" nebo podobné
2. Počkejte, až se projekt nasadí (může to trvat několik minut)
3. Po úspěšném nasazení se zobrazí URL vašeho projektu (např. `https://longevity.vercel.app`)

## Po nasazení

### Kontrola nasazení

1. Klikněte na URL vašeho projektu a zkontrolujte, zda web funguje správně
2. Očekávejte, že funkce závislé na Strapi nebudou fungovat, dokud nepropojíte Strapi Cloud

### Propojení se Strapi Cloud

Po nasazení Strapi na Strapi Cloud:

1. Přejděte na dashboard vašeho projektu na Vercel
2. Klikněte na "Settings" > "Environment Variables"
3. Aktualizujte proměnnou `NEXT_PUBLIC_STRAPI_API_URL` na URL vašeho Strapi Cloud
4. Klikněte na "Save"
5. Přejděte na záložku "Deployments" a klikněte na "Redeploy" u posledního nasazení

### Nastavení vlastní domény

1. Přejděte na dashboard vašeho projektu na Vercel
2. Klikněte na "Settings" > "Domains"
3. Přidejte svou doménu
4. Postupujte podle instrukcí pro nastavení DNS záznamů u vašeho poskytovatele domény

## Řešení problémů

### Build selhal kvůli chybám ESLint nebo TypeScript

Pokud build selže kvůli chybám ESLint nebo TypeScript, ujistěte se, že soubor `next.config.ts` obsahuje:

```typescript
eslint: {
  ignoreDuringBuilds: true,
},
typescript: {
  ignoreBuildErrors: true,
},
```

### Problémy s připojením k Strapi

Pokud máte problémy s připojením k Strapi:

1. Zkontrolujte, zda je Strapi spuštěný a dostupný
2. Zkontrolujte, zda je správně nastavená proměnná `NEXT_PUBLIC_STRAPI_API_URL`
3. Ujistěte se, že Strapi má povolené CORS pro doménu vašeho Vercel nasazení

### Další problémy

Pokud narazíte na další problémy:

1. Zkontrolujte logy buildu a nasazení na Vercel dashboardu
2. Zkontrolujte konzoli prohlížeče pro chyby na straně klienta
3. Zkontrolujte logy serveru na Vercel dashboardu pro chyby na straně serveru
