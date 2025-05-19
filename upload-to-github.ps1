param (
    [Parameter(Mandatory=$true)]
    [string]$GitHubToken,
    
    [Parameter(Mandatory=$false)]
    [string]$RepoUrl = "https://github.com/SpdVpr/longevity.git",
    
    [Parameter(Mandatory=$false)]
    [string]$Branch = "main",
    
    [Parameter(Mandatory=$false)]
    [string]$CommitMessage = "Update from script"
)

# Funkce pro výpis zpráv s časovým razítkem
function Write-Log {
    param (
        [string]$Message,
        [string]$Type = "INFO"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] [$Type] $Message"
}

# Funkce pro kontrolu, zda je Git nainstalován
function Test-GitInstalled {
    try {
        $gitVersion = git --version
        Write-Log "Git je nainstalován: $gitVersion"
        return $true
    }
    catch {
        Write-Log "Git není nainstalován nebo není dostupný v PATH" "ERROR"
        return $false
    }
}

# Funkce pro nastavení Git konfigurace
function Set-GitConfig {
    try {
        # Nastavení základní konfigurace
        git config --global core.longpaths true
        git config --global http.postBuffer 524288000
        git config --global http.sslVerify false
        git config --global core.autocrlf false
        
        # Nastavení timeout hodnot
        git config --global http.lowSpeedLimit 1000
        git config --global http.lowSpeedTime 300
        
        Write-Log "Git konfigurace byla nastavena"
        return $true
    }
    catch {
        Write-Log "Chyba při nastavování Git konfigurace: $_" "ERROR"
        return $false
    }
}

# Funkce pro nastavení vzdáleného repozitáře s tokenem
function Set-GitRemote {
    param (
        [string]$Token,
        [string]$Url
    )
    
    try {
        # Extrahujeme části URL
        $urlParts = $Url -split "://"
        $protocol = $urlParts[0]
        $urlPath = $urlParts[1]
        
        # Vytvoříme URL s tokenem
        $tokenUrl = "$protocol://$Token@$urlPath"
        
        # Nastavíme vzdálený repozitář
        git remote set-url origin $tokenUrl
        
        Write-Log "Vzdálený repozitář byl nastaven s tokenem"
        return $true
    }
    catch {
        Write-Log "Chyba při nastavování vzdáleného repozitáře: $_" "ERROR"
        return $false
    }
}

# Funkce pro nahrání změn na GitHub
function Push-ToGitHub {
    param (
        [int]$MaxRetries = 3,
        [int]$RetryDelay = 5
    )
    
    $retryCount = 0
    $success = $false
    
    while (-not $success -and $retryCount -lt $MaxRetries) {
        try {
            if ($retryCount -gt 0) {
                Write-Log "Pokus č. $($retryCount + 1) o nahrání na GitHub..." "WARN"
                Start-Sleep -Seconds $RetryDelay
            }
            
            # Pokus o push
            $output = git push -u origin $Branch 2>&1
            
            # Kontrola, zda byl push úspěšný
            if ($LASTEXITCODE -eq 0) {
                Write-Log "Úspěšně nahráno na GitHub"
                $success = $true
            }
            else {
                Write-Log "Push selhal s kódem $LASTEXITCODE: $output" "ERROR"
                $retryCount++
            }
        }
        catch {
            Write-Log "Chyba při nahrávání na GitHub: $_" "ERROR"
            $retryCount++
        }
    }
    
    return $success
}

# Hlavní funkce
function Main {
    # Kontrola, zda je Git nainstalován
    if (-not (Test-GitInstalled)) {
        Write-Log "Ukončuji skript - Git není nainstalován" "ERROR"
        exit 1
    }
    
    # Nastavení Git konfigurace
    if (-not (Set-GitConfig)) {
        Write-Log "Ukončuji skript - Chyba při nastavování Git konfigurace" "ERROR"
        exit 1
    }
    
    # Nastavení vzdáleného repozitáře s tokenem
    if (-not (Set-GitRemote -Token $GitHubToken -Url $RepoUrl)) {
        Write-Log "Ukončuji skript - Chyba při nastavování vzdáleného repozitáře" "ERROR"
        exit 1
    }
    
    # Kontrola, zda existují změny k commitu
    $status = git status --porcelain
    if ($status) {
        Write-Log "Nalezeny změny k commitu"
        
        # Přidání všech změn
        git add .
        
        # Vytvoření commitu
        git commit -m $CommitMessage
        
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Chyba při vytváření commitu" "ERROR"
            exit 1
        }
    }
    else {
        Write-Log "Žádné změny k commitu"
    }
    
    # Nahrání změn na GitHub
    if (Push-ToGitHub) {
        Write-Log "Skript byl úspěšně dokončen"
        exit 0
    }
    else {
        Write-Log "Ukončuji skript - Nepodařilo se nahrát změny na GitHub po opakovaných pokusech" "ERROR"
        exit 1
    }
}

# Spuštění hlavní funkce
Main
