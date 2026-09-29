@echo off
title Cloudflare Tunnel - KKP Sarpras Analytics
echo ========================================================
echo   KKP SARPRAS ANALYTICS - CLOUDFLARE TUNNEL LAUNCHER
echo ========================================================
echo.
echo Pastikan sebelum menjalankan tunnel ini:
echo  1. Laragon (Apache & MySQL) sudah aktif / Start All
echo  2. Vite dev server sudah berjalan (npm run dev di port 5173)
echo.
echo Menghubungkan tunnel ke http://localhost:5173 ...
echo Tunggu beberapa saat, cari URL yang berakhiran:
echo   https://xxxxxxxx.trycloudflare.com
echo.
echo ========================================================
echo.

set "CLOUDFLARED_BIN=C:\laragon\bin\cloudflared\cloudflared.exe"

if exist "%CLOUDFLARED_BIN%" (
    "%CLOUDFLARED_BIN%" tunnel --url http://localhost:5173
) else (
    cloudflared tunnel --url http://localhost:5173
)

pause
