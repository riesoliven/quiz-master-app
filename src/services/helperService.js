import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { firestore, COLLECTIONS } from './firebase';

// Helper unlock costs (in coins)
export const HELPER_COSTS = {
  FREE: 0,
  COMMON: 1000,
  RARE: 5000,
  EPIC: 15000,
  LEGENDARY: 50000
};

// EXP required per level
export const EXP_PER_LEVEL = 100;
export const MAX_HELPER_LEVEL = 10;

// Coins to EXP conversion
export const COINS_PER_EXP = 10; // 10 coins = 1 EXP

/**
 * Get user's helper data
 * @param {string} userId
 * @returns {Promise<Object>} helpers object
 */
export const getUserHelpers = async (userId) => {
  try {
    const userDoc = await getDoc(doc(firestore, COLLECTIONS.USERS, userId));
    if (!userDoc.exists()) return {};
    return userDoc.data().helpers || {};
  } catch (error) {
    console.error('Error getting helpers:', error);
    return {};
  }
};

/**
 * Unlock a helper
 * @param {string} userId
 * @param {string} helperId
 * @param {number} cost - coins to spend
 * @returns {Promise<boolean>} success
 */
export const unlockHelper = async (userId, helperId, cost) => {
  try {
    const userDoc = await getDoc(doc(firestore, COLLECTIONS.USERS, userId));
    if (!userDoc.exists()) return false;

    const currentCoins = userDoc.data().coins || 0;
    if (currentCoins < cost) {
      console.error('Not enough coins to unlock helper');
      return false;
    }

    const helpers = userDoc.data().helpers || {};
    if (helpers[helperId]?.unlocked) {
      console.error('Helper already unlocked');
      return false;
    }

    // Unlock helper and deduct coins
    const userDocRef = doc(firestore, COLLECTIONS.USERS, userId);
    await updateDoc(userDocRef, {
      [`helpers.${helperId}.unlocked`]: true,
      [`helpers.${helperId}.level`]: 1,
      [`helpers.${helperId}.exp`]: 0,
      coins: increment(-cost)
    });

    return true;
  } catch (error) {
    console.error('Error unlocking helper:', error);
    return false;
  }
};

/**
 * Add EXP to a helper (from gameplay)
 * @param {string} userId
 * @param {string} helperId
 * @param {number} expAmount
 * @returns {Promise<Object>} { leveledUp: boolean, newLevel: number }
 */
export const addHelperEXP = async (userId, helperId, expAmount) => {
  try {
    const userDoc = await getDoc(doc(firestore, COLLECTIONS.USERS, userId));
    if (!userDoc.exists()) return { leveledUp: false, newLevel: 1 };

    const helpers = userDoc.data().helpers || {};
    const helper = helpers[helperId];

    if (!helper?.unlocked) {
      console.error('Helper not unlocked');
      return { leveledUp: false, newLevel: 1 };
    }

    const currentLevel = helper.level || 1;
    const currentExp = helper.exp || 0;
    const newExp = currentExp + expAmount;

    // Calculate new level
    const expForNextLevel = EXP_PER_LEVEL * currentLevel;
    let leveledUp = false;
    let newLevel = currentLevel;

    if (newExp >= expForNextLevel && currentLevel < MAX_HELPER_LEVEL) {
      newLevel = currentLevel + 1;
      leveledUp = true;
    }

    // Update helper
    const userDocRef = doc(firestore, COLLECTIONS.USERS, userId);
    await updateDoc(userDocRef, {
      [`helpers.${helperId}.exp`]: leveledUp ? newExp - expForNextLevel : newExp,
      [`helpers.${helperId}.level`]: newLevel
    });

    return { leveledUp, newLevel };
  } catch (error) {
    console.error('Error adding helper EXP:', error);
    return { leveledUp: false, newLevel: 1 };
  }
};

/**
 * Buy EXP with coins
 * @param {string} userId
 * @param {string} helperId
 * @param {number} coinsToSpend
 * @returns {Promise<{success: boolean, expGained: number, leveledUp: boolean}>}
 */
export const buyHelperEXP = async (userId, helperId, coinsToSpend) => {
  try {
    const userDoc = await getDoc(doc(firestore, COLLECTIONS.USERS, userId));
    if (!userDoc.exists()) return { success: false, expGained: 0, leveledUp: false };

    const currentCoins = userDoc.data().coins || 0;
    if (currentCoins < coinsToSpend) {
      console.error('Not enough coins');
      return { success: false, expGained: 0, leveledUp: false };
    }

    const expGained = Math.floor(coinsToSpend / COINS_PER_EXP);
    if (expGained === 0) {
      console.error('Not enough coins to gain EXP (minimum 10 coins)');
      return { success: false, expGained: 0, leveledUp: false };
    }

    // Deduct coins
    const userDocRef = doc(firestore, COLLECTIONS.USERS, userId);
    await updateDoc(userDocRef, {
      coins: increment(-coinsToSpend)
    });

    // Add EXP
    const result = await addHelperEXP(userId, helperId, expGained);

    return {
      success: true,
      expGained,
      leveledUp: result.leveledUp,
      newLevel: result.newLevel
    };
  } catch (error) {
    console.error('Error buying helper EXP:', error);
    return { success: false, expGained: 0, leveledUp: false };
  }
};

/**
 * Calculate helper's current rating for a subject
 * @param {Object} helper - helper data with base/potential ratings
 * @param {number} level - helper's current level (1-10)
 * @param {string} subject
 * @returns {number} current rating
 */
export const calculateHelperRating = (helper, level, subject) => {
  const baseRating = helper.ratings[subject]?.base || 0;
  const potentialRating = helper.ratings[subject]?.potential || baseRating;

  // Linear interpolation between base and potential
  const progress = (level - 1) / (MAX_HELPER_LEVEL - 1); // 0 to 1
  const currentRating = Math.round(baseRating + (potentialRating - baseRating) * progress);

  return currentRating;
};

/**
 * Get EXP required for next level
 * @param {number} currentLevel
 * @returns {number} EXP needed
 */
export const getExpForNextLevel = (currentLevel) => {
  if (currentLevel >= MAX_HELPER_LEVEL) return 0;
  return EXP_PER_LEVEL * currentLevel;
};
