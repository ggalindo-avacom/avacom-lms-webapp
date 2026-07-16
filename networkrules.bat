@echo off
setlocal EnableExtensions

title Configuracion de red LMS
cd /d "%~dp0"

fltmc >nul 2>&1
if errorlevel 1 (
    echo Solicitando permisos de administrador...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    if errorlevel 1 (
        echo.
        echo [ERROR] No fue posible solicitar permisos de administrador.
        pause
        exit /b 1
    )
    exit /b 0
)

echo.
echo ==================================================
echo          CONFIGURACION DE RED DEL LMS
echo ==================================================
echo.
echo Se habilitaran las conexiones TCP entrantes para:
echo   Backend:  puerto 8000
echo   Frontend: puerto 5173
echo.

call :create_rule "LMS Backend - Puerto 8000" "8000"
if errorlevel 1 goto :failed

call :create_rule "LMS Frontend - Puerto 5173" "5173"
if errorlevel 1 goto :failed

echo.
echo ==================================================
echo       REGLAS CONFIGURADAS CORRECTAMENTE
echo ==================================================
echo.
echo Backend disponible en:
echo   http://IP-DE-ESTE-EQUIPO:8000
echo.
echo Frontend disponible en:
echo   http://IP-DE-ESTE-EQUIPO:5173
echo.
echo Recuerda iniciar Django escuchando en todas las interfaces:
echo   backend\venv\Scripts\python.exe backend\manage.py runserver 0.0.0.0:8000
echo.
pause
exit /b 0

:create_rule
set "RULE_NAME=%~1"
set "RULE_PORT=%~2"

echo Configurando %RULE_NAME%...

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
    "$rule = Get-NetFirewallRule -DisplayName '%RULE_NAME%' -ErrorAction SilentlyContinue; " ^
    "if ($rule) { " ^
    "  $rule | Set-NetFirewallRule -Enabled True -Direction Inbound -Action Allow -Profile Any; " ^
    "  $rule | Get-NetFirewallPortFilter | Set-NetFirewallPortFilter -Protocol TCP -LocalPort %RULE_PORT%; " ^
    "} else { " ^
    "  New-NetFirewallRule -DisplayName '%RULE_NAME%' -Direction Inbound -Protocol TCP -LocalPort %RULE_PORT% -Action Allow -Profile Any | Out-Null; " ^
    "}"

if errorlevel 1 (
    echo [ERROR] No fue posible configurar %RULE_NAME%.
    exit /b 1
)

echo [OK] Puerto %RULE_PORT% habilitado.
exit /b 0

:failed
echo.
echo La configuracion de red no pudo completarse.
echo Comprueba que aceptaste la solicitud de permisos de administrador.
echo.
pause
exit /b 1
