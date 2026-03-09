$ErrorActionPreference = "Stop"

$projectRoot = "C:\Users\lewow\Documents\Workspace\Testavimas\1task"
$reportsDir = Join-Path $projectRoot "reports"

if (!(Test-Path $reportsDir)) {
    New-Item -ItemType Directory -Path $reportsDir | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$logFile = Join-Path $reportsDir "scheduled-ui-$timestamp.log"
$xmlFile = Join-Path $reportsDir "scheduled-ui-$timestamp.xml"

Set-Location $projectRoot

"[$(Get-Date)] Scheduled Playwright suite started" | Out-File -FilePath $logFile -Encoding utf8

$env:CI = "true"

$npxCmd = "npx"
$testArgs = @(
    "playwright",
    "test",
    "tests/1task",
    "--reporter=line,junit"
)

& $npxCmd $testArgs 2>&1 | Tee-Object -FilePath $logFile -Append

if (Test-Path "$projectRoot\reports\junit-results.xml") {
    Copy-Item "$projectRoot\reports\junit-results.xml" $xmlFile -Force
}

"[$(Get-Date)] Scheduled Playwright suite finished" | Out-File -FilePath $logFile -Append -Encoding utf8