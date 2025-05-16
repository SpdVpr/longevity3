# Ruční nahrání projektu na GitHub

Pokud automatické skripty nefungují, můžete projekt nahrát ručně pomocí webového rozhraní GitHub.

## Krok 1: Vytvoření ZIP archivu

1. Otevřete průzkumník souborů a přejděte do složky `website`
2. Vyberte všechny soubory a složky
3. Klikněte pravým tlačítkem a vyberte "Odeslat do" > "Komprimovaná složka (ZIP)"
4. Pojmenujte ZIP soubor (např. "longevity-website.zip")

## Krok 2: Nahrání na GitHub

1. Přejděte na https://github.com/SpdVpr/longevity2
2. Klikněte na tlačítko "Add file" > "Upload files"
3. Přetáhněte ZIP soubor do oblasti pro nahrávání nebo klikněte na "choose your files" a vyberte ZIP soubor
4. Zadejte popis commitu (např. "Initial commit")
5. Klikněte na "Commit changes"

## Krok 3: Rozbalení ZIP archivu na GitHubu

Bohužel, GitHub neumožňuje automatické rozbalení ZIP souborů. Máte dvě možnosti:

### Možnost A: Nahrát jednotlivé soubory

1. Stáhněte si ZIP soubor z GitHubu
2. Rozbalte ho na svém počítači
3. Nahrajte jednotlivé soubory a složky na GitHub

### Možnost B: Použít GitHub Desktop

1. Stáhněte a nainstalujte [GitHub Desktop](https://desktop.github.com/)
2. Přihlaste se ke svému GitHub účtu
3. Klonujte repozitář longevity2
4. Zkopírujte všechny soubory z vašeho projektu do složky repozitáře
5. Vytvořte commit a nahrajte změny

## Krok 4: Nasazení na Vercel

Po úspěšném nahrání projektu na GitHub můžete pokračovat s nasazením na Vercel:

1. Přejděte na [Vercel](https://vercel.com) a přihlaste se
2. Klikněte na "Add New..." > "Project"
3. Vyberte váš GitHub repozitář "longevity2"
4. Nastavte potřebné proměnné prostředí
5. Klikněte na "Deploy"
