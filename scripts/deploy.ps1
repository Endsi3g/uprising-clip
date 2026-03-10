# Uprising Clip – Script de déploiement (PowerShell)
# Usage: .\scripts\deploy.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
if (-not (Test-Path $root)) { $root = (Get-Location).Path }

Write-Host "=== Uprising Clip – Déploiement ===" -ForegroundColor Cyan
Write-Host "Racine projet: $root`n"

# 1. Vérifier .env.example
$webEnv = Join-Path $root "content-engine-web\.env.example"
if (-not (Test-Path $webEnv)) {
    Write-Host "Attention: content-engine-web\.env.example manquant." -ForegroundColor Yellow
} else {
    Write-Host "[OK] .env.example présent (copier en .env.local et remplir les clés Supabase)." -ForegroundColor Green
}

# 2. Build Next.js
$webDir = Join-Path $root "content-engine-web"
if (-not (Test-Path (Join-Path $webDir "package.json"))) {
    Write-Host "Erreur: content-engine-web/ introuvable." -ForegroundColor Red
    exit 1
}
Push-Location $webDir
try {
    Write-Host "`n[Build] npm run build dans content-engine-web..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    Write-Host "[OK] Build réussi.`n" -ForegroundColor Green
} finally {
    Pop-Location
}

# 3. Rappel déploiement
Write-Host "=== Étapes suivantes ===" -ForegroundColor Cyan
Write-Host "1. Frontend (Vercel):"
Write-Host "   - Importer le repo, Root Directory = content-engine-web"
Write-Host "   - Ajouter NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY"
Write-Host "   - Configurer l'URL de callback Supabase: https://VOTRE_APP.vercel.app/auth/callback"
Write-Host ""
Write-Host "2. Supabase: exécuter supabase/migrations/*.sql si pas déjà fait."
Write-Host ""
Write-Host "3. Worker: déployer worker/ (Python) avec SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY."
Write-Host "   Ex: sur un VPS: python run.py (ou via Docker/cron)."
Write-Host ""
