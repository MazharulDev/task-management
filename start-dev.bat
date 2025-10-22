@echo off
echo Starting Task Management Development Environment...
echo.

echo Starting Backend Server...
cd task-server
start "Backend Server" cmd /k "npm run dev"
cd ..

timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
cd task-client
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo.
echo Development servers started!
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo.
pause