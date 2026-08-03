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

if not exist "tools\ensure-prerequisites.ps1" (
    echo [ERROR] tools\ensure-prerequisites.ps1 was not found.
    goto :failed
)

echo [1/9] Checking Python 3.12+ and Node.js 22+ ^(auto-install if missing^)...
set "PREREQ_FILE=%TEMP%\avacom-lms-prereqs.cmd"
if exist "%PREREQ_FILE%" del /f /q "%PREREQ_FILE%" >nul 2>&1

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "tools\ensure-prerequisites.ps1" -OutputFile "%PREREQ_FILE%"
if errorlevel 1 (
    echo [ERROR] Python and Node.js could not be verified or installed.
    goto :failed
)

if not exist "%PREREQ_FILE%" (
    echo [ERROR] The prerequisite check did not report the tool locations.
    goto :failed
)

rem Absolute paths written by ensure-prerequisites.ps1: PYTHON_CMD, NODE_EXE
rem and NPM_CMD. They work even when PATH does not yet know a fresh install.
call "%PREREQ_FILE%"
del /f /q "%PREREQ_FILE%" >nul 2>&1

if not defined PYTHON_CMD (
    echo [ERROR] The Python location was not reported.
    goto :failed
)
if not defined NPM_CMD (
    echo [ERROR] The npm location was not reported.
    goto :failed
)

echo.
echo [2/9] Confirming the detected tools run correctly...
"%PYTHON_CMD%" --version
if errorlevel 1 (
    echo [ERROR] Python was found but could not run.
    goto :failed
)

echo.
echo [3/9] Confirming Node.js and npm...
"%NODE_EXE%" --version
if errorlevel 1 (
    echo [ERROR] Node.js was found but could not run.
    goto :failed
)

call "%NPM_CMD%" --version
if errorlevel 1 (
    echo [ERROR] npm was found but could not run.
    goto :failed
)

echo.
echo [4/9] Creating backend\venv...
if not exist "backend\venv\Scripts\python.exe" (
    "%PYTHON_CMD%" -m venv "backend\venv"
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
    call "%NPM_CMD%" ci
) else (
    call "%NPM_CMD%" install
)
if errorlevel 1 (
    popd
    echo [ERROR] Frontend dependencies could not be installed.
    goto :failed
)

echo.
echo [9/9] Building the frontend...
call "%NPM_CMD%" run build
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
