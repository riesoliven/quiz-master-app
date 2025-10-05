# Automatic Ad Switching ✨

Your app now **automatically** uses the right ads based on the environment!

## How It Works

### 🔍 Auto-Detection:
The app detects whether it's running in **Expo Go** or **EAS Build** and uses the appropriate ad implementation.

### 📺 In Expo Go (`npm start`):
```
✅ Uses SIMULATED ads
✅ 2-second delay
✅ No native module errors
✅ Perfect for development
```

**Console shows:**
```
📺 Running in Expo Go - using simulated ads
📺 Using simulated ads (Expo Go mode)
📺 Showing simulated ad (Expo Go)...
✅ Simulated ad completed
```

### 🚀 In EAS Builds (`eas build`):
```
✅ Uses REAL Google test ads
✅ Actual video content
✅ Full ad experience
✅ Test ads (safe for development)
```

**Console shows:**
```
✅ AdMob initialized (EAS Build)
📺 Initializing real AdMob test ads...
✅ Real test ad loaded and ready
📺 Showing real test ad...
✅ User earned reward
```

## No More Manual Switching! 🎉

### Before (Manual):
```bash
# Had to manually copy files
cp src/services/adService.real.js src/services/adService.js      # For EAS
cp src/services/adService.simulated.js src/services/adService.js # For Expo Go
```

### Now (Automatic):
```bash
# Just run normally - it figures it out!
npm start              # → Simulated ads
eas build --platform android --profile preview  # → Real test ads
```

## What Was Changed

### `src/services/adService.js`:
- Detects environment: `const isExpoGo = !global.nativeCallSyncHook`
- Conditionally imports AdMob (fails gracefully in Expo Go)
- Uses simulated ads if AdMob unavailable
- Uses real ads if AdMob available

### `App.js`:
- Only initializes AdMob in EAS builds
- Skips initialization in Expo Go
- Logs which mode is active

### `MainMenuScreen.js`:
- Simplified ad handling
- No manual checks needed
- Works in both environments

## Testing

### Test in Expo Go:
```bash
npm start
```

**Expected behavior:**
1. App launches normally
2. Console: "Running in Expo Go - using simulated ads"
3. Watch ad → 2 second delay
4. Get 50 coins ✅

### Test in EAS Build:
```bash
eas build --platform android --profile preview
```

**Expected behavior:**
1. Build completes (~15 mins)
2. Install APK on device
3. Console: "AdMob initialized (EAS Build)"
4. Watch ad → Real Google video ad
5. Get 50 coins after watching ✅

## Benefits

✅ **No manual file switching**
✅ **Works in both environments**
✅ **No errors in Expo Go**
✅ **Real ads in builds**
✅ **Same codebase**
✅ **Automatic detection**

## Console Logs Reference

### Expo Go:
```
📺 Running in Expo Go - using simulated ads
📺 Using simulated ads (Expo Go mode)
📺 Showing simulated ad (Expo Go)...
✅ Simulated ad completed
```

### EAS Build:
```
✅ AdMob initialized (EAS Build): {...}
📺 Initializing real AdMob test ads...
✅ Real test ad loaded and ready
📺 Showing real test ad...
✅ User earned reward: { amount: 1, type: '' }
Ad closed. Reward earned: true
📺 Preloading next ad...
```

## Production Ready

When ready for production with real ads:

1. Create AdMob account
2. Get your real Ad Unit ID
3. Update `src/services/adService.js`:
   ```javascript
   const AD_UNIT_IDS = {
     rewardedVideo: __DEV__
       ? TestIds?.REWARDED  // Test ads in dev
       : 'ca-app-pub-YOUR-REAL-ID/XXXXXXXXXX', // Production ads
   };
   ```
4. Build production APK
5. Real ads show to users!

## Quick Commands

```bash
# Development with simulated ads
npm start

# Preview build with real test ads
eas build --platform android --profile preview

# Production build with real ads (after updating Ad Unit ID)
eas build --platform android --profile production
```

---

**Status:** ✅ Automatic ad switching active!

**No more manual file copying needed - just run and it works!** 🎉
