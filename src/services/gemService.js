import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { firestore, COLLECTIONS } from './firebase';

// Gem costs
export const GEM_COST_ENERGY_5 = 25; // 25 gems for 5 energy (1 game)
export const GEM_COST_ENERGY_REFILL = 50; // 50 gems for full energy refill

// Gem rewards
export const GEM_REWARD_PERFECT_QUIZ = 5; // 5 gems for perfect 14/14
export const GEM_REWARD_AD = 2; // 2 gems per ad
export const GEM_REWARD_STREAK_3 = 5; // 3-day streak
export const GEM_REWARD_STREAK_7 = 15; // 7-day streak
export const GEM_REWARD_STREAK_30 = 100; // 30-day streak

// Conversion rates
export const COINS_PER_10_GEMS = 1000; // 1,000 coins = 10 gems

/**
 * Get user's current gem balance
 * @param {string} userId
 * @returns {Promise<number>}
 */
export const getUserGems = async (userId) => {
  try {
    const userDoc = await getDoc(doc(firestore, COLLECTIONS.USERS, userId));
    if (!userDoc.exists()) return 0;
    return userDoc.data().gems || 0;
  } catch (error) {
    console.error('Error getting gems:', error);
    return 0;
  }
};

/**
 * Add gems to user account
 * @param {string} userId
 * @param {number} amount
 * @returns {Promise<number>} new gem amount
 */
export const addGems = async (userId, amount) => {
  try {
    const userDocRef = doc(firestore, COLLECTIONS.USERS, userId);
    await updateDoc(userDocRef, {
      gems: increment(amount)
    });

    const userDoc = await getDoc(userDocRef);
    return userDoc.data().gems || 0;
  } catch (error) {
    console.error('Error adding gems:', error);
    return 0;
  }
};

/**
 * Spend gems
 * @param {string} userId
 * @param {number} amount
 * @returns {Promise<boolean>} success
 */
export const spendGems = async (userId, amount) => {
  try {
    // Check if user has enough gems
    const currentGems = await getUserGems(userId);
    if (currentGems < amount) {
      console.error('Not enough gems');
      return false;
    }

    // Deduct gems
    const userDocRef = doc(firestore, COLLECTIONS.USERS, userId);
    await updateDoc(userDocRef, {
      gems: increment(-amount)
    });

    return true;
  } catch (error) {
    console.error('Error spending gems:', error);
    return false;
  }
};

/**
 * Convert coins to gems
 * @param {string} userId
 * @param {number} coinsToSpend
 * @returns {Promise<{success: boolean, gemsEarned: number}>}
 */
export const convertCoinsToGems = async (userId, coinsToSpend) => {
  try {
    // Get current user doc to check coin balance
    const userDoc = await getDoc(doc(firestore, COLLECTIONS.USERS, userId));
    if (!userDoc.exists()) return { success: false, gemsEarned: 0 };

    const currentCoins = userDoc.data().coins || 0;
    if (currentCoins < coinsToSpend) {
      console.error('Not enough coins');
      return { success: false, gemsEarned: 0 };
    }

    // Calculate gems earned (1,000 coins = 10 gems)
    const gemsEarned = Math.floor((coinsToSpend / COINS_PER_10_GEMS) * 10);

    if (gemsEarned === 0) {
      console.error('Not enough coins to convert (minimum 1,000)');
      return { success: false, gemsEarned: 0 };
    }

    // Update user doc
    const userDocRef = doc(firestore, COLLECTIONS.USERS, userId);
    await updateDoc(userDocRef, {
      coins: increment(-coinsToSpend),
      gems: increment(gemsEarned)
    });

    return { success: true, gemsEarned };
  } catch (error) {
    console.error('Error converting coins to gems:', error);
    return { success: false, gemsEarned: 0 };
  }
};

/**
 * Award gems for perfect quiz
 * @param {string} userId
 * @returns {Promise<number>} gems awarded
 */
export const awardGemsForPerfectQuiz = async (userId) => {
  try {
    await addGems(userId, GEM_REWARD_PERFECT_QUIZ);
    return GEM_REWARD_PERFECT_QUIZ;
  } catch (error) {
    console.error('Error awarding perfect quiz gems:', error);
    return 0;
  }
};

/**
 * Award gems for watching ad
 * @param {string} userId
 * @returns {Promise<number>} gems awarded
 */
export const awardGemsForAd = async (userId) => {
  try {
    await addGems(userId, GEM_REWARD_AD);
    return GEM_REWARD_AD;
  } catch (error) {
    console.error('Error awarding ad gems:', error);
    return 0;
  }
};

/**
 * Award gems for daily streak
 * @param {string} userId
 * @param {number} streakDays
 * @returns {Promise<number>} gems awarded
 */
export const awardGemsForStreak = async (userId, streakDays) => {
  try {
    let gemsToAward = 0;

    if (streakDays === 3) {
      gemsToAward = GEM_REWARD_STREAK_3;
    } else if (streakDays === 7) {
      gemsToAward = GEM_REWARD_STREAK_7;
    } else if (streakDays === 30) {
      gemsToAward = GEM_REWARD_STREAK_30;
    }

    if (gemsToAward > 0) {
      await addGems(userId, gemsToAward);
    }

    return gemsToAward;
  } catch (error) {
    console.error('Error awarding streak gems:', error);
    return 0;
  }
};
