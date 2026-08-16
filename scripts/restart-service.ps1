# DeepSeek Harness service restart script (ASCII only)
# 5 steps: detect port -> force kill -> start service (npx -> bare dsh -> abs fallback) -> poll verify -> report
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File restart-service.ps1 -Port 3080 -RepoRoot "D:\...\workspace" -NpxExe "npx" -NodeExe "node" -BinPath "C:\...\lib\bin.js" -LogFile "D:\...\restart.log" -SvcLog "D:\...\restart-service"
param(
  [int]$Port = 3080,
  [string]$RepoRoot = '',
  [string]$NpxExe = '',
  [string]$NodeExe = '',
  [string]$BinPath = '',
  [string]$LogFile = '',
  [string]$SvcLog = '',
  [string]$LaunchLog = ''
)
$ErrorActionPreference = 'Continue'

function Log($m) {
  if ($LogFile) {
    try { Add-Content -Path $LogFile -Value ("[restart " + (Get-Date -Format 'HH:mm:ss') + "] " + $m) -Encoding UTF8 } catch { }
  }
  if ($LaunchLog) {
    try { Add-Content -Path $LaunchLog -Value ("[restart " + (Get-Date -Format 'HH:mm:ss') + "] " + $m) -Encoding UTF8 } catch { }
  }
}
function Get-PortPid {
  foreach ($l in (netstat -ano)) {
    if ($l -match (":$Port\s+\S+\s+LISTENING\s+(\d+)")) { return [int]$matches[1] }
  }
  return 0
}
function Test-Service {
  try {
    $r = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/" -UseBasicParsing -TimeoutSec 4
    return ($r.StatusCode -eq 200 -and $r.Content.Contains('__DSH_BOOT__'))
  } catch { return $false }
}
function Launch-Svc($inner, $name) {
  # service stdout/stderr land in files (Start-Process-level redirect, no cmd quoting involved)
  $out = $SvcLog + '.out.log'
  $err = $SvcLog + '.err.log'
  Start-Process -FilePath 'cmd.exe' -ArgumentList @('/d', '/s', '/c', $inner) -WindowStyle Hidden -WorkingDirectory $RepoRoot -RedirectStandardOutput $out -RedirectStandardError $err | Out-Null
  Log "$name launched: $inner (cwd $RepoRoot, out $out)"
}
function Wait-Svc($seconds) {
  $ok = $false
  $t0 = Get-Date
  while ((Get-Date) - $t0 -lt [timespan]::FromSeconds($seconds)) {
    Start-Sleep -Seconds 2
    if (Test-Service) { $ok = $true; break }
  }
  return $ok
}
function Kill-Leftovers {
  $still = Get-PortPid
  if ($still) { taskkill /pid $still /T /F | Out-Null; Start-Sleep -Seconds 2 }
}

if (-not $RepoRoot) {
  $RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
}
if (-not $NpxExe) { $NpxExe = 'npx' }
if (-not $NodeExe) { $NodeExe = 'node' }
if (-not $SvcLog) { $SvcLog = $LogFile + '.service' }
if (-not $BinPath) {
  Log "FAILED: no BinPath provided"
  Write-Output "FAILED"
  exit 1
}

Log "=== restart start (port $Port, repo $RepoRoot) ==="

# 1) detect
$portPid = Get-PortPid
Log ("1. detect: " + $(if ($portPid) { "pid $portPid" } else { "port free" }))

# 2) force kill + wait until port is really free
if ($portPid) {
  Log "2. kill pid $portPid"
  taskkill /pid $portPid /T /F | Out-Null
  Start-Sleep -Seconds 2
  $guard = 0
  while ($guard -lt 5) {
    $still = Get-PortPid
    if (-not $still) { break }
    Log "   still held by pid $still, kill again"
    taskkill /pid $still /T /F | Out-Null
    Start-Sleep -Seconds 2
    $guard++
  }
  if (Get-PortPid) {
    Log "FAILED: cannot free port $Port"
    Write-Output "FAILED"
    exit 1
  }
  Log "2. port $Port freed"
} else {
  Log "2. nothing to kill"
}

# 3) start: primary = npx --yes dsh web (exact same as the proven launcher script;
#    --yes prevents npx from hanging on an interactive prompt in the hidden console)
$innerNpx = $NpxExe + ' --yes dsh web --host 127.0.0.1 --port ' + $Port
Launch-Svc $innerNpx "3. npx"
if (Wait-Svc 90) {
  Log "4. OK: service listening on http://127.0.0.1:$Port (npx)"
  Write-Output "OK"
  exit 0
}

# 3b) bare dsh (workspace node_modules\.bin is on PATH) - same as typing "dsh web" in the workspace folder
Log "3b. npx path failed within 90s, trying bare dsh"
Kill-Leftovers
$innerDsh = 'dsh web --host 127.0.0.1 --port ' + $Port
Launch-Svc $innerDsh "3b. dsh"
if (Wait-Svc 30) {
  Log "4. OK: service listening on http://127.0.0.1:$Port (bare dsh)"
  Write-Output "OK"
  exit 0
}

# 3c) absolute node + dsh bin fallback
Log "3c. bare dsh failed within 20s, trying absolute node+bin fallback"
Kill-Leftovers
$nodeQ = '"' + $NodeExe + '"'
$binQ = '"' + $BinPath + '"'
# 最外层再包一对引号：cmd /d /s /c 会剥掉首尾这对，内部带空格的路径引号得以保留
$innerAbs = '"' + $nodeQ + ' ' + $binQ + ' web --host 127.0.0.1 --port ' + $Port + '"'
Launch-Svc $innerAbs "3c. abs"
if (Wait-Svc 90) {
  Log "4. OK: service listening on http://127.0.0.1:$Port (abs fallback)"
  Write-Output "OK"
  exit 0
}

# 5) report
Log "4. FAILED: service did not start on port $Port (npx / dsh / abs all failed; see $SvcLog.out.log)"
Write-Output "FAILED"
exit 1
