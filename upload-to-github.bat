@echo off
setlocal

echo ===== Nahrávání na GitHub =====

:: Nastavení GitHub tokenu
set /p GITHUB_TOKEN="Zadejte GitHub token: "

:: Nastavení zprávy commitu
set COMMIT_MESSAGE=Update %date% %time%
set /p CUSTOM_MESSAGE="Zadejte vlastní zprávu commitu (nebo stiskněte Enter pro výchozí): "
if not "%CUSTOM_MESSAGE%"=="" set COMMIT_MESSAGE=%CUSTOM_MESSAGE%

:: Spuštění PowerShell skriptu
powershell -ExecutionPolicy Bypass -File "%~dp0upload-to-github.ps1" -GitHubToken "%GITHUB_TOKEN%" -CommitMessage "%COMMIT_MESSAGE%"

:: Kontrola výsledku
if %ERRORLEVEL% EQU 0 (
    echo.
    echo Nahrávání na GitHub bylo úspěšné!
) else (
    echo.
    echo Nahrávání na GitHub selhalo s kódem %ERRORLEVEL%
)

echo.
pause
endlocal
