<#
Install repository-local Git hooks by setting core.hooksPath to .githooks
Run from repo root: .\tools\install_git_hooks.ps1
#>

param(
    [switch]$Force
)

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition | Split-Path -Parent
$hooksPath = Join-Path $repoRoot '.githooks'

if (-not (Test-Path $hooksPath)) {
    Write-Error "Hooks directory not found: $hooksPath"
    exit 1
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "git not found on PATH. Install git or run the equivalent command to set core.hooksPath."
    exit 1
}

Write-Output "Setting repo git config core.hooksPath -> .githooks"
git -C $repoRoot config core.hooksPath ".githooks"

Write-Output "Done. To use hooks locally, ensure your Git respects repo config or run:"
Write-Output "  git -C $repoRoot config core.hooksPath .githooks"
