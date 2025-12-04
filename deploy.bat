@echo off
echo ========================================
echo   NUSANTARAGO DEPLOYMENT SCRIPT
echo   Target: nusantarago.id
echo ========================================
echo.

REM Check if dist folder exists
if not exist "dist" (
    echo [ERROR] dist folder not found!
    echo Run: npm run build
    exit /b 1
)

echo [STEP 1] Building for production...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed!
    exit /b 1
)
echo [SUCCESS] Build completed!
echo.

echo [STEP 2] Deploying to Netlify...
echo.
echo IMPORTANT: You need to login first!
echo Run: netlify login
echo.
echo After login, run this script again or run:
echo netlify deploy --prod --dir=dist
echo.

pause
