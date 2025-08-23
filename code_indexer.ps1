<#
PowerShell wrapper to run the Python code indexer.
Usage: .\code_indexer.ps1
This will call the script in tools\code_indexer.py and generate reports/index_raw.md and CODEBASE_OVERVIEW.md
#>

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$toolsScript = Join-Path $scriptDir "tools\code_indexer.py"

if (-not (Test-Path $toolsScript)) {
    Write-Output "Indexer script not found at $toolsScript. Skipping."
    exit 0
}

# Find python
$py = Get-Command python -ErrorAction SilentlyContinue
if (-not $py) { $py = Get-Command python3 -ErrorAction SilentlyContinue }
if (-not $py) {
    Write-Output "Python not found on PATH. Skipping indexer."
    exit 0
}

& $py.Source $toolsScript

if ($LASTEXITCODE -ne 0) {
    Write-Output "Indexer failed with exit code $LASTEXITCODE. Continuing (not blocking)."
    exit 0
}

Write-Output "Indexing complete. Reports written to 'reports' and CODEBASE_OVERVIEW.md at repo root."
