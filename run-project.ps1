# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Cyan
npm install

# Start the development server
Write-Host ""
Write-Host "Starting Eve Helper..." -ForegroundColor Green
Write-Host "The application will be available at http://localhost:4200" -ForegroundColor Yellow
ng serve --host 0.0.0.0
