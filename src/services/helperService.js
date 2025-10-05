import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { firestore, COLLECTIONS } from './firebase';
import { getHelperById } from '../data/helpers';

// Helper unlock costs (in coins)
export const HELPER_COSTS = {
  FREE: 0,
  COMMON: 1000,
  RARE: 5000,
  EPIC: 15000,
  LEGENDARY: 50000
};

// EXP required per level (level is now just a prestige indicator)
export const EXP_PER_LEVEL = 100;
export const MAX_HELPER_LEVEL = 10;

// Coins to EXP conversion
export const COINS_PER_EXP = 10; // 10 coins = 1 EXP

// NBA 2K-style rating upgrade costs (EXP per +1 rating point)
// Cost increases exponentially as ratings get higher
export const getRatingUpgradeCost = (currentRating) => {
  if (currentRating < 50) return 5;        // 25-49: 5 EXP per point
  if (currentRating < 70) return 10;       // 50-69: 10 EXP per point
  if (currentRating < 85) return 20;       // 70-84: 20 EXP per point
  if (currentRating < 95) return 50;       // 85-94: 50 EXP per point
  return 100;                              // 95-99: 100 EXP per point
};

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

    // Get base ratings from helper definition
    const helperDef = getHelperById(helperId);
    if (!helperDef) return false;

    const ratings = {};
    Object.keys(helperDef.ratings).forEach(subject => {
      ratings[subject] = helperDef.ratings[subject].base;
    });

    // Unlock helper with base ratings and deduct coins
    const userDocRef = doc(firestore, COLLECTIONS.USERS, userId);
    await updateDoc(userDocRef, {
      [`helpers.${helperId}.unlocked`]: true,
      [`helpers.${helperId}.level`]: 1,
      [`helpers.${helperId}.exp`]: 0,
      [`helpers.${helperId}.ratings`]: ratings,
      coins: increment(-cost)
    });

    return true;
  } catch (error) {
    console.error('Error unlocking helper:', error);
    return false;
  }
};

/**
 * Add EXP to a helper (from gameplay) - used for level progression
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
 * Upgrade a specific subject rating by 1 point (NBA 2K style)
 * @param {string} userId
 * @param {string} helperId
 * @param {string} subject
 * @returns {Promise<{success: boolean, newRating: number, expSpent: number, expRemaining: number}>}
 */
export const upgradeSubjectRating = async (userId, helperId, subject) => {
  try {
    const userDoc = await getDoc(doc(firestore, COLLECTIONS.USERS, userId));
    if (!userDoc.exists()) return { success: false, newRating: 0, expSpent: 0, expRemaining: 0 };

    const helpers = userDoc.data().helpers || {};
    const helper = helpers[helperId];

    if (!helper?.unlocked) {
      console.error('Helper not unlocked');
      return { success: false, newRating: 0, expSpent: 0, expRemaining: 0 };
    }

    // Get helper definition to check potential cap
    const helperDef = getHelperById(helperId);
    if (!helperDef) return { success: false, newRating: 0, expSpent: 0, expRemaining: 0 };

    const currentRating = helper.ratings?.[subject] || helperDef.ratings[subject].base;
    const potentialCap = helperDef.ratings[subject].potential;

    // Check if already at potential cap
    if (currentRating >= potentialCap) {
      console.error('Rating already at maximum potential');
      return { success: false, newRating: currentRating, expSpent: 0, expRemaining: helper.exp || 0 };
    }

    // Calculate upgrade cost based on current rating
    const upgradeCost = getRatingUpgradeCost(currentRating);
    const currentExp = helper.exp || 0;

    // Check if enough EXP
    if (currentExp < upgradeCost) {
      console.error('Not enough EXP to upgrade rating');
      return { success: false, newRating: currentRating, expSpent: 0, expRemaining: currentExp };
    }

    // Upgrade the rating
    const newRating = currentRating + 1;
    const newExp = currentExp - upgradeCost;

    const userDocRef = doc(firestore, COLLECTIONS.USERS, userId);
    await updateDoc(userDocRef, {
      [`helpers.${helperId}.ratings.${subject}`]: newRating,
      [`helpers.${helperId}.exp`]: newExp
    });

    return {
      success: true,
      newRating,
      expSpent: upgradeCost,
      expRemaining: newExp
    };
  } catch (error) {
    console.error('Error upgrading subject rating:', error);
    return { success: false, newRating: 0, expSpent: 0, expRemaining: 0 };
  }
};

/**
 * Buy EXP with coins
 * @param {string} userId
 * @param {number} coinsToSpend
 * @returns {Promise<{success: boolean, expGained: number}>}
 */
export const buyEXPWithCoins = async (userId, coinsToSpend) => {
  try {
    const userDoc = await getDoc(doc(firestore, COLLECTIONS.USERS, userId));
    if (!userDoc.exists()) return { success: false, expGained: 0 };

    const currentCoins = userDoc.data().coins || 0;
    if (currentCoins < coinsToSpend) {
      console.error('Not enough coins');
      return { success: false, expGained: 0 };
    }

    const expGained = Math.floor(coinsToSpend / COINS_PER_EXP);
    if (expGained === 0) {
      console.error('Not enough coins to gain EXP (minimum 10 coins)');
      return { success: false, expGained: 0 };
    }

    // Deduct coins (EXP will be added to individual helpers when upgrading)
    const userDocRef = doc(firestore, COLLECTIONS.USERS, userId);
    await updateDoc(userDocRef, {
      coins: increment(-coinsToSpend)
    });

    return {
      success: true,
      expGained
    };
  } catch (error) {
    console.error('Error buying EXP:', error);
    return { success: false, expGained: 0 };
  }
};

/**
 * Add EXP directly to a specific helper (for coin-to-exp conversion)
 * @param {string} userId
 * @param {string} helperId
 * @param {number} expAmount
 * @returns {Promise<boolean>}
 */
export const addEXPToHelper = async (userId, helperId, expAmount) => {
  try {
    const userDocRef = doc(firestore, COLLECTIONS.USERS, userId);
    await updateDoc(userDocRef, {
      [`helpers.${helperId}.exp`]: increment(expAmount)
    });
    return true;
  } catch (error) {
    console.error('Error adding EXP to helper:', error);
    return false;
  }
};

/**
 * Get helper's current rating for a subject
 * @param {Object} userHelper - user's helper data from Firebase
 * @param {Object} helperDef - helper definition from helpers.js
 * @param {string} subject
 * @returns {number} current rating
 */
export const getHelperRating = (userHelper, helperDef, subject) => {
  // Return user's upgraded rating, or base rating if not yet set
  return userHelper?.ratings?.[subject] || helperDef.ratings[subject].base;
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
