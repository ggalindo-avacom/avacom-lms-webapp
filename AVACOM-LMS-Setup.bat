@echo off
setlocal EnableExtensions EnableDelayedExpansion

title AVACOM LMS - Windows 11 Setup
cd /d "%~dp0"

echo.
echo ============================================================
echo            AVACOM LMS - WINDOWS 11 INSTALLER
echo ============================================================
echo.
echo This installer requires an Internet connection.
echo It will configure the backend and frontend in this folder.
echo.

if not exist "backend\requirements.txt" (
    echo [ERROR] backend\requirements.txt was not found.
    goto :failed
)
if not exist "backend\manage.py" (
    echo [ERROR] backend\manage.py was not found.
    goto :failed
)
if not exist "frontend\package.json" (
    echo [ERROR] frontend\package.json was not found.
    goto :failed
)

echo [1/9] Checking Python 3.12 or newer...
set "PYTHON_CMD="

where py.exe >nul 2>&1
if not errorlevel 1 (
    py -3 -c "import sys; raise SystemExit(0 if sys.version_info >= (3, 12) else 1)" >nul 2>&1
    if not errorlevel 1 set "PYTHON_CMD=py -3"
)

if not defined PYTHON_CMD (
    where python.exe >nul 2>&1
    if not errorlevel 1 (
        python -c "import sys; raise SystemExit(0 if sys.version_info >= (3, 12) else 1)" >nul 2>&1
        if not errorlevel 1 set "PYTHON_CMD=python"
    )
)

if not defined PYTHON_CMD (
    echo [ERROR] Python 3.12 or newer is required and was not found in PATH.
    echo Download the 64-bit installer from https://www.python.org/downloads/windows/
    echo During installation, enable "Add python.exe to PATH".
    goto :failed
)

%PYTHON_CMD% --version

echo.
echo [2/9] Checking the Python venv module...
%PYTHON_CMD% -c "import venv" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] The Python venv module is unavailable.
    echo Repair or reinstall Python with pip and the standard library enabled.
    goto :failed
)

echo.
echo [3/9] Checking Node.js 20 or newer and npm...
where node.exe >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js was not found in PATH.
    echo Install the 64-bit Node.js 22 LTS release from https://nodejs.org/
    goto :failed
)

for /f "tokens=1 delims=." %%V in ('node -p "process.versions.node"') do set "NODE_MAJOR=%%V"
if not defined NODE_MAJOR (
    echo [ERROR] The Node.js version could not be detected.
    goto :failed
)

if !NODE_MAJOR! LSS 20 (
    echo [ERROR] Node.js 20 or newer is required. Installed version:
    node --version
    echo Install Node.js 22 LTS from https://nodejs.org/
    goto :failed
)

where npm.cmd >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm was not found in PATH. Repair the Node.js installation.
    goto :failed
)

node --version
call npm.cmd --version
if errorlevel 1 (
    echo [ERROR] npm was found but could not run.
    goto :failed
)

echo.
echo [4/9] Creating backend\venv...
if not exist "backend\venv\Scripts\python.exe" (
    %PYTHON_CMD% -m venv "backend\venv"
    if errorlevel 1 (
        echo [ERROR] Could not create backend\venv.
        goto :failed
    )
) else (
    echo Existing virtual environment found. It will be reused.
)

echo.
echo [5/9] Installing backend dependencies...
"backend\venv\Scripts\python.exe" -m pip install --upgrade pip
if errorlevel 1 (
    echo [ERROR] pip could not be upgraded.
    goto :failed
)

"backend\venv\Scripts\python.exe" -m pip install -r "backend\requirements.txt"
if errorlevel 1 (
    echo [ERROR] Backend dependencies could not be installed.
    goto :failed
)

echo.
echo [6/9] Preparing backend environment settings...
if not exist "backend\.env" (
    if exist "backend\.env.example" (
        copy /Y "backend\.env.example" "backend\.env" >nul
        echo Created backend\.env from backend\.env.example.
        echo Wi-Fi networks are configured through the network API.
    ) else (
        echo [WARNING] backend\.env.example was not found. No .env file was created.
    )
) else (
    echo Existing backend\.env preserved.
)

echo.
echo [7/9] Applying database migrations and checking Django...
pushd "backend"
"venv\Scripts\python.exe" manage.py migrate
if errorlevel 1 (
    popd
    echo [ERROR] Django migrations failed.
    goto :failed
)

"venv\Scripts\python.exe" manage.py check
if errorlevel 1 (
    popd
    echo [ERROR] Django reported configuration errors.
    goto :failed
)
popd

echo.
echo [8/9] Installing frontend dependencies...
pushd "frontend"
if exist "package-lock.json" (
    call npm.cmd ci
) else (
    call npm.cmd install
)
if errorlevel 1 (
    popd
    echo [ERROR] Frontend dependencies could not be installed.
    goto :failed
)

echo.
echo [9/9] Building the frontend...
call npm.cmd run build
if errorlevel 1 (
    popd
    echo [ERROR] The frontend production build failed.
    goto :failed
)
popd

echo.
echo ============================================================
echo                  INSTALLATION COMPLETED
echo ============================================================
echo.
echo Next steps:
echo   1. Run networkrules.bat once and approve the UAC prompt.
echo   2. Run run.bat to start Django and Vite.
echo   3. Register Wi-Fi networks through /api/network/wifi-networks/.
echo.
echo Local frontend: http://localhost:5173
echo Local backend:  http://localhost:8000
echo.
pause
exit /b 0

:failed
echo.
echo ============================================================
echo                   INSTALLATION FAILED
echo ============================================================
echo Review the error above, correct the prerequisite, and run
echo AVACOM-LMS-Setup.bat again.
echo.
pause
exit /b 1
