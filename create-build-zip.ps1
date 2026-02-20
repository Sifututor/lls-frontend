# Create build zip with today's date (LATEST build only)
# Run: npm run build first, then run this script.
# Or: npm run build:zip (build + zip in one go)

$date = Get-Date -Format "yyyy-MM-dd"
$zipName = "learnest-build-$date.zip"

if (-not (Test-Path "build")) {
    Write-Host "No build folder. Run: npm run build" -ForegroundColor Red
    exit 1
}

Write-Host "Creating $zipName from build/ (LATEST files) ..." -ForegroundColor Cyan
Compress-Archive -Path "build\*" -DestinationPath $zipName -Force
Write-Host "Done. Created: $zipName" -ForegroundColor Green
Get-Item $zipName | Format-List Name, Length, LastWriteTime
Write-Host ""
Write-Host "=== cPanel upload ===" -ForegroundColor Yellow
Write-Host "1. Upload this zip to public_html"
Write-Host "2. Extract and choose OVERWRITE / Replace ALL so index.html and asset-manifest.json get updated."
Write-Host "3. If you skip overwrite, index.html will stay OLD and app will show old version."
Write-Host ""
