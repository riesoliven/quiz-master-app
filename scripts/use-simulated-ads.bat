@echo off
echo Switching to SIMULATED ads (for Expo Go)...
copy /Y src\services\adService.simulated.js src\services\adService.js
echo Done! Simulated ads are now active.
echo.
echo Note: Use this for development in Expo Go.
echo Run: npm start
