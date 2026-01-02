@echo off
REM Running Text - Start All Services
REM Script ini akan membuka VLC (2 instance) dan Node.js server secara bersamaan

echo.
echo ========================================
echo   Running Text - Startup Script
echo ========================================
echo.

REM Cek apakah Node.js sudah terinstall
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js tidak terinstall atau tidak ditemukan di PATH
    echo Silakan install Node.js dari https://nodejs.org/
    pause
    exit /b 1
)

REM Cek apakah VLC terinstall
if not exist "C:\Program Files (x86)\VideoLAN\VLC\vlc.exe" (
    echo [ERROR] VLC tidak ditemukan di path default
    echo Pastikan VLC terinstall di: C:\Program Files ^(x86^)\VideoLAN\VLC\
    pause
    exit /b 1
)

set VLC_PATH=C:\Program Files (x86)\VideoLAN\VLC\vlc.exe

echo [1/3] Memulai VLC untuk CCTV (port 8080)...
start "VLC - CCTV (port 8080)" "%VLC_PATH%" --http-port=8080 --playlist-autostart nataru_2025.xspf --run-time=30 --directx-device=DISPLAY2 --fullscreen --loop --video-on-top

timeout /t 2 /nobreak

echo [2/3] Memulai VLC untuk Musik (port 8081)...
start "VLC - Musik (port 8081)" "%VLC_PATH%" --http-port=8081 --playlist-autostart Gending\lagu.xspf

timeout /t 2 /nobreak

echo [3/3] Memulai Node.js Server...
start "Node.js Server" cmd /k node server.js

echo.
echo ========================================
echo   Semua service sudah dijalankan!
echo ========================================
echo.
echo Akses di browser:
echo   - CCTV Display: http://localhost:3000/cctvName
echo   - Musik Display: http://localhost:3000/musicName
echo.
timeout /t 3 /nobreak
