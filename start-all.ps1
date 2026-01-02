# Running Text - Start All Services (PowerShell Version)
# Script ini akan membuka VLC (2 instance) dan Node.js server secara bersamaan

Write-Host ""
Write-Host "========================================"
Write-Host "  Running Text - Startup Script (PS)" -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""

# Cek Node.js
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js ditemukan: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js tidak terinstall atau tidak ditemukan" -ForegroundColor Red
    Write-Host "Silakan install dari https://nodejs.org/"
    Read-Host "Tekan Enter untuk keluar"
    exit 1
}

# Cek VLC
$vlcPath = "C:\Program Files (x86)\VideoLAN\VLC\vlc.exe"
if (-not (Test-Path $vlcPath)) {
    Write-Host "[ERROR] VLC tidak ditemukan di: $vlcPath" -ForegroundColor Red
    Write-Host "Pastikan VLC sudah terinstall dengan benar"
    Read-Host "Tekan Enter untuk keluar"
    exit 1
}
Write-Host "[OK] VLC ditemukan" -ForegroundColor Green

Write-Host ""
Write-Host "[1/3] Memulai VLC untuk CCTV (port 8080)..." -ForegroundColor Yellow
Start-Process -FilePath $vlcPath `
    -ArgumentList '--http-port=8080', `
                  '--playlist-autostart', `
                  'nataru_2025.xspf', `
                  '--run-time=30', `
                  '--directx-device=DISPLAY2', `
                  '--fullscreen', `
                  '--loop', `
                  '--video-on-top' `
    -WindowStyle Normal

Start-Sleep -Seconds 2

Write-Host "[2/3] Memulai VLC untuk Musik (port 8081)..." -ForegroundColor Yellow
Start-Process -FilePath $vlcPath `
    -ArgumentList '--http-port=8081', '--playlist-autostart', 'Gending\lagu.xspf' `
    -WindowStyle Normal

Start-Sleep -Seconds 2

Write-Host "[3/3] Memulai Node.js Server..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" `
    -ArgumentList '/k', 'node server.js' `
    -WorkingDirectory (Get-Location)

Write-Host ""
Write-Host "========================================"
Write-Host "  Semua service sudah dijalankan!" -ForegroundColor Green
Write-Host "========================================"
Write-Host ""
Write-Host "Akses di browser:"
Write-Host "  - CCTV Display: http://localhost:3000/cctvName" -ForegroundColor Cyan
Write-Host "  - Musik Display: http://localhost:3000/musicName" -ForegroundColor Cyan
Write-Host ""
Read-Host "Tekan Enter untuk menutup window ini"
