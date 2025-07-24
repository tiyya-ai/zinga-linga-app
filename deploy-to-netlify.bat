@echo off
echo ========================================
echo   Deploying to Netlify via Git
echo ========================================
echo.

echo Step 1: Building your app...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed! Please fix errors first.
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.

echo Step 2: Setting up Git repository...
git init
git add .
git commit -m "Deploy Zinga Linga React App to Netlify"

echo.
echo ✅ Git repository ready!
echo.
echo 📋 Next steps:
echo.
echo 1. Create a new repository on GitHub:
echo    - Go to https://github.com/new
echo    - Name it: zinga-linga-react
echo    - Make it public
echo    - Don't initialize with README
echo.
echo 2. Push your code:
echo    git remote add origin https://github.com/YOURUSERNAME/zinga-linga-react.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. In Netlify dashboard:
echo    - Click "New site from Git"
echo    - Connect GitHub
echo    - Select your repository
echo    - Build command: npm run build
echo    - Publish directory: dist
echo    - Click Deploy!
echo.
echo 🎉 After this setup, every git push will auto-deploy!
echo.
pause