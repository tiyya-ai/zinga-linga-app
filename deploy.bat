@echo off
echo ========================================
echo    ZINGA LINGA REACT APP DEPLOYMENT
echo ========================================
echo.

echo Checking Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python not found!
    echo Please install Python from: https://python.org
    echo.
    pause
    exit /b 1
)

echo ✅ Python found
echo.

echo Starting deployment script...
echo.

python simple_deploy.py

echo.
echo Deployment script completed.
pause