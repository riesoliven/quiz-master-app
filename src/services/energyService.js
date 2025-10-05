import { doc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { firestore, COLLECTIONS } from './firebase';

// Energy constants
export const MAX_ENERGY = 25;
export const ENERGY_PER_GAME = 5;
export const ENERGY_REGEN_RATE = 1; // 1 energy per hour
export const ENERGY_REGEN_MS = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Get user's current energy (with auto-regeneration calculation)
 * @param {string} userId
 * @returns {Promise<{energy: number, lastUpdate: Date}>}
 */
export const getUserEnergy = async (userId) => {
  try {
    const userDoc = await getDoc(doc(firestore, COLLECTIONS.USERS, userId));
    if (!userDoc.exists()) return { energy: MAX_ENERGY, lastUpdate: new Date() };

    const data = userDoc.data();
    let currentEnergy = data.energy || MAX_ENERGY;
    const lastEnergyUpdate = data.lastEnergyUpdate?.toDate() || new Date();

    // Calculate energy regenerated since last update
    if (currentEnergy < MAX_ENERGY) {
      const now = new Date();
      const timeDiff = now - lastEnergyUpdate;
      const hoursElapsed = Math.floor(timeDiff / ENERGY_REGEN_MS);

      if (hoursElapsed > 0) {
        const energyToAdd = hoursElapsed * ENERGY_REGEN_RATE;
        currentEnergy = Math.min(currentEnergy + energyToAdd, MAX_ENERGY);

        // Update database with regenerated energy
        await updateDoc(doc(firestore, COLLECTIONS.USERS, userId), {
          energy: currentEnergy,
          lastEnergyUpdate: serverTimestamp()
        });
      }
    }

    return { energy: currentEnergy, lastUpdate: lastEnergyUpdate };
  } catch (error) {
    console.error('Error getting energy:', error);
    return { energy: 0, lastUpdate: new Date() };
  }
};

/**
 * Check if user has enough energy to play
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
export const canAffordGame = async (userId) => {
  try {
    const { energy } = await getUserEnergy(userId);
    return energy >= ENERGY_PER_GAME;
  } catch (error) {
    console.error('Error checking energy:', error);
    return false;
  }
};

/**
 * Spend energy to start a game
 * @param {string} userId
 * @returns {Promise<boolean>} success
 */
export const spendEnergyForGame = async (userId) => {
  try {
    // Get current energy (with regeneration)
    const { energy } = await getUserEnergy(userId);

    if (energy < ENERGY_PER_GAME) {
      console.error('Not enough energy to play');
      return false;
    }

    // Calculate new energy value (prevent negative)
    const newEnergy = Math.max(0, energy - ENERGY_PER_GAME);

    // Deduct energy using explicit value instead of increment
    const userDocRef = doc(firestore, COLLECTIONS.USERS, userId);
    await updateDoc(userDocRef, {
      energy: newEnergy,
      lastEnergyUpdate: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error spending energy:', error);
    return false;
  }
};

/**
 * Add energy (from ads, gems, or daily rewards)
 * @param {string} userId
 * @param {number} amount
 * @returns {Promise<number>} new energy amount
 */
export const addEnergy = async (userId, amount) => {
  try {
    const { energy } = await getUserEnergy(userId);
    const newEnergy = Math.min(energy + amount, MAX_ENERGY);

    const userDocRef = doc(firestore, COLLECTIONS.USERS, userId);
    await updateDoc(userDocRef, {
      energy: newEnergy,
      lastEnergyUpdate: serverTimestamp()
    });

    return newEnergy;
  } catch (error) {
    console.error('Error adding energy:', error);
    return 0;
  }
};

/**
 * Refill energy to max (from gems)
 * @param {string} userId
 * @returns {Promise<boolean>} success
 */
export const refillEnergy = async (userId) => {
  try {
    const userDocRef = doc(firestore, COLLECTIONS.USERS, userId);
    await updateDoc(userDocRef, {
      energy: MAX_ENERGY,
      lastEnergyUpdate: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error refilling energy:', error);
    return false;
  }
};

/**
 * Calculate time until next energy regenerates
 * @param {Date} lastUpdate
 * @returns {number} milliseconds until next energy
 */
export const getTimeUntilNextEnergy = (lastUpdate) => {
  const now = new Date();
  const timeDiff = now - lastUpdate;
  const msUntilNext = ENERGY_REGEN_MS - (timeDiff % ENERGY_REGEN_MS);
  return msUntilNext;
};

/**
 * Get formatted time until next energy (e.g., "45m 30s")
 * @param {Date} lastUpdate
 * @returns {string}
 */
export const getTimeUntilNextEnergyFormatted = (lastUpdate) => {
  const ms = getTimeUntilNextEnergy(lastUpdate);
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

/**
 * Calculate time until energy is full
 * @param {number} currentEnergy
 * @param {Date} lastUpdate
 * @returns {string} formatted time (e.g., "5h 30m")
 */
export const getTimeUntilFullEnergy = (currentEnergy, lastUpdate) => {
  if (currentEnergy >= MAX_ENERGY) {
    return 'Full';
  }

  const energyNeeded = MAX_ENERGY - currentEnergy;
  const hoursNeeded = energyNeeded * 1; // 1 hour per energy

  // Account for partial hour already elapsed
  const now = new Date();
  const timeDiff = now - lastUpdate;
  const partialHourProgress = (timeDiff % ENERGY_REGEN_MS) / ENERGY_REGEN_MS;
  const totalHours = hoursNeeded - partialHourProgress;

  const hours = Math.floor(totalHours);
  const minutes = Math.floor((totalHours % 1) * 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};
