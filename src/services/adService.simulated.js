/**
 * Ad Service - Simulated for Expo Go Development
 *
 * IMPORTANT: This is a simulated version for development in Expo Go.
 * Real AdMob integration requires building a custom dev client or production build.
 *
 * To enable real ads:
 * 1. Run: npx expo install expo-dev-client react-native-google-mobile-ads
 * 2. Run: npx expo prebuild
 * 3. Build custom dev client: npx expo run:android or npx expo run:ios
 * 4. Replace this file with real AdMob implementation
 */

let isAdSimulated = true;

/**
 * Initialize rewarded ad (simulated)
 */
export const initializeRewardedAd = () => {
  console.log('📺 Ad service initialized (simulated mode for Expo Go)');
  isAdSimulated = true;

  // Return cleanup function
  return () => {
    console.log('Ad service cleaned up');
  };
};

/**
 * Show rewarded ad (simulated) - returns promise that resolves when user "watches" ad
 * @returns {Promise<boolean>} - true if user watched ad and earned reward
 */
export const showRewardedAd = () => {
  return new Promise((resolve) => {
    console.log('📺 Showing simulated ad...');

    // Simulate ad viewing with 2 second delay
    setTimeout(() => {
      console.log('✅ Simulated ad completed!');
      resolve(true);
    }, 2000);
  });
};

/**
 * Check if ad is ready to show (always true for simulated ads)
 * @returns {boolean}
 */
export const isRewardedAdReady = () => {
  return isAdSimulated;
};
