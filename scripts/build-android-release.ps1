# build-android-release.ps1
# Creates an Android release APK using the Gradle wrapper.
# Requirements: Java 17 installed and available via JAVA_HOME or in PATH.

param()

function Ensure-Java17 {
    $javaver = & java -version 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) {
        Write-Error "java not found in PATH. Ensure Java 17 is installed and JAVA_HOME is set."
        exit 2
    }
    if ($javaver -notmatch 'version "17') {
        Write-Warning "Detected Java version:`n$javaver`nThis script expects Java 17. Proceeding may fail."
    }
}

Write-Host "Starting Android release build (Gradle + Java 17)..."
Ensure-Java17

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$androidDir = Join-Path $scriptDir '..\android' | Resolve-Path -ErrorAction SilentlyContinue
if (-not $androidDir) {
    Write-Error "Could not find android directory relative to script. Expected ../android"
    exit 3
}
$androidDir = $androidDir.Path

Push-Location $androidDir
try {
    Write-Host "Running Gradle wrapper: assembleRelease"
    & .\gradlew.bat clean assembleRelease --no-daemon
    if ($LASTEXITCODE -ne 0) { throw "Gradle build failed with exit code $LASTEXITCODE" }

    $apkPath = Join-Path $androidDir 'app\build\outputs\apk\release\app-release.apk'
    if (Test-Path $apkPath) {
        Write-Host "Release APK created: $apkPath"
    } else {
        Write-Warning "Build completed but expected APK not found at $apkPath. Check Gradle outputs under app/build/outputs/apk/"
    }
}
finally { Pop-Location }

Write-Host "Release build script finished."
