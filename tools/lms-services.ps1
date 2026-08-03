<#
    Arranque y parada de los servicios del LMS (Django + Vite).

    Pensado para las pantallas tactiles sin teclado: run.bat deja una ventana
    de CONTROL abierta y este script deja un vigilante en segundo plano que
    detiene los dos servidores en cuanto esa ventana se cierra. stop.bat hace
    lo mismo por comando.

        -Action start   Abre las dos ventanas de servicio y el vigilante, espera
                        a que Vite levante y abre el sitio en el navegador.
        -Action stop    Detiene los servicios (por PID, por puerto y por
                        linea de comandos, en ese orden de preferencia).
        -Action watch   Uso interno: espera a que muera la ventana de control
                        indicada en -ControlProcessId y entonces detiene todo.

        -NoBrowser      Arranca los servicios sin abrir el navegador.
#>
[CmdletBinding()]
param(
    [ValidateSet('start', 'stop', 'watch')]
    [string]$Action = 'start',

    [int]$ControlProcessId = 0,

    [switch]$NoBrowser,

    [switch]$Quiet
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$runtimeDirectory = Join-Path $root '.lms-run'
$urlFile = Join-Path $runtimeDirectory 'url.txt'
$services = [ordered]@{
    backend  = @{
        Title       = 'LMS Backend - Django'
        PidFile     = Join-Path $runtimeDirectory 'backend.pid'
        Port        = 8000
        WorkingDir  = Join-Path $root 'backend'
        Command     = 'venv\Scripts\python.exe manage.py runserver 0.0.0.0:8000'
        CommandLine = 'manage\.py\s+runserver'
    }
    frontend = @{
        Title       = 'LMS Frontend - Vite'
        PidFile     = Join-Path $runtimeDirectory 'frontend.pid'
        Port        = 5173
        WorkingDir  = Join-Path $root 'frontend'
        Command     = 'npm.cmd run dev'
        CommandLine = 'run\s+dev'
    }
}

function Write-Line {
    param([string]$Message)

    if (-not $Quiet) {
        Write-Host $Message
    }
}

function Get-ProcessRecord {
    param([int]$ProcessId)

    if ($ProcessId -le 0) {
        return $null
    }

    return Get-CimInstance Win32_Process -Filter "ProcessId=$ProcessId" -ErrorAction SilentlyContinue
}

# Solo se detienen procesos que pertenecen a este proyecto: una consola que
# lanza los servicios, o un ejecutable que vive dentro de esta carpeta. Asi un
# Node o un Python ajeno de la maquina nunca se ve afectado.
function Test-BelongsToProject {
    param($ProcessRecord)

    if (-not $ProcessRecord) {
        return $false
    }

    $commandLine = [string]$ProcessRecord.CommandLine
    $executable = [string]$ProcessRecord.ExecutablePath

    if ($executable -and $executable.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) {
        return $true
    }

    if ($commandLine -and $commandLine -like "*$root*") {
        return $true
    }

    return $false
}

function Test-HasProjectDescendant {
    param([int]$ProcessId, [int]$Depth = 3)

    if ($Depth -le 0) {
        return $false
    }

    $children = Get-CimInstance Win32_Process -Filter "ParentProcessId=$ProcessId" -ErrorAction SilentlyContinue
    foreach ($child in $children) {
        $executable = [string]$child.ExecutablePath
        $commandLine = [string]$child.CommandLine

        if ($executable -and $executable.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) {
            return $true
        }

        if ($commandLine -and $commandLine -like "*$root*") {
            return $true
        }

        if (Test-HasProjectDescendant -ProcessId ([int]$child.ProcessId) -Depth ($Depth - 1)) {
            return $true
        }
    }

    return $false
}

function Test-HasServiceTitle {
    param([int]$ProcessId, [string]$Title)

    $process = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
    return ($process -and $process.MainWindowTitle -and $process.MainWindowTitle.StartsWith($Title, [StringComparison]::OrdinalIgnoreCase))
}

function Get-ServiceTargets {
    param([hashtable]$Service)

    $targets = New-Object System.Collections.Generic.List[int]

    # 1) El PID que se guardo al arrancar: identifica la consola exacta. Basta
    #    con que siga siendo la consola del servicio (protege de un PID reciclado).
    if (Test-Path -LiteralPath $Service.PidFile) {
        $storedId = 0
        if ([int]::TryParse((Get-Content -LiteralPath $Service.PidFile -Raw).Trim(), [ref]$storedId)) {
            $record = Get-ProcessRecord -ProcessId $storedId
            if ($record -and $record.Name -eq 'cmd.exe' -and
                ([string]$record.CommandLine -match $Service.CommandLine -or (Test-BelongsToProject -ProcessRecord $record))) {
                $targets.Add($storedId)
            }
        }
    }

    # 2) Quien tenga tomado el puerto del servicio, solo si el ejecutable o su
    #    linea de comandos viven dentro de esta carpeta.
    $connections = Get-NetTCPConnection -LocalPort $Service.Port -State Listen -ErrorAction SilentlyContinue
    foreach ($owner in @($connections.OwningProcess | Sort-Object -Unique)) {
        $record = Get-ProcessRecord -ProcessId ([int]$owner)
        if ($record -and (Test-BelongsToProject -ProcessRecord $record)) {
            $targets.Add([int]$owner)
        }
    }

    # 3) Consolas que arrancaron el servicio (cubre ventanas de ejecuciones
    #    anteriores, incluso lanzadas por la version previa de run.bat).
    $consoles = Get-CimInstance Win32_Process -Filter "Name='cmd.exe'" -ErrorAction SilentlyContinue
    foreach ($console in $consoles) {
        if ([string]$console.CommandLine -notmatch $Service.CommandLine) {
            continue
        }

        $consoleId = [int]$console.ProcessId
        if ((Test-HasProjectDescendant -ProcessId $consoleId) -or
            (Test-HasServiceTitle -ProcessId $consoleId -Title $Service.Title)) {
            $targets.Add($consoleId)
        }
    }

    return ($targets | Sort-Object -Unique)
}

# Vite no siempre queda en 5173: si el puerto esta ocupado salta al siguiente
# libre. Por eso la URL no se asume, se lee del proceso que npm run dev dejo
# escuchando (la consola del servicio y toda su descendencia).
function Get-DescendantIds {
    param([int]$ProcessId, [int]$Depth = 5)

    $ids = New-Object System.Collections.Generic.List[int]

    if ($Depth -le 0) {
        return $ids
    }

    foreach ($child in (Get-CimInstance Win32_Process -Filter "ParentProcessId=$ProcessId" -ErrorAction SilentlyContinue)) {
        $childId = [int]$child.ProcessId
        $ids.Add($childId)

        foreach ($descendant in (Get-DescendantIds -ProcessId $childId -Depth ($Depth - 1))) {
            $ids.Add($descendant)
        }
    }

    return $ids
}

function Get-ListeningPort {
    param([hashtable]$Service, [int]$ConsoleId)

    $ids = @($ConsoleId) + @(Get-DescendantIds -ProcessId $ConsoleId)
    $listening = @(Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
        Where-Object { $ids -contains [int]$_.OwningProcess })

    if (-not $listening) {
        return 0
    }

    $ports = @($listening.LocalPort | Sort-Object -Unique)

    # Si respeto el puerto configurado se usa ese; si no, el que haya tomado.
    if ($ports -contains $Service.Port) {
        return [int]$Service.Port
    }

    return [int]$ports[0]
}

function Wait-ForListeningPort {
    param([hashtable]$Service, [int]$ConsoleId, [int]$TimeoutSeconds = 90)

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

    while ((Get-Date) -lt $deadline) {
        if (-not (Get-Process -Id $ConsoleId -ErrorAction SilentlyContinue)) {
            return 0
        }

        $port = Get-ListeningPort -Service $Service -ConsoleId $ConsoleId
        if ($port -gt 0) {
            return $port
        }

        Start-Sleep -Milliseconds 700
    }

    return 0
}

# Primero el navegador predeterminado del equipo (el favorito del usuario) y,
# si no hay asociacion, Chrome / Edge / Firefox por su ruta registrada.
function Open-Site {
    param([string]$Url)

    try {
        Start-Process $Url | Out-Null
        return 'navegador predeterminado'
    } catch {
        # Sin asociacion para http: se intenta con un navegador conocido.
    }

    foreach ($browser in @('chrome.exe', 'msedge.exe', 'firefox.exe')) {
        $appPath = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\$browser"
        $executable = (Get-ItemProperty -Path $appPath -ErrorAction SilentlyContinue).'(default)'

        if ($executable -and (Test-Path -LiteralPath $executable)) {
            try {
                Start-Process -FilePath $executable -ArgumentList $Url | Out-Null
                return $browser
            } catch {
                # Se prueba con el siguiente de la lista.
            }
        }
    }

    return $null
}

function Stop-Tree {
    param([int]$ProcessId)

    & "$env:WINDIR\System32\taskkill.exe" /PID $ProcessId /T /F 2>&1 | Out-Null
    return ($LASTEXITCODE -eq 0)
}

function Stop-Services {
    $stopped = 0

    foreach ($name in $services.Keys) {
        $service = $services[$name]

        foreach ($processId in Get-ServiceTargets -Service $service) {
            if (Stop-Tree -ProcessId $processId) {
                $stopped++
                Write-Line ("  detenido {0} (PID {1})" -f $service.Title, $processId)
            }
        }

        if (Test-Path -LiteralPath $service.PidFile) {
            Remove-Item -LiteralPath $service.PidFile -Force -ErrorAction SilentlyContinue
        }
    }

    if ($stopped -eq 0) {
        Write-Line '  no habia servicios del LMS en ejecucion'
    }

    return $stopped
}

function Start-Services {
    if (-not (Test-Path -LiteralPath $runtimeDirectory)) {
        New-Item -ItemType Directory -Path $runtimeDirectory -Force | Out-Null
    }

    if (Test-Path -LiteralPath $urlFile) {
        Remove-Item -LiteralPath $urlFile -Force -ErrorAction SilentlyContinue
    }

    $consoleIds = @{}

    foreach ($name in $services.Keys) {
        $service = $services[$name]
        $arguments = @('/k', ('title {0} & {1}' -f $service.Title, $service.Command))

        $process = Start-Process -FilePath "$env:WINDIR\System32\cmd.exe" `
            -ArgumentList $arguments `
            -WorkingDirectory $service.WorkingDir `
            -PassThru

        $consoleIds[$name] = $process.Id
        Set-Content -LiteralPath $service.PidFile -Value $process.Id -Encoding ASCII
        Write-Line ("  {0} iniciado (PID {1})" -f $service.Title, $process.Id)
    }

    # El vigilante espera a que se cierre la ventana de control (la consola que
    # ejecuto este script) y entonces detiene los dos servicios.
    $controlId = [int](Get-ProcessRecord -ProcessId $PID).ParentProcessId
    if ($controlId -gt 0) {
        Start-Process -FilePath 'powershell.exe' -WindowStyle Hidden -ArgumentList @(
            '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $PSCommandPath,
            '-Action', 'watch', '-ControlProcessId', $controlId, '-Quiet'
        ) | Out-Null
        Write-Line ("  vigilante activo sobre la ventana de control (PID {0})" -f $controlId)
    }

    # Django se espera solo para que la primera carga ya tenga API disponible.
    Write-Line '  esperando a que respondan los servicios...'
    Wait-ForListeningPort -Service $services.backend -ConsoleId $consoleIds.backend -TimeoutSeconds 45 | Out-Null

    $frontendPort = Wait-ForListeningPort -Service $services.frontend -ConsoleId $consoleIds.frontend -TimeoutSeconds 90

    if ($frontendPort -le 0) {
        Write-Line '  [AVISO] Vite no reporto ningun puerto a tiempo. Revisa la ventana del frontend.'
        return
    }

    $url = "http://localhost:$frontendPort/"
    Set-Content -LiteralPath $urlFile -Value $url -Encoding ASCII
    Write-Line ("  frontend escuchando en {0}" -f $url)

    if ($NoBrowser) {
        return
    }

    $browser = Open-Site -Url $url
    if ($browser) {
        Write-Line ("  sitio abierto con {0}" -f $browser)
    } else {
        Write-Line '  [AVISO] No se pudo abrir el navegador automaticamente.'
    }
}

switch ($Action) {
    'start' {
        Start-Services
    }
    'stop' {
        Stop-Services | Out-Null
    }
    'watch' {
        if ($ControlProcessId -gt 0) {
            try {
                Wait-Process -Id $ControlProcessId -ErrorAction Stop
            } catch {
                # La ventana de control ya no existe: se detiene igualmente.
            }
        }

        Stop-Services | Out-Null
    }
}

exit 0
