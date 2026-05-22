@echo off
REM Assetify Project Quick Start for Windows

echo.
echo ========================================
echo   ASSETIFY PROJECT QUICK START
echo ========================================
echo.

echo Navigating to backend...
cd backend

echo.
echo Checking if node_modules exists...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
) else (
    echo Dependencies already installed
)

echo.
echo Seeding database with initial data...
call npm run seed

echo.
echo ========================================
echo   SETUP COMPLETE - NEXT STEPS
echo ========================================
echo.
echo 1. START BACKEND (Terminal 1):
echo    cd backend
echo    npm run dev
echo.
echo 2. START FRONTEND (Terminal 2):
echo    cd frontend
echo    npm run dev
echo.
echo 3. OPEN BROWSER:
echo    http://localhost:5173
echo.
echo API ENDPOINTS:
echo    Backend:  http://localhost:5000
echo    Frontend: http://localhost:5173
echo.
echo DOCUMENTATION:
echo    Read SETUP_GUIDE.md for complete instructions
echo.
pause
