# filepath: L:\worxpace\arc_ecosystem\scripts\run-audit-and-append.ps1
param(
  [string]$AuditFile = ".assistant\audit-290825.md",
  [string]$RepoRoot = "."
)

Set-StrictMode -Version Latest
Push-Location $RepoRoot

$timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:sszzz")
$header = "### Automated verification results - $timestamp" + [Environment]::NewLine

function Invoke-Command {
  param($name, $command, $arguments)
  Write-Output ([Environment]::NewLine + "--- $name ---" + [Environment]::NewLine)
  try {
    if ($arguments) {
      $fullCommand = "$command $arguments"
      $out = & cmd.exe /c $fullCommand 2>&1
    } else {
      $out = & $command 2>&1
    }
    $out = $out | Out-String
  } catch {
    $out = "ERROR running $command $arguments : $_"
  }
  return $out
}

# 1) Install deps
$results = ""
$results += "## Automated Audit Run`nTimestamp: $timestamp`n`n"

$results += "### Environment`n"
$results += "Node version:" + [Environment]::NewLine + (Invoke-Command "node" "-v") + [Environment]::NewLine
$results += "Npm version:" + [Environment]::NewLine + (Invoke-Command "npm" "-v") + [Environment]::NewLine

# 2) npm ci
$results += "### npm ci`n"
$results += Invoke-Command "npm ci" "cmd.exe" "/c npm ci"

# 3) Compile & tests
$results += "### Hardhat compile`n"
$results += Invoke-Command "npx hardhat compile" "cmd.exe" "/c npx hardhat compile"

$results += "### Hardhat tests (fast)`n"
$results += Invoke-Command "npx hardhat test --no-compile" "cmd.exe" "/c npx hardhat test --no-compile"

# 4) Coverage (best-effort)
$results += "### Coverage (hardhat-coverage)`n"
$results += Invoke-Command "npx hardhat coverage" "cmd.exe" "/c npx hardhat coverage"

# 5) Slither (Docker)
$results += "### Slither (docker)`n"
$slitherCmd = "docker run --rm -v ${PWD}:/src trailofbits/slither slither /src"
try {
  $results += Invoke-Command "slither" "cmd.exe" "/c $slitherCmd"
} catch {
  $results += "Slither run failed or Docker not available: $_`n"
}

# 6) Foundry/forge (if present)
$results += "### Foundry/forge test (if available)`n"
$results += Invoke-Command "forge test" "cmd.exe" "/c forge test"

# 7) Grep for placeholders (0x0 addresses)
$results += "### Placeholder address scan" + [Environment]::NewLine
$results += Invoke-Command "search 0x0000000000000000000000000000000000000000" "cmd.exe" "/c findstr /S /I /C:""0x00000000"" . ; if ($LASTEXITCODE -ne 0) { echo 'none' }"

# 8) Summarize quick checks
$results += [Environment]::NewLine + "### Quick manual checks" + [Environment]::NewLine
$results += "- ProxyAdmin owner: (Please confirm in deployment script or on-chain)\n"
$results += "- Timelock admin: (Please confirm multisig or timelock governance)\n"
$results += "- Bridge nonces/relayer ACL: (Check contracts/infrastructure/ARCBridge.sol)\n"

# Append to audit file
$appendBlock = "`n`n<!-- Automated verification results start -->`n" + $header + "```\n" + $results + "```\n<!-- Automated verification results end -->`n"

Add-Content -Path $AuditFile -Value $appendBlock -Encoding UTF8

Write-Output "Appended automated results to $AuditFile"
Pop-Location