# Create build zip with today's date
# Run: npm run build first, then run this script.
# Or run: npm run build; .\create-build-zip.ps1

$date = Get-Date -Format "yyyy-MM-dd"
$zipName = "build-$date.zip"

if (-not (Test-Path "build")) {
    Write-Host "Running npm run build first..."
    npm run build
}

Write-Host "Creating $zipName from build/ ..."
Compress-Archive -Path "build\*" -DestinationPath $zipName -Force
Write-Host "Done. Created: $zipName"
Get-Item $zipName | Format-List Name, Length, LastWriteTime
