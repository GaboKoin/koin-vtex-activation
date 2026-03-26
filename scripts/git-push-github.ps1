# Ejecutar desde la raíz del repo:  powershell -ExecutionPolicy Bypass -File scripts/git-push-github.ps1
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "==> git init" -ForegroundColor Cyan
git init

Write-Host "==> git add ." -ForegroundColor Cyan
git add .

Write-Host "==> git commit" -ForegroundColor Cyan
git commit -m "feat: koin onboarding portal v2"

Write-Host "==> git branch -M main" -ForegroundColor Cyan
git branch -M main

Write-Host "==> git remote" -ForegroundColor Cyan
git remote remove origin 2>$null
if ($LASTEXITCODE -ne 0) { $null } # ignorar si no existía
git remote add origin https://github.com/GaboKoin/koin-vtex-activation.git 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "origin ya existe, set-url" -ForegroundColor Yellow
  git remote set-url origin https://github.com/GaboKoin/koin-vtex-activation.git
}

Write-Host "==> git push -u origin main" -ForegroundColor Cyan
git push -u origin main

Write-Host "==> Listo. Verificá en GitHub: https://github.com/GaboKoin/koin-vtex-activation" -ForegroundColor Green
