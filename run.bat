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

echo Iniciando backend en http://0.0.0.0:8000 ...
start "LMS Backend - Django" /D "%~dp0backend" cmd.exe /k "call venv\Scripts\activate.bat && python manage.py runserver 0.0.0.0:8000"

if errorlevel 1 (
    echo [ERROR] No fue posible abrir la consola del backend.
    pause
    exit /b 1
)

echo Iniciando frontend en http://0.0.0.0:5173 ...
start "LMS Frontend - Vite" /D "%~dp0frontend" cmd.exe /k "npm.cmd run dev"

if errorlevel 1 (
    echo [ERROR] No fue posible abrir la consola del frontend.
    pause
    exit /b 1
)

echo.
echo ==================================================
echo          SERVICIOS INICIADOS EN DOS VENTANAS
echo ==================================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Para detener los servicios, cierra sus respectivas ventanas.
echo.
timeout /t 4 >nul
exit /b 0
