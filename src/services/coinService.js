import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { firestore, COLLECTIONS } from './firebase';

// Cost to play one game
export const GAME_COST = 100;

// Reward for watching an ad
export const AD_REWARD = 50;

/**
 * Check if user has enough coins to play
 * @param {string} userId
 * @returns {boolean}
 */
export const canAffordGame = async (userId) => {
  try {
    const userDoc = await getDoc(doc(firestore, COLLECTIONS.USERS, userId));
    if (!userDoc.exists()) return false;

    const coins = userDoc.data().coins || 0;
    return coins >= GAME_COST;
  } catch (error) {
    console.error('Error checking coins:', error);
    return false;
  }
};

/**
 * Deduct coins to start a game
 * @param {string} userId
 * @returns {boolean} success
 */
export const spendCoinsForGame = async (userId) => {
  try {
    const userDocRef = doc(firestore, COLLECTIONS.USERS, userId);
    await updateDoc(userDocRef, {
      coins: increment(-GAME_COST)
    });
    return true;
  } catch (error) {
    console.error('Error spending coins:', error);
    return false;
  }
};

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
      coins: increment(AD_REWARD)
    });
    return AD_REWARD;
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
