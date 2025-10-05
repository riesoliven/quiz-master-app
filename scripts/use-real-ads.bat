@echo off
echo Switching to REAL test ads (for EAS builds)...
copy /Y src\services\adService.real.js src\services\adService.js
echo Done! Real test ads are now active.
echo.
echo Note: This will only work in EAS builds, not Expo Go.
echo Run: eas build --platform android --profile preview
