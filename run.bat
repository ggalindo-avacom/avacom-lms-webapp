@echo off
setlocal EnableExtensions

title Iniciar LMS
cd /d "%~dp0"

echo.
echo ==================================================
echo              INICIANDO PROYECTO LMS
echo ==================================================
echo.

if not exist "backend\venv\Scripts\activate.bat" (
    echo [ERROR] No se encontro el entorno virtual backend\venv.
    echo Ejecuta installer.bat antes de iniciar el proyecto.
    echo.
    pause
    exit /b 1
)

if not exist "backend\venv\Scripts\python.exe" (
    echo [ERROR] El entorno virtual backend\venv no contiene Python.
    echo Ejecuta installer.bat nuevamente.
    echo.
    pause
    exit /b 1
)

if not exist "backend\manage.py" (
    echo [ERROR] No se encontro backend\manage.py.
    echo.
    pause
    exit /b 1
)

where npm.cmd >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm no esta instalado o no se encuentra en PATH.
    echo Instala Node.js y ejecuta installer.bat nuevamente.
    echo.
    pause
    exit /b 1
)

if not exist "frontend\package.json" (
    echo [ERROR] No se encontro frontend\package.json.
    echo.
    pause
    exit /b 1
)

if not exist "frontend\node_modules" (
    echo [ERROR] No se encontraron las dependencias del frontend.
    echo Ejecuta installer.bat antes de iniciar el proyecto.
    echo.
    pause
    exit /b 1
)

if not exist "tools\lms-services.ps1" (
    echo [ERROR] No se encontro tools\lms-services.ps1.
    echo.
    pause
    exit /b 1
)

title LMS - CONTROL
echo Iniciando backend en http://0.0.0.0:8000 y frontend en http://0.0.0.0:5173 ...
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "tools\lms-services.ps1" -Action start
if errorlevel 1 (
    echo.
    echo [ERROR] No fue posible iniciar los servicios.
    echo.
    pause
    exit /b 1
)

set "FRONTEND_URL=http://localhost:5173/"
if exist ".lms-run\url.txt" set /p FRONTEND_URL=<".lms-run\url.txt"

echo.
echo ==================================================
echo          SERVICIOS INICIADOS EN DOS VENTANAS
echo ==================================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: %FRONTEND_URL%
echo.
echo ==================================================
echo   PARA DETENER TODO, CUALQUIERA DE LAS DOS OPCIONES:
echo.
echo     1. Cierra ESTA ventana con la X de la esquina.
echo     2. Ejecuta stop.bat con doble toque.
echo ==================================================
echo.
echo Esta ventana debe permanecer abierta mientras el LMS este en uso.
echo.

:control
timeout /t 3600 /nobreak >nul
goto control
