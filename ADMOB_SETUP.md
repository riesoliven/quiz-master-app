# AdMob Integration Guide

## Current Status ⚠️
**Simulated Ads for Development** - Real ads require building custom dev client or production APK

### Why Simulated?
Expo Go doesn't support native modules like `react-native-google-mobile-ads`. You have two options:
1. **Keep simulated ads** for development (current setup) ✅
2. **Build custom dev client** to test real ads (requires more setup)

## What's Implemented

### 1. Coin Economy System
- **Game Cost:** 100 coins per game
- **Ad Reward:** 50 coins per ad watched
- **Score Reward:** Score ÷ 10 = coins earned
- **Starting Balance:** 500 coins (5 free games)

### 2. Simulated Ads (Current Setup)
Currently using **simulated ads** for Expo Go development:
- 2-second delay simulates ad watching
- Fully functional coin economy
- No AdMob account needed for development
- Switch to real ads when building production APK

### 3. Files Modified
- `src/services/adService.js` - Simulated ad logic (ready to replace with real ads)
- `src/services/coinService.js` - Coin transaction handling
- `src/screens/MainMenuScreen.js` - Ad triggering & coin checking
- `src/screens/ResultsScreen.js` - Coin rewards after quiz

## Testing the Simulated Ads

### How to Test:
1. Run the app: `npm start`
2. Play games until coins < 100
3. Try to play → "Insufficient Coins" alert
4. Click "Watch Ad"
5. Click "OK" on the "Watching Ad..." dialog
6. Wait 2 seconds (simulated ad viewing)
7. Receive 50 coins 🪙

### Expected Behavior:
- Shows "Watching Ad..." dialog (simulated)
- 2-second delay mimics ad viewing
- Coins awarded immediately after
- Balance updates in real-time
- All coin economy features work perfectly

## Production Setup (When Ready to Publish)

### Step 1: Create AdMob Account
1. Go to https://admob.google.com
2. Sign up with Google account
3. Accept terms & conditions

### Step 2: Register Your App
1. Click "Apps" → "Add App"
2. Select platform (Android/iOS)
3. Add app details:
   - App name: Quiz Master
   - Platform: Android/iOS
   - Package name: `com.quizmasterapp` (Android)
   - Bundle ID: `com.quizmasterapp` (iOS)

### Step 3: Create Ad Units
1. Select your app → "Ad units"
2. Click "Add ad unit"
3. Select "Rewarded"
4. Configure:
   - Ad unit name: "Coin Reward Video"
   - Settings: Default
5. Copy the Ad Unit ID (e.g., `ca-app-pub-1234567890123456/9876543210`)

### Step 4: Install AdMob SDK
```bash
npm install react-native-google-mobile-ads
npx expo prebuild
```

### Step 5: Replace adService.js with Real Implementation

Create `src/services/adService.real.js`:

```javascript
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

const AD_UNIT_IDS = {
  rewardedVideo: __DEV__
    ? TestIds.REWARDED
    : 'ca-app-pub-YOUR_AD_UNIT_ID', // Your production ad unit ID
};

let rewardedAd = null;
let isAdLoaded = false;

export const initializeRewardedAd = () => {
  rewardedAd = RewardedAd.createForAdRequest(AD_UNIT_IDS.rewardedVideo);

  const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
    isAdLoaded = true;
  });

  rewardedAd.load();

  return () => {
    unsubscribeLoaded();
  };
};

export const showRewardedAd = () => {
  return new Promise((resolve, reject) => {
    if (!rewardedAd || !isAdLoaded) {
      reject(new Error('Ad not loaded yet'));
      return;
    }

    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        unsubscribeEarned();
        resolve(true);
      }
    );

    rewardedAd.show().catch(reject);
  });
};

export const isRewardedAdReady = () => isAdLoaded;
```

Then rename files:
```bash
mv src/services/adService.js src/services/adService.simulated.js
mv src/services/adService.real.js src/services/adService.js
```

### Step 6: Update app.json with AdMob IDs
```json
"plugins": [
  [
    "react-native-google-mobile-ads",
    {
      "androidAppId": "ca-app-pub-XXXXX~XXXXX", // Your Android App ID
      "iosAppId": "ca-app-pub-XXXXX~XXXXX"      // Your iOS App ID
    }
  ]
]
```

### Step 7: Build & Test Production Ads
1. Build production version
2. Use test devices (add device ID in AdMob console)
3. Verify ads load correctly
4. Check earnings in AdMob dashboard

## Troubleshooting

### Ad Not Loading
- Check internet connection
- Verify AdMob SDK initialized (check console logs)
- Wait 10-30 seconds after app launch
- Test ads may have limited fill rate

### Ad Shows But No Coins
- Check console for errors
- Verify `awardCoinsForAd()` is called
- Check Firebase connection
- Ensure `refreshUserProfile()` is working

### Production Ads Not Showing
- Verify ad unit IDs are correct
- Check AdMob account is approved
- Ensure app is published/in testing
- Add test device ID in AdMob console

## Revenue Optimization (Future)

### Best Practices:
1. **Ad Frequency:**
   - Current: Unlimited (user can watch multiple ads)
   - Recommended: Add cooldown (e.g., max 5 ads per hour)

2. **Reward Amount:**
   - Current: 50 coins = 0.5 games
   - Consider: 100 coins = 1 free game

3. **Ad Placement:**
   - ✅ When out of coins (currently implemented)
   - Consider: Optional ad for 2x score multiplier
   - Consider: Daily bonus ad (watch for extra rewards)

4. **User Experience:**
   - Don't force ads
   - Always make them optional
   - Provide alternative (in-app purchases)

## Next Steps

### Current (Development):
- ✅ Test ads working
- ✅ Coin economy functional
- ✅ Reward system complete

### Before Launch:
- [ ] Create AdMob account
- [ ] Register app
- [ ] Get production ad unit IDs
- [ ] Update configuration
- [ ] Test on real devices
- [ ] Monitor ad performance

### Future Features:
- [ ] Ad cooldown system
- [ ] Daily ad bonus
- [ ] In-app purchases (remove ads, buy coins)
- [ ] Interstitial ads (between games)
- [ ] Banner ads (on menu screen)

## Support

- AdMob Docs: https://developers.google.com/admob
- React Native Google Mobile Ads: https://docs.page/invertase/react-native-google-mobile-ads
- AdMob Support: https://support.google.com/admob

---

**Status:** ✅ Ready for Testing
**Environment:** Development (Test Ads)
**Next Action:** Test ad flow, then create AdMob account when ready for production
