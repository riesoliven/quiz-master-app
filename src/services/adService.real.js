import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

/**
 * Real AdMob Integration with Google Test Ads
 *
 * This uses real Google test ads that show actual video content.
 * Works in EAS builds (development, preview, production).
 *
 * Test ads are safe to use and recommended by Google during development.
 */

const AD_UNIT_IDS = {
  // Using Google's official test ad unit ID
  // This shows real test video ads
  rewardedVideo: __DEV__
    ? TestIds.REWARDED  // Test ads in development/preview
    : 'ca-app-pub-XXXXX/XXXXX', // Replace with your production ad unit ID
};

let rewardedAd = null;
let isAdLoaded = false;

/**
 * Initialize rewarded ad
 */
export const initializeRewardedAd = () => {
  console.log('📺 Initializing AdMob with test ads...');

  rewardedAd = RewardedAd.createForAdRequest(AD_UNIT_IDS.rewardedVideo, {
    requestNonPersonalizedAdsOnly: false,
  });

  // Ad loaded successfully
  const unsubscribeLoaded = rewardedAd.addAdEventListener(
    RewardedAdEventType.LOADED,
    () => {
      isAdLoaded = true;
      console.log('✅ Test ad loaded and ready to show');
    }
  );

  // Ad failed to load
  const unsubscribeFailed = rewardedAd.addAdEventListener(
    RewardedAdEventType.FAILED_TO_LOAD,
    error => {
      console.error('❌ Test ad failed to load:', error);
      isAdLoaded = false;
    }
  );

  // Start loading the ad
  rewardedAd.load();

  // Return cleanup function
  return () => {
    unsubscribeLoaded();
    unsubscribeFailed();
  };
};

/**
 * Show rewarded ad and return promise that resolves when user earns reward
 * @returns {Promise<boolean>} - true if user watched ad and earned reward
 */
export const showRewardedAd = () => {
  return new Promise((resolve, reject) => {
    if (!rewardedAd || !isAdLoaded) {
      reject(new Error('Ad not loaded yet. Please try again in a moment.'));
      return;
    }

    let rewardEarned = false;

    // User earned reward (watched enough of the ad)
    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('✅ User earned reward:', reward);
        rewardEarned = true;
      }
    );

    // Ad was closed (user might have closed early or watched completely)
    const unsubscribeClosed = rewardedAd.addAdEventListener(
      RewardedAdEventType.CLOSED,
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
    console.log('📺 Showing test ad...');
    rewardedAd.show().catch(error => {
      console.error('Error showing ad:', error);
      unsubscribeEarned();
      unsubscribeClosed();
      reject(error);
    });
  });
};

/**
 * Check if ad is ready to show
 * @returns {boolean}
 */
export const isRewardedAdReady = () => {
  return isAdLoaded;
};
