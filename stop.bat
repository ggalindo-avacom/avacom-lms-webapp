@echo off
setlocal EnableExtensions

title Detener LMS
cd /d "%~dp0"

echo.
echo ==================================================
echo              DETENIENDO PROYECTO LMS
echo ==================================================
echo.

if not exist "tools\lms-services.ps1" (
    echo [ERROR] No se encontro tools\lms-services.ps1.
    echo.
    timeout /t 6 /nobreak >nul
    exit /b 1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "tools\lms-services.ps1" -Action stop
if errorlevel 1 (
    echo.
    echo [ERROR] No fue posible detener los servicios.
    echo.
    timeout /t 8 /nobreak >nul
    exit /b 1
)

echo.
echo Backend y frontend detenidos. Ya puedes cerrar la ventana de CONTROL.
echo.
timeout /t 5 /nobreak >nul
exit /b 0
