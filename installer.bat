@echo off
setlocal EnableExtensions

title Instalador LMS
cd /d "%~dp0"

echo.
echo ==================================================
echo             INSTALADOR DEL PROYECTO LMS
echo ==================================================
echo.

if not exist "backend\requirements.txt" (
    call :error "No se encontro backend\requirements.txt."
    goto :failed
)

if not exist "frontend\package.json" (
    call :error "No se encontro frontend\package.json."
    goto :failed
)

echo [1/6] Verificando Python...
set "PYTHON_CMD="
where py >nul 2>&1
if not errorlevel 1 (
    py -3 --version >nul 2>&1
    if not errorlevel 1 set "PYTHON_CMD=py -3"
)

if not defined PYTHON_CMD (
    where python >nul 2>&1
    if not errorlevel 1 (
        python --version >nul 2>&1
        if not errorlevel 1 set "PYTHON_CMD=python"
    )
)

if not defined PYTHON_CMD (
    call :error "Python no esta instalado o no se encuentra en PATH."
    echo Descargalo desde https://www.python.org/downloads/
    goto :failed
)

%PYTHON_CMD% --version

echo.
echo [2/6] Verificando el modulo venv...
%PYTHON_CMD% -c "import venv" >nul 2>&1
if errorlevel 1 (
    call :error "El modulo venv no esta disponible en esta instalacion de Python."
    echo Reinstala Python incluyendo pip y la biblioteca estandar.
    goto :failed
)

echo.
echo [3/6] Verificando npm...
where npm.cmd >nul 2>&1
if errorlevel 1 (
    call :error "npm no esta instalado o no se encuentra en PATH."
    echo Instala Node.js desde https://nodejs.org/
    goto :failed
)

call npm.cmd --version
if errorlevel 1 (
    call :error "npm fue encontrado, pero no pudo ejecutarse."
    goto :failed
)

echo.
echo [4/6] Preparando el entorno virtual backend\venv...
if not exist "backend\venv\Scripts\python.exe" (
    %PYTHON_CMD% -m venv "backend\venv"
    if errorlevel 1 (
        call :error "No fue posible crear el entorno virtual backend\venv."
        goto :failed
    )
) else (
    echo El entorno virtual ya existe. Se utilizara el actual.
)

echo.
echo [5/6] Instalando dependencias de Python...
"backend\venv\Scripts\python.exe" -m pip install --upgrade pip
if errorlevel 1 (
    call :error "No fue posible actualizar pip."
    goto :failed
)

"backend\venv\Scripts\python.exe" -m pip install -r "backend\requirements.txt"
if errorlevel 1 (
    call :error "No fue posible instalar las dependencias del backend."
    goto :failed
)

echo.
echo [6/6] Instalando dependencias del frontend...
pushd "frontend"
call npm.cmd install
set "NPM_EXIT_CODE=%errorlevel%"
popd

if not "%NPM_EXIT_CODE%"=="0" (
    call :error "No fue posible instalar las dependencias del frontend."
    goto :failed
)

echo.
echo ==================================================
echo        INSTALACION COMPLETADA CORRECTAMENTE
echo ==================================================
echo.
echo Entorno virtual: backend\venv
echo Backend: backend\venv\Scripts\python.exe backend\manage.py runserver
echo Frontend: cd frontend ^&^& npm run dev
echo.
pause
exit /b 0

:error
echo.
echo [ERROR] %~1
echo.
exit /b 0

:failed
echo.
echo La instalacion no pudo completarse.
echo Revisa el mensaje anterior, corrige el problema y ejecuta installer.bat nuevamente.
echo.
pause
exit /b 1
