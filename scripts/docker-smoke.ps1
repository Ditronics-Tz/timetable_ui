param(
  [string]$ImageTag = "sacas-ui:smoke"
)

$ErrorActionPreference = "Stop"
$containerName = "sacas-ui-smoke-$PID"
$repoRoot = Split-Path -Parent $PSScriptRoot
Push-Location $repoRoot

try {
  docker build --build-arg VITE_API_URL=http://localhost:8080/api --tag $ImageTag .
  if ($LASTEXITCODE -ne 0) { throw "Docker image build failed." }

  docker run --detach --rm --name $containerName --publish 127.0.0.1::80 $ImageTag | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "Could not start the frontend container." }

  $portMapping = docker port $containerName "80/tcp"
  if ($LASTEXITCODE -ne 0 -or -not $portMapping) { throw "Could not resolve the container's published port." }
  $port = ($portMapping -split ":")[-1]
  $baseUrl = "http://127.0.0.1:$port"

  $ready = $false
  for ($attempt = 0; $attempt -lt 20; $attempt++) {
    try {
      $response = Invoke-WebRequest -Uri "$baseUrl/" -TimeoutSec 2
      if ($response.StatusCode -eq 200) { $ready = $true; break }
    } catch {
      Start-Sleep -Milliseconds 500
    }
  }
  if (-not $ready) { throw "Frontend container did not serve the root page." }

  foreach ($path in @("/", "/rooms/manage")) {
    $response = Invoke-WebRequest -Uri "$baseUrl$path" -TimeoutSec 5
    if ($response.StatusCode -ne 200 -or $response.Content -notmatch '<div id="root"></div>') {
      throw "Expected the SPA entry page at $path, received HTTP $($response.StatusCode)."
    }
    Write-Host "PASS $path -> HTTP $($response.StatusCode), SPA entry page served"
  }
} finally {
  docker stop $containerName 2>$null | Out-Null
  Pop-Location
}
