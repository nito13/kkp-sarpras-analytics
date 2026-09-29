@echo off
title Cloudflare Tunnel - Laragon Apache (Port 80)
echo ========================================================
echo   KKP SARPRAS ANALYTICS - CLOUDFLARE TUNNEL (LARAGON 80)
echo ========================================================
echo.
echo Menghubungkan tunnel langsung ke Laragon (http://localhost:80) ...
echo Tunggu beberapa saat, cari URL yang berakhiran:
echo   https://xxxxxxxx.trycloudflare.com
echo.
echo Anda dapat mengakses aplikasi di:
echo   https://xxxxxxxx.trycloudflare.com/kkp-sarpras-analytics
echo ========================================================
echo.

set "CLOUDFLARED_BIN=C:\laragon\bin\cloudflared\cloudflared.exe"

if exist "%CLOUDFLARED_BIN%" (
    "%CLOUDFLARED_BIN%" tunnel --url http://localhost:80
) else (
    cloudflared tunnel --url http://localhost:80
)

pause
