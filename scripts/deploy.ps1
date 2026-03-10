# Uprising Clip - Script de deploiement (PowerShell)
# Usage: .\scripts\deploy.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path $root)) { $root = (Get-Location).Path }

Write-Host "=== Uprising Clip - Deploiement ===" -ForegroundColor Cyan
Write-Host "Racine projet: $root" -ForegroundColor Cyan
Write-Host ""

$webEnv = Join-Path $root "content-engine-web\.env.example"
if (-not (Test-Path $webEnv)) {
    Write-Host "Attention: content-engine-web\.env.example manquant." -ForegroundColor Yellow
} else {
    Write-Host "[OK] .env.example present." -ForegroundColor Green
}

$webDir = Join-Path $root "content-engine-web"
if (-not (Test-Path (Join-Path $webDir "package.json"))) {
    Write-Host "Erreur: content-engine-web/ introuvable." -ForegroundColor Red
    exit 1
}
Push-Location $webDir
try {
    Write-Host "[Build] npm run build..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    Write-Host "[OK] Build reussi." -ForegroundColor Green
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "=== Etapes suivantes ===" -ForegroundColor Cyan
Write-Host "1. Vercel: Root Directory = content-engine-web, ajouter les variables Supabase."
Write-Host "2. Supabase: executer supabase/migrations/*.sql"
Write-Host "3. Worker: python run.py avec SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY"
