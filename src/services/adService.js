/**
 * Smart Ad Service - Automatically switches between real and simulated ads
 *
 * - Expo Go: Uses simulated ads (native modules not available)
 * - EAS Builds: Uses real Google test ads
 * - Production: Uses real ads with your Ad Unit IDs
 */

import Constants from 'expo-constants';

// Proper Expo Go detection using Constants
// Expo Go = 'storeClient', EAS Build = 'standalone' or 'bare'
const isExpoGo = Constants.executionEnvironment === 'storeClient';
const isStandalone = Constants.executionEnvironment === 'standalone' ||
                     Constants.executionEnvironment === 'bare';

console.log('🔍 Environment Detection:');
console.log('  executionEnvironment:', Constants.executionEnvironment);
console.log('  appOwnership:', Constants.appOwnership);
console.log('  isExpoGo:', isExpoGo);
console.log('  isStandalone:', isStandalone);

let RewardedAd, RewardedAdEventType, AdEventType, TestIds;
let rewardedAd = null;
let isAdLoaded = false;
let admobAvailable = false;

// Try to import AdMob - will fail in Expo Go
if (isStandalone) {
  try {
    console.log('📺 Standalone build detected - loading AdMob module...');
    const admobModule = require('react-native-google-mobile-ads');
    RewardedAd = admobModule.RewardedAd;
    RewardedAdEventType = admobModule.RewardedAdEventType;
    AdEventType = admobModule.AdEventType;
    TestIds = admobModule.TestIds;
    admobAvailable = true;
    console.log('✅ AdMob module loaded successfully - REAL ADS ENABLED!');
  } catch (error) {
    console.log('⚠️ AdMob not available, falling back to simulated ads');
    console.log('Error:', error.message);
  }
} else {
  console.log('📺 Expo Go detected - simulated ads will be used');
}

// Google's latest test ad unit IDs (2024)
const TEST_REWARDED_AD_ID = 'ca-app-pub-3940256099942544/5224354917';

const AD_UNIT_IDS = {
  // Always use test ID until you replace it with your real production ID
  rewardedVideo: TEST_REWARDED_AD_ID,
};

/**
 * Initialize rewarded ad
 */
export const initializeRewardedAd = () => {
  try {
    console.log('🔍 initializeRewardedAd called');
    console.log('  isStandalone:', isStandalone);
    console.log('  admobAvailable:', admobAvailable);
    console.log('  RewardedAd:', !!RewardedAd);
    console.log('  RewardedAd type:', typeof RewardedAd);
    console.log('  RewardedAd.createForAdRequest:', typeof RewardedAd?.createForAdRequest);

    // Simulated ads for Expo Go or if AdMob not available
    if (!isStandalone || !admobAvailable || !RewardedAd) {
      console.log('❌ Using simulated ads because one of the checks failed');
      console.log('  - isStandalone:', isStandalone);
      console.log('  - admobAvailable:', admobAvailable);
      console.log('  - RewardedAd:', !!RewardedAd);
      isAdLoaded = true;
      return () => {};
    }

    // Real ads for standalone builds
    console.log('✅ All checks passed - initializing REAL Google test ads...');
    console.log('📺 Ad Unit ID:', AD_UNIT_IDS.rewardedVideo);
    console.log('📺 Creating ad instance with RewardedAd.createForAdRequest...');

    rewardedAd = RewardedAd.createForAdRequest(AD_UNIT_IDS.rewardedVideo, {
      requestNonPersonalizedAdsOnly: false,
    });

    console.log('📺 Ad instance created:', !!rewardedAd);
    console.log('📺 Ad instance type:', typeof rewardedAd);

    // Set up LOADED event listener
    console.log('📺 Setting up LOADED event listener...');
    const unsubscribeLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        isAdLoaded = true;
        console.log('✅✅✅ Real test ad LOADED and ready! ✅✅✅');
        console.log('  isAdLoaded is now:', isAdLoaded);
      }
    );

    // Set up FAILED_TO_LOAD event listener
    console.log('📺 Setting up ERROR event listener...');
    const unsubscribeError = rewardedAd.addAdEventListener(
      AdEventType.ERROR,
      error => {
        console.error('❌❌❌ Test ad FAILED to load! ❌❌❌');
        console.error('  Error code:', error?.code);
        console.error('  Error message:', error?.message);
        console.error('  Full error:', JSON.stringify(error, null, 2));
        isAdLoaded = false;
      }
    );

    // Start loading the ad
    console.log('📺 Calling rewardedAd.load()...');
    rewardedAd.load();
    console.log('📺 rewardedAd.load() called successfully');

    // Return cleanup function
    return () => {
      unsubscribeLoaded();
      unsubscribeError();
    };
  } catch (error) {
    console.error('❌ Error initializing ads:', error);
    // Fallback to simulated ads
    isAdLoaded = true;
    return () => {};
  }
};

/**
 * Show rewarded ad and return promise that resolves when user earns reward
 * @returns {Promise<boolean>} - true if user watched ad and earned reward
 */
export const showRewardedAd = () => {
  return new Promise((resolve, reject) => {
    try {
      // Debug logging
      console.log('🔍 showRewardedAd called:');
      console.log('  isStandalone:', isStandalone);
      console.log('  admobAvailable:', admobAvailable);
      console.log('  RewardedAd:', !!RewardedAd);
      console.log('  rewardedAd:', !!rewardedAd);
      console.log('  isAdLoaded:', isAdLoaded);

      // Check 1: Environment
      if (!isStandalone) {
        console.log('❌ SIMULATED: Not standalone environment');
        setTimeout(() => resolve(true), 2000);
        return;
      }

      // Check 2: AdMob available
      if (!admobAvailable) {
        console.log('❌ SIMULATED: AdMob not available');
        setTimeout(() => resolve(true), 2000);
        return;
      }

      // Check 3: RewardedAd class exists
      if (!RewardedAd) {
        console.log('❌ SIMULATED: RewardedAd class not loaded');
        setTimeout(() => resolve(true), 2000);
        return;
      }

      // Check 4: Ad instance created
      if (!rewardedAd) {
        console.log('❌ ERROR: rewardedAd instance not created');
        reject(new Error('Ad instance not created. Check initialization.'));
        return;
      }

      // Check 5: Ad loaded
      if (!isAdLoaded) {
        console.log('❌ ERROR: Ad not loaded yet');
        reject(new Error('Ad not loaded yet. Please wait and try again.'));
        return;
      }

      // ALL CHECKS PASSED - Show real ad
      console.log('✅ ALL CHECKS PASSED - SHOWING REAL AD NOW!');

      let rewardEarned = false;

      // Set up event listeners using the correct event types
      const unsubscribeEarned = rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        reward => {
          console.log('✅ User earned reward:', reward);
          rewardEarned = true;
        }
      );

      const unsubscribeClosed = rewardedAd.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          console.log('Ad closed. Reward earned:', rewardEarned);
          unsubscribeEarned();
          unsubscribeClosed();
          isAdLoaded = false;

          // Preload the next ad
          console.log('📺 Preloading next ad...');
          initializeRewardedAd();

          // Resolve with whether reward was earned
          resolve(rewardEarned);
        }
      );

      // Show the ad
      console.log('📺 Showing real test ad...');
      rewardedAd.show().catch(error => {
        console.error('Error showing ad:', error);
        unsubscribeEarned();
        unsubscribeClosed();
        reject(error);
      });
    } catch (error) {
      console.error('❌ Error showing ad:', error);
      // Fallback to simulated ad on error
      setTimeout(() => resolve(true), 2000);
    }
  });
};

/**
 * Check if ad is ready to show
 * @returns {boolean}
 */
export const isRewardedAdReady = () => {
  return isAdLoaded;
};

/**
 * Get diagnostic info for debugging
 */
export const getAdDiagnostics = () => {
  return {
    isStandalone,
    isExpoGo,
    admobAvailable,
    hasRewardedAd: !!RewardedAd,
    hasRewardedAdInstance: !!rewardedAd,
    isAdLoaded,
    executionEnvironment: Constants.executionEnvironment,
    adUnitId: AD_UNIT_IDS.rewardedVideo,
    testAdId: TestIds?.REWARDED,
  };
};
