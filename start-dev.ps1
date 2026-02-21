# Start both backend and frontend servers
# Right-click and choose "Run with PowerShell"

Write-Host "Starting CyberStore Development Environment..." -ForegroundColor Cyan

$backendJob = Start-Process powershell -PassThru -NoNewWindow -ArgumentList {
    cd backend
    npm run dev
}

$frontendJob = Start-Process powershell -PassThru -NoNewWindow -ArgumentList {
    cd frontend
    npm start
}

Write-Host "✓ Backend started (PID: $($backendJob.Id))" -ForegroundColor Green
Write-Host "✓ Frontend started (PID: $($frontendJob.Id))" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Red
