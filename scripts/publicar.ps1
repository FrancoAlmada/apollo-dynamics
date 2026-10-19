<#
.SINOPSIS
  Publica la web: trae lo ultimo de GitHub al clon del VPS. Caddy sirve lo nuevo al instante.

.DESCRIPCION
  Antes de tocar el VPS revisa que aca no quede nada sin commitear ni sin subir: el VPS baja
  de GitHub, asi que lo que no esta subido no se publica (y es facil creer que si).

  Usa el atajo SSH "apollo-vps" (~/.ssh/config). La primera instalacion del clon en el VPS y el
  bloque de Caddy estan en el repo SERVIDOR (EMPEZA-ACA.md).

.EJEMPLO
  .\scripts\publicar.ps1
#>
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot -Parent

function Nativo([scriptblock]$bloque) { $ErrorActionPreference = 'Continue'; & $bloque }

$sucio = Nativo { & git -C $repo status --porcelain }
if ($sucio) { Write-Host 'Hay cambios sin commitear. Commitealos y subilos antes de publicar.' -ForegroundColor Yellow; exit 1 }

Nativo { & git -C $repo fetch -q } | Out-Null
$estado = Nativo { & git -C $repo status -sb } | Select-Object -First 1
if ($estado -match 'ahead') { Write-Host "Hay commits sin subir ($estado). Hace git push primero." -ForegroundColor Yellow; exit 1 }

$local = (Nativo { & git -C $repo rev-parse HEAD }).Trim()
Write-Host "Publicando $($local.Substring(0,7))..." -ForegroundColor Cyan
$salida = Nativo { & ssh -o BatchMode=yes apollo-vps 'cd /opt/apollo/proyectos/apollo-dynamics && git pull -q --ff-only && git rev-parse HEAD' }
if ($LASTEXITCODE -ne 0) { Write-Host "Fallo el pull en el VPS:`n$salida" -ForegroundColor Red; exit 1 }

$remoto = ($salida | Select-Object -Last 1).Trim()
if ($remoto -ne $local) { Write-Host "El VPS quedo en $remoto y aca estas en $local." -ForegroundColor Yellow; exit 1 }
Write-Host "Listo: apollodynamics.tech sirve $($local.Substring(0,7))" -ForegroundColor Green
