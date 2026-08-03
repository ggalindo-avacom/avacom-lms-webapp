<#
    Deja Python y Node listos para el instalador del LMS.

    Pensado para equipos tactiles sin teclado: si falta alguno de los dos, se
    instala solo (winget primero, instalador oficial silencioso como respaldo)
    y devuelve las rutas absolutas al .bat que lo llamo, porque el PATH de una
    consola ya abierta no se refresca despues de instalar.

        -OutputFile  Archivo .cmd que se genera con PYTHON_CMD / NPM_CMD /
                     NODE_EXE para que el .bat lo consuma con "call".
        -DryRun      Diagnostico: informa que instalaria, sin instalar nada.
        -Elevated    Uso interno: marca la pasada que corre como administrador.
#>
[CmdletBinding()]
param(
    [string]$OutputFile,
    [switch]$DryRun,
    [switch]$Elevated
)

$ErrorActionPreference = 'Stop'

# --- Version requerida -------------------------------------------------------
# Node: winget ya no publica manifiestos de la 22.x, su canal LTS entrega 24.x.
# Se pide 22 como minimo (es lo que exige Vite) y se instala el LTS vigente.
$requiredPython = [version]'3.12'
$requiredNodeMajor = 22
$pythonWingetId = 'Python.Python.3.12'
$nodeWingetId = 'OpenJS.NodeJS.LTS'
$pythonFallbackVersion = '3.12.10'
$pythonFallbackUrl = "https://www.python.org/ftp/python/$pythonFallbackVersion/python-$pythonFallbackVersion-amd64.exe"
$nodeFallbackIndex = 'https://nodejs.org/dist/index.json'

function Write-Step {
    param([string]$Message)
    Write-Host $Message
}

function Test-IsAdministrator {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    return (New-Object Security.Principal.WindowsPrincipal($identity)).IsInRole(
        [Security.Principal.WindowsBuiltInRole]::Administrator)
}

# El PATH del proceso actual se quedo con la foto de antes de instalar, asi que
# las busquedas tambien miran el PATH del registro y las rutas tipicas.
function Get-SearchDirectories {
    $directories = New-Object System.Collections.Generic.List[string]

    foreach ($entry in ($env:Path -split ';')) {
        if ($entry) { $directories.Add($entry.Trim()) }
    }

    $registryPaths = @(
        (Get-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Environment' -Name Path -ErrorAction SilentlyContinue).Path,
        (Get-ItemProperty -Path 'HKCU:\Environment' -Name Path -ErrorAction SilentlyContinue).Path
    )

    foreach ($registryPath in $registryPaths) {
        if (-not $registryPath) { continue }
        foreach ($entry in ($registryPath -split ';')) {
            if ($entry) { $directories.Add([Environment]::ExpandEnvironmentVariables($entry.Trim())) }
        }
    }

    return ($directories | Where-Object { $_ } | Sort-Object -Unique)
}

function Get-PythonCandidates {
    $candidates = New-Object System.Collections.Generic.List[string]

    # El lanzador py sabe cual es la instalacion buena aunque no este en PATH.
    $launcher = Get-Command 'py.exe' -ErrorAction SilentlyContinue
    if ($launcher) {
        try {
            $reported = & $launcher.Source -3 -c 'import sys; print(sys.executable)' 2>$null
            if ($LASTEXITCODE -eq 0 -and $reported) { $candidates.Add($reported.Trim()) }
        } catch {
            # Sin instalacion 3.x registrada en el lanzador.
        }
    }

    foreach ($directory in Get-SearchDirectories) {
        # El alias de la Microsoft Store no es un Python usable: abre la tienda.
        if ($directory -like '*\Microsoft\WindowsApps*') { continue }
        $candidate = Join-Path $directory 'python.exe'
        if (Test-Path -LiteralPath $candidate) { $candidates.Add($candidate) }
    }

    $wellKnown = @(
        (Join-Path $env:LOCALAPPDATA 'Programs\Python'),
        $env:ProgramFiles,
        'C:\'
    )

    foreach ($base in $wellKnown) {
        if (-not $base -or -not (Test-Path -LiteralPath $base)) { continue }
        Get-ChildItem -LiteralPath $base -Filter 'Python3*' -Directory -ErrorAction SilentlyContinue |
            ForEach-Object {
                $candidate = Join-Path $_.FullName 'python.exe'
                if (Test-Path -LiteralPath $candidate) { $candidates.Add($candidate) }
            }
    }

    return ($candidates | Sort-Object -Unique)
}

function Get-PythonVersion {
    param([string]$Executable)

    try {
        # Sin comillas dobles dentro del codigo: al invocar un exe nativo,
        # PowerShell 5.1 las elimina del argumento y Python recibe codigo roto.
        $reported = & $Executable -c "import sys; print('%d.%d.%d' % sys.version_info[:3])" 2>$null
        if ($LASTEXITCODE -ne 0 -or -not $reported) { return $null }
        return [version]"$reported".Trim()
    } catch {
        return $null
    }
}

function Test-PythonVenv {
    param([string]$Executable)

    & $Executable -c 'import venv' 2>$null | Out-Null
    return ($LASTEXITCODE -eq 0)
}

function Find-Python {
    foreach ($candidate in Get-PythonCandidates) {
        $version = Get-PythonVersion -Executable $candidate
        if ($version -and $version -ge $requiredPython -and (Test-PythonVenv -Executable $candidate)) {
            return [pscustomobject]@{ Path = $candidate; Version = $version }
        }
    }

    return $null
}

function Get-NodeCandidates {
    $candidates = New-Object System.Collections.Generic.List[string]

    foreach ($directory in Get-SearchDirectories) {
        $candidate = Join-Path $directory 'node.exe'
        if (Test-Path -LiteralPath $candidate) { $candidates.Add($candidate) }
    }

    $wellKnown = @(
        (Join-Path $env:ProgramFiles 'nodejs\node.exe'),
        (Join-Path ${env:ProgramFiles(x86)} 'nodejs\node.exe'),
        (Join-Path $env:LOCALAPPDATA 'Programs\nodejs\node.exe')
    )

    foreach ($candidate in $wellKnown) {
        if ($candidate -and (Test-Path -LiteralPath $candidate)) { $candidates.Add($candidate) }
    }

    return ($candidates | Sort-Object -Unique)
}

function Find-Node {
    foreach ($candidate in Get-NodeCandidates) {
        try {
            $reported = & $candidate -p 'process.versions.node' 2>$null
        } catch {
            continue
        }

        if ($LASTEXITCODE -ne 0 -or -not $reported) { continue }

        $major = 0
        if (-not [int]::TryParse(($reported.Trim() -split '\.')[0], [ref]$major)) { continue }
        if ($major -lt $requiredNodeMajor) { continue }

        # npm.cmd vive junto a node.exe y lo invoca por ruta relativa, asi que
        # funciona aunque el PATH todavia no conozca la instalacion.
        $npm = Join-Path (Split-Path -Parent $candidate) 'npm.cmd'
        if (-not (Test-Path -LiteralPath $npm)) { continue }

        return [pscustomobject]@{ Path = $candidate; Npm = $npm; Version = $reported.Trim() }
    }

    return $null
}

function Test-WingetAvailable {
    return [bool](Get-Command 'winget.exe' -ErrorAction SilentlyContinue)
}

function Install-WithWinget {
    param([string]$PackageId, [string]$Scope)

    $arguments = @(
        'install', '--id', $PackageId, '--exact',
        '--source', 'winget',
        '--accept-package-agreements', '--accept-source-agreements',
        '--disable-interactivity'
    )

    if ($Scope) { $arguments += @('--scope', $Scope) }

    Write-Step ("      winget {0}" -f ($arguments -join ' '))

    if ($DryRun) {
        Write-Step '      (-DryRun: no se ejecuta)'
        return $true
    }

    & winget.exe @arguments 2>&1 | ForEach-Object { Write-Step "      $_" }

    # 0 = instalado. -1978335189 = ya estaba al dia. El veredicto real lo da la
    # deteccion posterior, aqui solo se registra el resultado.
    return ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq -1978335189)
}

function Invoke-SilentInstaller {
    param([string]$Url, [string]$FileName, [string]$FilePath, [string[]]$Arguments)

    $target = Join-Path $env:TEMP $FileName
    Write-Step ("      descargando {0}" -f $Url)

    if ($DryRun) {
        Write-Step '      (-DryRun: no se descarga ni se instala)'
        return $true
    }

    $previousProgress = $ProgressPreference
    $ProgressPreference = 'SilentlyContinue'
    try {
        Invoke-WebRequest -Uri $Url -OutFile $target -UseBasicParsing
    } catch {
        Write-Step ("      [ERROR] no se pudo descargar: {0}" -f $_.Exception.Message)
        return $false
    } finally {
        $ProgressPreference = $previousProgress
    }

    $executable = if ($FilePath) { $FilePath } else { $target }
    $argumentList = if ($FilePath) { @($Arguments | ForEach-Object { $_ -replace '__INSTALLER__', $target }) } else { $Arguments }

    Write-Step ("      instalando en silencio: {0} {1}" -f $executable, ($argumentList -join ' '))
    $process = Start-Process -FilePath $executable -ArgumentList $argumentList -Wait -PassThru
    Remove-Item -LiteralPath $target -Force -ErrorAction SilentlyContinue

    return ($process.ExitCode -eq 0 -or $process.ExitCode -eq 3010)
}

function Install-Python {
    Write-Step '   Instalando Python...'

    if (Test-WingetAvailable) {
        # Ambito de usuario: no necesita permisos de administrador.
        if (Install-WithWinget -PackageId $pythonWingetId -Scope 'user') { return $true }
        Write-Step '      winget fallo, se intenta con el instalador oficial'
    } else {
        Write-Step '      winget no esta disponible, se usa el instalador oficial'
    }

    return Invoke-SilentInstaller -Url $pythonFallbackUrl -FileName 'avacom-python-setup.exe' -Arguments @(
        '/quiet', 'InstallAllUsers=0', 'PrependPath=1', 'Include_pip=1', 'Include_launcher=1'
    )
}

function Get-NodeFallbackUrl {
    $index = Invoke-RestMethod -Uri $nodeFallbackIndex -UseBasicParsing
    $release = $index |
        Where-Object { $_.lts -and ([int](($_.version.TrimStart('v') -split '\.')[0]) -ge $requiredNodeMajor) } |
        Select-Object -First 1

    if (-not $release) { return $null }

    $version = $release.version
    return "https://nodejs.org/dist/$version/node-$version-x64.msi"
}

function Install-Node {
    Write-Step '   Instalando Node.js...'

    if (Test-WingetAvailable) {
        if (Install-WithWinget -PackageId $nodeWingetId) { return $true }
        Write-Step '      winget fallo, se intenta con el MSI oficial'
    } else {
        Write-Step '      winget no esta disponible, se usa el MSI oficial'
    }

    $url = if ($DryRun) { 'https://nodejs.org/dist/<LTS>/node-<LTS>-x64.msi' } else { Get-NodeFallbackUrl }
    if (-not $url) {
        Write-Step '      [ERROR] no se pudo resolver la version LTS de Node.'
        return $false
    }

    return Invoke-SilentInstaller -Url $url -FileName 'avacom-node-setup.msi' `
        -FilePath "$env:WINDIR\System32\msiexec.exe" `
        -Arguments @('/i', '__INSTALLER__', '/qn', '/norestart')
}

function Request-Elevation {
    param([string[]]$Missing)

    Write-Step ''
    Write-Step ("   Se necesita permiso de administrador para instalar: {0}" -f ($Missing -join ', '))
    Write-Step '   Acepta el aviso de Windows que aparecera en pantalla.'
    Write-Step ''

    $arguments = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $PSCommandPath, '-Elevated')
    if ($DryRun) { $arguments += '-DryRun' }

    try {
        $process = Start-Process -FilePath 'powershell.exe' -Verb RunAs -Wait -PassThru -ArgumentList $arguments
        return ($process.ExitCode -eq 0)
    } catch {
        Write-Step '   [ERROR] no se acepto el aviso de administrador.'
        return $false
    }
}

# --- Flujo principal ---------------------------------------------------------
Write-Step '   Buscando Python y Node.js en este equipo...'

$python = Find-Python
$node = Find-Node

if ($python) { Write-Step ("   Python {0} encontrado en {1}" -f $python.Version, $python.Path) }
if ($node) { Write-Step ("   Node.js v{0} encontrado en {1}" -f $node.Version, $node.Path) }

if (-not $python -or -not $node) {
    $missing = @()
    if (-not $python) { $missing += "Python $requiredPython o superior" }
    if (-not $node) { $missing += "Node.js $requiredNodeMajor o superior" }

    Write-Step ("   Falta por instalar: {0}" -f ($missing -join ', '))

    # Python se instala por usuario y no pide permisos; Node usa un MSI de
    # maquina, asi que solo por el se solicita la elevacion.
    if (-not $node -and -not (Test-IsAdministrator) -and -not $Elevated) {
        if (-not (Request-Elevation -Missing $missing)) {
            Write-Step '   [ERROR] la instalacion automatica no pudo completarse.'
            exit 1
        }
    } else {
        if (-not $python) { Install-Python | Out-Null }
        if (-not $node) { Install-Node | Out-Null }
    }

    if ($Elevated) {
        # La pasada elevada solo instala; la deteccion final la hace el padre.
        exit 0
    }

    if ($DryRun) {
        Write-Step '   (-DryRun: no se vuelve a buscar, no se instalo nada)'
        exit 0
    }

    Write-Step '   Verificando la instalacion...'
    if (-not $python) { $python = Find-Python }
    if (-not $node) { $node = Find-Node }
}

if (-not $python) {
    Write-Step ''
    Write-Step "   [ERROR] no fue posible dejar instalado Python $requiredPython o superior."
    Write-Step '   Descargalo manualmente desde https://www.python.org/downloads/windows/'
    exit 1
}

if (-not $node) {
    Write-Step ''
    Write-Step "   [ERROR] no fue posible dejar instalado Node.js $requiredNodeMajor o superior."
    Write-Step '   Descargalo manualmente desde https://nodejs.org/'
    exit 1
}

Write-Step ("   Listo: Python {0} y Node.js v{1}" -f $python.Version, $node.Version)

if ($OutputFile) {
    $directory = Split-Path -Parent $OutputFile
    if ($directory -and -not (Test-Path -LiteralPath $directory)) {
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
    }

    # El .bat consume esto con "call": rutas absolutas, porque su PATH todavia
    # no conoce lo que se acaba de instalar.
    @(
        ('set "PYTHON_CMD={0}"' -f $python.Path),
        ('set "NODE_EXE={0}"' -f $node.Path),
        ('set "NPM_CMD={0}"' -f $node.Npm)
    ) | Set-Content -LiteralPath $OutputFile -Encoding ASCII
}

exit 0
