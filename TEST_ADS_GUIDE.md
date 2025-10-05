# Real Test Ads Setup ✅

Your app is now configured to use **real Google test ads** in EAS builds!

## Current Setup

### ✅ What's Configured:
- `react-native-google-mobile-ads` package installed
- Real AdMob test ads enabled in `src/services/adService.js`
- AdMob SDK initialization in `App.js`
- Test App IDs configured in `app.json`
- Coin economy fully integrated

### 📁 Files Structure:
```
src/services/
├── adService.js           ← ACTIVE (Real test ads)
├── adService.real.js      ← Backup (Real test ads)
└── adService.simulated.js ← Backup (Simulated ads)
```

## How It Works

### In Expo Go (Development):
⚠️ **Real ads won't work** - Expo Go doesn't support native modules
- You'll see errors when trying to watch ads
- Use simulated ads for Expo Go development

### In EAS Builds (Preview/Production):
✅ **Real test ads work perfectly!**
- Google video ads load and play
- Full ad experience (can skip after 5 seconds)
- Coins awarded after watching
- Automatic ad preloading

## Building with Real Test Ads

### Quick Build Command:
```bash
eas build --platform android --profile preview
```

This will:
1. Build APK with AdMob integrated (~15 mins)
2. Download link provided when done
3. Install APK on Android device
4. Real Google test ads will show!

### What You'll See:
1. Play games until coins < 100
2. Click "Watch Ad"
3. **Real Google video ad loads** (Test Ad label)
4. Watch ad or skip after 5 seconds
5. Get 50 coins if watched completely
6. Next ad preloads automatically

## Test Ad Behavior

### Google Test Ads Show:
- ✅ Real video content
- ✅ "Test Ad" label at top
- ✅ Skip button after 5 seconds
- ✅ Close button (X)
- ✅ Reward tracking

### What Happens:
- **Watch completely** → Earn 50 coins ✅
- **Close early** → No coins, "Ad Closed" message ⚠️
- **Ad fails to load** → Error message ❌

## Switching Between Ad Types

### Use Real Test Ads (for EAS builds):
**Windows:**
```bash
scripts\use-real-ads.bat
```

**Mac/Linux:**
```bash
cp src/services/adService.real.js src/services/adService.js
```

### Use Simulated Ads (for Expo Go):
**Windows:**
```bash
scripts\use-simulated-ads.bat
```

**Mac/Linux:**
```bash
cp src/services/adService.simulated.js src/services/adService.js
```

## Testing Checklist

### Before Building:
- [ ] Verify `app.json` has test App IDs
- [ ] Check `adService.js` is using real implementation
- [ ] Ensure internet connection available

### After Installing APK:
- [ ] Open app, check console for "AdMob initialized"
- [ ] Play games until coins < 100
- [ ] Try "Watch Ad" button
- [ ] Verify real video ad loads
- [ ] Watch ad completely
- [ ] Confirm 50 coins awarded
- [ ] Check balance updated

## Troubleshooting

### "Ad not loaded yet" Error
- Wait 10-30 seconds after app launch
- Check internet connection
- Check console logs for "Test ad loaded"

### Ad Loads But No Coins
- Make sure you watched completely (not closed early)
- Check Firebase connection
- Look for "User earned reward" in console

### "RNGoogleMobileAdsModule" Error
- You're in Expo Go (use simulated ads)
- Or build with EAS instead

## Console Logs to Look For

### Successful Flow:
```
✅ AdMob initialized
📺 Initializing AdMob with test ads...
✅ Test ad loaded and ready to show
📺 Showing test ad...
✅ User earned reward: { amount: 1, type: '' }
Ad closed. Reward earned: true
📺 Preloading next ad...
```

### Failed Flow:
```
❌ Test ad failed to load: [error details]
```

## When to Switch to Real Ads

Keep using **test ads** until:
- ✅ App is fully tested
- ✅ Ready to publish to Play Store
- ✅ Created AdMob account
- ✅ Got real Ad Unit IDs

Then update `adService.js`:
```javascript
const AD_UNIT_IDS = {
  rewardedVideo: __DEV__
    ? TestIds.REWARDED        // Keep test ads in dev
    : 'ca-app-pub-REAL-ID',   // Your real ad unit ID
};
```

## Build Commands Reference

### Preview Build (Quick Testing):
```bash
eas build --platform android --profile preview
```
- Creates APK file
- Faster build
- For internal testing

### Production Build (Play Store):
```bash
eas build --platform android --profile production
```
- Optimized APK
- For app store submission

### Check Build Status:
```bash
eas build:list
```

### View Build Logs:
```bash
eas build:view [build-id]
```

## Current Configuration

### Test App IDs (in app.json):
```json
"androidAppId": "ca-app-pub-3940256099942544~3347511713"
"iosAppId": "ca-app-pub-3940256099942544~1458002511"
```

### Test Ad Unit (in adService.js):
```javascript
TestIds.REWARDED  // Google's test rewarded video ID
```

These are **official Google test IDs** - safe to use!

## Next Steps

1. **Build Preview APK:**
   ```bash
   eas build --platform android --profile preview
   ```

2. **Install on Device:**
   - Download APK from build link
   - Install on Android device
   - Open app

3. **Test Ads:**
   - Play until low on coins
   - Watch test ads
   - Verify coins awarded

4. **Later - Get Real Ads:**
   - Create AdMob account
   - Get real ad unit IDs
   - Update configuration
   - Rebuild

---

**Status:** ✅ Ready to build with real test ads!

**Next Command:**
```bash
eas build --platform android --profile preview
```

🎉 Your app will show real Google test video ads in the EAS build!
