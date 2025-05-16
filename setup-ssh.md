# Nastavení SSH klíče pro GitHub

Pokud máte problémy s nahráváním na GitHub přes HTTPS, zkuste použít SSH klíč, který je obecně považován za spolehlivější metodu.

## Krok 1: Vygenerování SSH klíče

1. Otevřete PowerShell nebo příkazový řádek
2. Zadejte následující příkaz (nahraďte e-mail svým GitHub e-mailem):

```
ssh-keygen -t ed25519 -C "michalvesecky@gmail.com"
```

3. Stiskněte Enter pro uložení klíče do výchozího umístění
4. Zadejte heslo pro klíč (nebo nechte prázdné pro klíč bez hesla)

## Krok 2: Přidání SSH klíče do SSH agenta

1. Spusťte SSH agenta:

```
eval "$(ssh-agent -s)"
```

nebo na Windows:

```
start-ssh-agent
```

2. Přidejte svůj SSH klíč do agenta:

```
ssh-add ~/.ssh/id_ed25519
```

## Krok 3: Přidání SSH klíče na GitHub

1. Zkopírujte obsah veřejného klíče do schránky:

```
cat ~/.ssh/id_ed25519.pub
```

nebo na Windows:

```
type %USERPROFILE%\.ssh\id_ed25519.pub
```

2. Přejděte na GitHub > Settings > SSH and GPG keys
3. Klikněte na "New SSH key"
4. Zadejte název klíče (např. "Můj počítač")
5. Vložte obsah veřejného klíče
6. Klikněte na "Add SSH key"

## Krok 4: Změna URL repozitáře na SSH

1. Změňte URL repozitáře z HTTPS na SSH:

```
git remote set-url origin git@github.com:SpdVpr/longevity.git
```

2. Ověřte, že změna proběhla úspěšně:

```
git remote -v
```

## Krok 5: Nahrání na GitHub

1. Přidejte změny:

```
git add .
```

2. Vytvořte commit:

```
git commit -m "Vaše zpráva"
```

3. Nahrajte na GitHub:

```
git push -u origin main
```

## Řešení problémů

Pokud se zobrazí chyba "Permission denied (publickey)", ujistěte se, že:

1. Váš SSH klíč je správně přidán na GitHub
2. SSH agent běží a obsahuje váš klíč
3. Používáte správnou URL repozitáře (SSH, ne HTTPS)

Pro otestování SSH připojení můžete použít:

```
ssh -T git@github.com
```

Měli byste vidět zprávu "Hi username! You've successfully authenticated..."
