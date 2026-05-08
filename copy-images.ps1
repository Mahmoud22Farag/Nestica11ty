param(
  [string]$DotNetWwwroot = "C:\Path\To\NesticaWeb.Web\wwwroot"
)

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$ProductTarget = Join-Path $ProjectRoot "src\assets\images\products"
$CategoryTarget = Join-Path $ProjectRoot "src\assets\images\categories"

New-Item -ItemType Directory -Force -Path $ProductTarget | Out-Null
New-Item -ItemType Directory -Force -Path $CategoryTarget | Out-Null

Copy-Item -Path (Join-Path $DotNetWwwroot "images\products\*") -Destination $ProductTarget -Recurse -Force
Copy-Item -Path (Join-Path $DotNetWwwroot "images\Categories\*") -Destination $CategoryTarget -Recurse -Force
Copy-Item -Path (Join-Path $DotNetWwwroot "images\default-product.jpeg") -Destination $ProductTarget -Force -ErrorAction SilentlyContinue
Copy-Item -Path (Join-Path $DotNetWwwroot "images\default-category.jpeg") -Destination $CategoryTarget -Force -ErrorAction SilentlyContinue

Write-Host "Images copied successfully."
