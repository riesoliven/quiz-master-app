import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { firestore, COLLECTIONS } from './firebase';

/**
 * Get top leaderboard entries
 * @param {number} limitCount - Number of entries to fetch
 */
export const getTopLeaderboard = async (limitCount = 10) => {
  try {
    const leaderboardRef = collection(firestore, COLLECTIONS.LEADERBOARD);
    const q = query(
      leaderboardRef,
      orderBy('highScore', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);

    const leaderboard = [];
    snapshot.forEach((docSnap) => {
      leaderboard.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

/**
 * Get user's rank on the leaderboard
 * @param {string} userId
 */
export const getUserRank = async (userId) => {
  try {
    // Get user's score
    const userDocRef = doc(firestore, COLLECTIONS.LEADERBOARD, userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return { rank: 0, total: 0 };
    }

    const userScore = userDoc.data().highScore;

    // Count how many users have a higher score
    const leaderboardRef = collection(firestore, COLLECTIONS.LEADERBOARD);
    const higherScoresQuery = query(leaderboardRef, where('highScore', '>', userScore));
    const higherScoresSnapshot = await getDocs(higherScoresQuery);

    // Get total number of users with scores
    const totalUsersQuery = query(leaderboardRef, where('highScore', '>', 0));
    const totalUsersSnapshot = await getDocs(totalUsersQuery);

    return {
      rank: higherScoresSnapshot.size + 1,
      total: totalUsersSnapshot.size,
      score: userScore
    };
  } catch (error) {
    console.error('Error getting user rank:', error);
    return { rank: 0, total: 0, score: 0 };
  }
};

/**
 * Update user's high score if new score is better
 * @param {string} userId
 * @param {number} newScore
 * @param {string} message - Custom message for leaderboard
 * @param {string} username
 * @param {string} avatar
 * @returns {boolean} - True if new high score was set
 */
export const updateHighScore = async (userId, newScore, message, username, avatar) => {
  try {
    const leaderboardDocRef = doc(firestore, COLLECTIONS.LEADERBOARD, userId);
    const docSnap = await getDoc(leaderboardDocRef);

    if (!docSnap.exists()) {
      // Create new entry
      await setDoc(leaderboardDocRef, {
        userId,
        username,
        avatar,
        highScore: newScore,
        message: message || '',
        lastUpdated: serverTimestamp(),
      });
      return true;
    }

    const currentHighScore = docSnap.data().highScore || 0;

    if (newScore > currentHighScore) {
      // New high score!
      await updateDoc(leaderboardDocRef, {
        highScore: newScore,
        message: message || '',
        username,
        avatar,
        lastUpdated: serverTimestamp(),
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error updating high score:', error);
    return false;
  }
};

/**
 * Get user's current high score
 * @param {string} userId
 */
export const getUserHighScore = async (userId) => {
  try {
    const docRef = doc(firestore, COLLECTIONS.LEADERBOARD, userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return 0;
    }

    return docSnap.data().highScore || 0;
  } catch (error) {
    console.error('Error getting user high score:', error);
    return 0;
  }
};

/**
 * Save a score record (not high score, just history)
 * @param {string} userId
 * @param {object} scoreData
 */
export const saveScoreRecord = async (userId, scoreData) => {
  try {
    const scoresRef = collection(firestore, COLLECTIONS.SCORES);
    await addDoc(scoresRef, {
      userId,
      ...scoreData,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving score record:', error);
  }
};
