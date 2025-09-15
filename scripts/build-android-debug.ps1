# build-android-debug.ps1
# Automates creating a development/debug APK (includes expo dev client).
# - Requires Bun in PATH (preferred). Falls back to npm only as a last resort.
# - Ensures `expo-dev-client` is present (installs via bun if missing).
# - Verifies Java 17 is available (warns if not).

param()

function Ensure-Java17 {
    $out = & java -version 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) {
        Write-Error "java not found in PATH. Install Java 17 and set JAVA_HOME or add java to PATH."
        exit 2
    }
    if ($out -notmatch 'version \"17') {
        Write-Warning "Detected Java version:`n$out`nThis script expects Java 17. Proceeding may fail."
    }
}

function Ensure-Bun {
    & bun -v > $null 2>&1
    return ($LASTEXITCODE -eq 0)
}

function Ensure-ExpoDevClient {
    $pkgJsonPath = Join-Path $PSScriptRoot '..\package.json' | Resolve-Path -ErrorAction SilentlyContinue
    if (-not $pkgJsonPath) {
        Write-Warning "package.json not found next to script. Skipping expo-dev-client check."
        return
    }
    $pkg = Get-Content $pkgJsonPath.Path -Raw | ConvertFrom-Json
    $has = ($pkg.dependencies -and $pkg.dependencies.'expo-dev-client') -or ($pkg.devDependencies -and $pkg.devDependencies.'expo-dev-client')
    if ($has) { Write-Host "expo-dev-client already present in package.json"; return }

    if (Ensure-Bun) {
        Write-Host "expo-dev-client not found: adding via bun..."
        Push-Location (Join-Path $PSScriptRoot '..')
        try { & bun add expo-dev-client; if ($LASTEXITCODE -ne 0) { throw 'bun add failed' } }
        finally { Pop-Location }
    } else {
        Write-Warning "bun not found. Please install expo-dev-client manually (preferred with bun)."
    }
}

Write-Host "Starting Android debug (dev) APK build..."
Ensure-Java17
Ensure-ExpoDevClient

# Ensure dependencies are installed
if (Ensure-Bun) {
    Write-Host "Running 'bun install' to ensure node modules..."
    Push-Location (Join-Path $PSScriptRoot '..')
    try { & bun install; if ($LASTEXITCODE -ne 0) { Write-Warning 'bun install failed or returned non-zero exit code' } }
    finally { Pop-Location }
} else {
    Write-Warning "bun not available. Skipping 'bun install'. Ensure node_modules are present by running your package manager."
}

$androidDir = Join-Path $PSScriptRoot '..\android' | Resolve-Path -ErrorAction SilentlyContinue
if (-not $androidDir) {
    Write-Error "Could not find android directory relative to script. Expected ../android"
    exit 3
}
$androidDir = $androidDir.Path

Push-Location $androidDir
try {
    Write-Host "Running Gradle wrapper: assembleDebug"
    # Use community autolinking to avoid picking up expo-dev-menu mocks as RN modules
    $env:EXPO_USE_COMMUNITY_AUTOLINKING = '1'
    & .\gradlew.bat clean assembleDebug --no-daemon
    if ($LASTEXITCODE -ne 0) { throw "Gradle build failed with exit code $LASTEXITCODE" }

    # Look for debug APK(s)
    $apkDir = Join-Path $androidDir 'app\build\outputs\apk\debug'
    if (Test-Path $apkDir) {
        $apks = Get-ChildItem -Path $apkDir -Filter '*.apk' -File -ErrorAction SilentlyContinue
        if ($apks -and $apks.Count -gt 0) {
            Write-Host "Debug APK(s) created:"
            $apks | ForEach-Object { Write-Host " - $($_.FullName)" }
        } else {
            Write-Warning "No APKs found under $apkDir. Check build outputs under app/build/outputs/apk/"
        }
    } else {
        Write-Warning "APK output directory not found: $apkDir"
    }
}
finally { Pop-Location }

Write-Host "Debug build script finished."
