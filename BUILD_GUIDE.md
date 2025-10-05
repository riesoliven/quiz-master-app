# Production Build Guide - EAS Build with AdMob

This guide walks you through building your Quiz Master app for production with real AdMob ads.

## Prerequisites

### 1. Create Expo Account
- Go to https://expo.dev
- Sign up for free account
- Remember your username

### 2. Install EAS CLI
```bash
npm install -g eas-cli
```

### 3. Login to Expo
```bash
eas login
```
Enter your Expo credentials.

## Step-by-Step Build Process

### Step 1: Initialize EAS Project

```bash
eas build:configure
```

This will:
- Create `eas.json` (already done ✅)
- Link your project to Expo
- Generate a project ID

**Update `app.json`:** Replace `"owner": "your-expo-username"` with your actual Expo username.

### Step 2: Set Up AdMob Account

1. **Create AdMob Account**
   - Go to https://admob.google.com
   - Sign in with Google account
   - Accept terms

2. **Add Your App**
   - Click "Apps" → "Add App"
   - Select "Android" (or iOS)
   - Choose "App not published yet"
   - App name: **Quiz Master**
   - Platform: **Android**
   - Package name: `com.quizmasterapp`

3. **Create Rewarded Ad Unit**
   - Select your app
   - Click "Ad units" → "Add ad unit"
   - Select "Rewarded"
   - Name: "Coin Reward"
   - Click "Create ad unit"
   - **Copy the Ad Unit ID** (e.g., `ca-app-pub-1234567890/1234567890`)

4. **Get App ID**
   - Go to "App settings"
   - **Copy your App ID** (e.g., `ca-app-pub-1234567890~1234567890`)

### Step 3: Update Configuration with Real Ad IDs

**Update `app.json`:**
```json
"plugins": [
  [
    "react-native-google-mobile-ads",
    {
      "androidAppId": "ca-app-pub-YOUR_APP_ID~XXXXXXXXXX",  // Replace this
      "iosAppId": "ca-app-pub-YOUR_APP_ID~XXXXXXXXXX",      // Replace this
      "userTrackingPermission": "This identifier will be used to deliver personalized ads to you."
    }
  ]
]
```

**Create Real Ad Service:**

Create `src/services/adService.production.js`:
```javascript
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

const AD_UNIT_IDS = {
  rewardedVideo: __DEV__
    ? TestIds.REWARDED  // Test ads in development
    : 'ca-app-pub-YOUR_AD_UNIT_ID/XXXXXXXXXX', // Your real ad unit ID
};

let rewardedAd = null;
let isAdLoaded = false;

export const initializeRewardedAd = () => {
  console.log('📺 Initializing AdMob rewarded ad...');

  rewardedAd = RewardedAd.createForAdRequest(AD_UNIT_IDS.rewardedVideo, {
    requestNonPersonalizedAdsOnly: false,
  });

  const unsubscribeLoaded = rewardedAd.addAdEventListener(
    RewardedAdEventType.LOADED,
    () => {
      isAdLoaded = true;
      console.log('✅ Rewarded ad loaded and ready');
    }
  );

  const unsubscribeFailed = rewardedAd.addAdEventListener(
    RewardedAdEventType.FAILED_TO_LOAD,
    error => {
      console.error('❌ Ad failed to load:', error);
      isAdLoaded = false;
    }
  );

  rewardedAd.load();

  return () => {
    unsubscribeLoaded();
    unsubscribeFailed();
  };
};

export const showRewardedAd = () => {
  return new Promise((resolve, reject) => {
    if (!rewardedAd || !isAdLoaded) {
      reject(new Error('Ad not loaded yet'));
      return;
    }

    let rewardEarned = false;

    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('✅ User earned reward:', reward);
        rewardEarned = true;
      }
    );

    const unsubscribeClosed = rewardedAd.addAdEventListener(
      RewardedAdEventType.CLOSED,
      () => {
        console.log('Ad closed');
        unsubscribeEarned();
        unsubscribeClosed();
        isAdLoaded = false;

        // Preload next ad
        initializeRewardedAd();

        resolve(rewardEarned);
      }
    );

    rewardedAd.show().catch(error => {
      console.error('Error showing ad:', error);
      unsubscribeEarned();
      unsubscribeClosed();
      reject(error);
    });
  });
};

export const isRewardedAdReady = () => {
  return isAdLoaded;
};
```

**Replace the simulated ad service:**
```bash
# Backup simulated version
mv src/services/adService.js src/services/adService.simulated.js

# Use production version
mv src/services/adService.production.js src/services/adService.js
```

**Update `App.js`** to initialize AdMob:
```javascript
import React, { useEffect } from 'react';
import mobileAds from 'react-native-google-mobile-ads';
// ... other imports

export default function App() {
  useEffect(() => {
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('✅ AdMob initialized:', adapterStatuses);
      })
      .catch(error => {
        console.error('❌ AdMob initialization error:', error);
      });
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor="#3a4a5a" />
      <AppNavigator />
    </AuthProvider>
  );
}
```

### Step 4: Install AdMob Package

```bash
npm install react-native-google-mobile-ads
```

### Step 5: Build Android APK

**Build for testing (preview):**
```bash
eas build --platform android --profile preview
```

**Build for production:**
```bash
eas build --platform android --profile production
```

This will:
1. Upload your code to Expo servers
2. Build native Android APK with AdMob integrated
3. Take ~10-20 minutes
4. Provide download link when complete

**Download the APK:**
- Click the link in terminal
- Or go to https://expo.dev/accounts/[your-username]/projects/quiz-master-app/builds
- Download the `.apk` file
- Install on Android device

### Step 6: Build iOS (Optional - Requires Apple Developer Account)

**Prerequisites:**
- Apple Developer Account ($99/year)
- App ID registered in Apple Developer Portal

**Build:**
```bash
eas build --platform ios --profile production
```

## Testing Your Production Build

### Test Ads First
1. Build with test ad IDs (current setup)
2. Install APK on device
3. Play until coins < 100
4. Click "Watch Ad"
5. Verify real Google test ad shows
6. Verify coins awarded after watching

### Switch to Real Ads
1. Update ad unit IDs in `adService.js`
2. Add your device as test device in AdMob console
3. Rebuild and test
4. Verify real ads show

## Build Profiles Explained

### `development`
- For testing native features during development
- Requires Expo Dev Client
- Use: `eas build --platform android --profile development`

### `preview`
- Quick APK for testing
- Internal distribution
- Use: `eas build --platform android --profile preview`

### `production`
- Final build for app stores
- Optimized and minified
- Use: `eas build --platform android --profile production`

## Publishing to Google Play Store

### Step 1: Prepare for Release
1. Test thoroughly with preview build
2. Create app icon and screenshots
3. Write app description
4. Set privacy policy URL

### Step 2: Create Google Play Developer Account
- Cost: $25 one-time fee
- Go to https://play.google.com/console

### Step 3: Submit App with EAS
```bash
eas submit --platform android --latest
```

This will:
- Upload your APK to Google Play Console
- Create draft release
- You can then add details and publish

## Troubleshooting

### Build Failed
```bash
# Check build logs
eas build:list

# View specific build logs
eas build:view [build-id]
```

### AdMob Not Showing Ads
- Verify app is approved in AdMob (can take hours)
- Check ad unit IDs are correct
- Ensure test device ID added in AdMob console
- New apps may have limited ad fill initially

### "Invalid Ad Unit ID"
- Double-check Ad Unit ID in `adService.js`
- Ensure App ID in `app.json` matches AdMob console
- Format: `ca-app-pub-XXXXXXXXXX/YYYYYYYYYY`

### Coins Not Awarded
- Check Firebase connection
- Verify `awardCoinsForAd()` is called after ad completes
- Check console logs for errors

## Cost Summary

| Service | Cost |
|---------|------|
| Expo Account | Free |
| EAS Build (Free Tier) | Free (limited builds) |
| EAS Build (Paid) | $29-99/month (unlimited) |
| Google Play Developer | $25 one-time |
| Apple Developer | $99/year |
| AdMob Account | Free |
| Firebase (Spark Plan) | Free (generous limits) |

## Free Tier Limits
- **EAS Build Free:** Limited builds per month
- **Firebase Spark:** 50k reads/day, 20k writes/day
- **AdMob:** Unlimited, you earn money from ads

## Monthly Costs (If Free Tier Exceeded)
- **EAS Build:** $29/month (Production plan)
- **Firebase Blaze:** Pay-as-you-go (likely $0-5/month for small app)

## Next Steps After First Build

1. ✅ Build preview APK
2. ✅ Test on real device
3. ✅ Verify ads work
4. ✅ Create AdMob account and get real ad IDs
5. ✅ Rebuild with production ad IDs
6. ✅ Test thoroughly
7. ✅ Create Google Play account
8. ✅ Submit to Play Store
9. 🎉 Launch!

## Helpful Commands

```bash
# Check EAS CLI version
eas --version

# View all builds
eas build:list

# View build details
eas build:view [build-id]

# Cancel running build
eas build:cancel

# Update app configuration
eas update

# Run local build (requires Android Studio/Xcode)
npx expo prebuild
npx expo run:android
```

## Support Resources

- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **AdMob Integration:** https://docs.expo.dev/versions/latest/sdk/admob/
- **Expo Forums:** https://forums.expo.dev
- **AdMob Help:** https://support.google.com/admob

---

**Ready to Build?** Start with Step 1 and work through each step. The entire process takes about 30-60 minutes the first time.

**Questions?** Check the troubleshooting section or reach out to Expo community forums.

🚀 **Good luck with your launch!**
