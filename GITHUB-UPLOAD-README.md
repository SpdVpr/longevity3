# Návod na nahrávání na GitHub

Tento návod popisuje, jak spolehlivě nahrávat kód na GitHub pomocí přiložených skriptů.

## Požadavky

- Nainstalovaný Git
- PowerShell (součást Windows)
- GitHub Personal Access Token (PAT)

## Získání GitHub Personal Access Token (PAT)

1. Přihlaste se na [GitHub](https://github.com)
2. Klikněte na svůj profilový obrázek v pravém horním rohu a vyberte "Settings"
3. V levém menu přejděte na "Developer settings"
4. Klikněte na "Personal access tokens" a poté na "Tokens (classic)"
5. Klikněte na "Generate new token" a poté na "Generate new token (classic)"
6. Zadejte popis tokenu (např. "Upload script")
7. Vyberte následující oprávnění:
   - `repo` (plný přístup k repozitářům)
8. Klikněte na "Generate token"
9. **Důležité**: Zkopírujte vygenerovaný token a uložte ho na bezpečné místo. Token se zobrazí pouze jednou!

## Použití skriptů

### Metoda 1: Použití dávkového souboru (nejjednodušší)

1. Spusťte soubor `upload-to-github.bat` dvojklikem
2. Vložte váš GitHub token, když budete vyzváni
3. Volitelně zadejte vlastní zprávu commitu
4. Skript automaticky nahraje všechny změny na GitHub

### Metoda 2: Použití PowerShell skriptu přímo

```powershell
.\upload-to-github.ps1 -GitHubToken "váš_github_token" -CommitMessage "vaše zpráva commitu"
```

### Volitelné parametry

- `-RepoUrl` - URL repozitáře (výchozí: "https://github.com/SpdVpr/longevity.git")
- `-Branch` - Větev, do které chcete nahrávat (výchozí: "main")

## Řešení problémů

### Skript hlásí chybu "Git není nainstalován"

Ujistěte se, že máte nainstalovaný Git a je přidaný do systémové proměnné PATH.

### Skript hlásí chybu při nahrávání na GitHub

1. Zkontrolujte, zda je váš token platný a má správná oprávnění
2. Zkontrolujte připojení k internetu
3. Zkuste skript spustit znovu

### Skript hlásí "Žádné změny k commitu"

Toto není chyba. Znamená to, že ve vašem repozitáři nejsou žádné změny, které by bylo potřeba nahrát na GitHub.

## Tipy pro spolehlivé nahrávání

1. Vždy používejte aktuální GitHub token
2. Před spuštěním skriptu se ujistěte, že máte stabilní připojení k internetu
3. Pokud máte velký repozitář, může nahrávání trvat delší dobu
4. Skript automaticky provádí opakované pokusy při selhání, ale pokud stále selhává, zkuste ho spustit znovu později
