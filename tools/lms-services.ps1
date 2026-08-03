<#
    Arranque y parada de los servicios del LMS (Django + Vite).

    Pensado para las pantallas tactiles sin teclado: run.bat deja una ventana
    de CONTROL abierta y este script deja un vigilante en segundo plano que
    detiene los dos servidores en cuanto esa ventana se cierra. stop.bat hace
    lo mismo por comando.

        -Action start   Abre las dos ventanas de servicio y el vigilante.
        -Action stop    Detiene los servicios (por PID, por puerto y por
                        linea de comandos, en ese orden de preferencia).
        -Action watch   Uso interno: espera a que muera la ventana de control
                        indicada en -ControlProcessId y entonces detiene todo.
#>
[CmdletBinding()]
param(
    [ValidateSet('start', 'stop', 'watch')]
    [string]$Action = 'start',

    [int]$ControlProcessId = 0,

    [switch]$Quiet
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$runtimeDirectory = Join-Path $root '.lms-run'
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

    foreach ($name in $services.Keys) {
        $service = $services[$name]
        $arguments = @('/k', ('title {0} & {1}' -f $service.Title, $service.Command))

        $process = Start-Process -FilePath "$env:WINDIR\System32\cmd.exe" `
            -ArgumentList $arguments `
            -WorkingDirectory $service.WorkingDir `
            -PassThru

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
