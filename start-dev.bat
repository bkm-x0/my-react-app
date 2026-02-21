@echo off
REM Start backend and frontend together
REM This script runs both services in separate terminal windows

echo Starting CyberStore Development Environment...

REM Start backend in a new window
start "CyberStore Backend" cmd /k "cd backend && npm run dev"

REM Start frontend in a new window
start "CyberStore Frontend" cmd /k "cd frontend && npm start"

echo Both services are starting in separate windows!
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
