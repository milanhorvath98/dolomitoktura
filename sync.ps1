param(
    [string]$Message = ""
)

$ErrorActionPreference = "Continue"
$ProjectPath = $PSScriptRoot
Set-Location $ProjectPath

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  DOLOMITOK TURA - AUTOMATIKUS SZINKRON" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Git Commit & Push (GitHub)
Write-Host "`n[1/3] Git állapot ellenőrzése és mentés..." -ForegroundColor Yellow
git add -A

$changes = git status --porcelain
if ($changes) {
    if (-not $Message) {
        $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm")
        $commitMsg = "Auto-sync: $timestamp"
    } else {
        $commitMsg = $Message
    }
    git commit -m $commitMsg
    Write-Host "Git commit elkészült: '$commitMsg'" -ForegroundColor Green
} else {
    Write-Host "Nincs új commitolandó módosítás." -ForegroundColor Gray
}

Write-Host "`n[2/3] Feltöltés GitHubra (origin main)..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "GitHub szinkronizáció sikeres!" -ForegroundColor Green
} else {
    Write-Host "Figyelem: GitHub push nem sikerült (hitelesítés szükséges)." -ForegroundColor Red
}

# 2. Szinkronizáció a Raspberry Pi szerverre
Write-Host "`n[3/3] Másolás a Raspberry Pi webszerverre..." -ForegroundColor Yellow
scp -r -o BatchMode=yes -o ConnectTimeout=5 index.html styles.css app.js data.js elevation_profiles.json favicon.svg hero_*.* cadini_di_misurina.jpg gpx raspberry:/home/milan/dolomitok-web/
if ($LASTEXITCODE -eq 0) {
    Write-Host "Raspberry Pi webszerver sikeresen frissítve!" -ForegroundColor Green
} else {
    Write-Host "Megjegyzés: Raspberry Pi nem érhető el közvetlenül jelenleg." -ForegroundColor Yellow
}

Write-Host "`nSzinkronizáció befejezve!" -ForegroundColor Cyan
