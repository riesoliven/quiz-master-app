import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { firestore, COLLECTIONS } from './firebase';

// Reward for watching an ad
export const AD_REWARD_COINS = 50;

/**
 * Award coins based on quiz score
 * Formula: score ÷ 10 = coins earned
 * @param {string} userId
 * @param {number} score
 */
export const awardCoinsForScore = async (userId, score) => {
  try {
    const coinsEarned = Math.floor(score / 10);
    const userDocRef = doc(firestore, COLLECTIONS.USERS, userId);
    await updateDoc(userDocRef, {
      coins: increment(coinsEarned)
    });
    return coinsEarned;
  } catch (error) {
    console.error('Error awarding coins:', error);
    return 0;
  }
};

/**
 * Award coins for watching an ad
 * @param {string} userId
 * @returns {number} coins awarded
 */
export const awardCoinsForAd = async (userId) => {
  try {
    const userDocRef = doc(firestore, COLLECTIONS.USERS, userId);
    await updateDoc(userDocRef, {
      coins: increment(AD_REWARD_COINS)
    });
    return AD_REWARD_COINS;
  } catch (error) {
    console.error('Error awarding ad coins:', error);
    return 0;
  }
};

/**
 * Get user's current coin balance
 * @param {string} userId
 * @returns {number}
 */
export const getUserCoins = async (userId) => {
  try {
    const userDoc = await getDoc(doc(firestore, COLLECTIONS.USERS, userId));
    if (!userDoc.exists()) return 0;
    return userDoc.data().coins || 0;
  } catch (error) {
    console.error('Error getting coins:', error);
    return 0;
  }
};
