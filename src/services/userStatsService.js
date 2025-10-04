import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { firestore, COLLECTIONS } from './firebase';

/**
 * Initialize user stats document
 * @param {string} userId
 */
export const initializeUserStats = async (userId) => {
  try {
    const statsDocRef = doc(firestore, COLLECTIONS.USER_STATS, userId);
    const statsDoc = await getDoc(statsDocRef);

    if (!statsDoc.exists()) {
      await setDoc(statsDocRef, {
        userId,
        overallAccuracy: 0,
        totalQuestionsAnswered: 0,
        totalQuestionsCorrect: 0,
        subjects: {
          'Arithmetic & Algebra': { correct: 0, total: 0, accuracy: 0 },
          'Geometry & Trigonometry': { correct: 0, total: 0, accuracy: 0 },
          'Statistics & Probability': { correct: 0, total: 0, accuracy: 0 },
          'Physics': { correct: 0, total: 0, accuracy: 0 },
          'Chemistry': { correct: 0, total: 0, accuracy: 0 },
          'Biology': { correct: 0, total: 0, accuracy: 0 },
          'History': { correct: 0, total: 0, accuracy: 0 },
          'Sports & Entertainment': { correct: 0, total: 0, accuracy: 0 },
          'Literature': { correct: 0, total: 0, accuracy: 0 },
          'Astronomy': { correct: 0, total: 0, accuracy: 0 }
        },
        lastUpdated: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error initializing user stats:', error);
  }
};

/**
 * Update user stats after a quiz
 * @param {string} userId
 * @param {Array} questionResults - Array of {subject, isCorrect}
 */
export const updateUserStats = async (userId, questionResults) => {
  try {
    const statsDocRef = doc(firestore, COLLECTIONS.USER_STATS, userId);
    const statsDoc = await getDoc(statsDocRef);

    if (!statsDoc.exists()) {
      await initializeUserStats(userId);
    }

    const currentStats = statsDoc.exists() ? statsDoc.data() : null;
    const subjectUpdates = {};

    // Calculate updates for each subject
    questionResults.forEach(({ subject, isCorrect }) => {
      if (!subjectUpdates[subject]) {
        subjectUpdates[subject] = { correct: 0, total: 0 };
      }
      subjectUpdates[subject].total += 1;
      if (isCorrect) {
        subjectUpdates[subject].correct += 1;
      }
    });

    // Build Firestore update object
    const updates = {
      totalQuestionsAnswered: increment(questionResults.length),
      totalQuestionsCorrect: increment(
        questionResults.filter(r => r.isCorrect).length
      ),
      lastUpdated: serverTimestamp()
    };

    // Update each subject
    for (const [subject, change] of Object.entries(subjectUpdates)) {
      const currentSubject = currentStats?.subjects?.[subject] || { correct: 0, total: 0 };
      const newCorrect = currentSubject.correct + change.correct;
      const newTotal = currentSubject.total + change.total;
      const newAccuracy = newTotal > 0 ? Math.round((newCorrect / newTotal) * 100) : 0;

      updates[`subjects.${subject}.correct`] = newCorrect;
      updates[`subjects.${subject}.total`] = newTotal;
      updates[`subjects.${subject}.accuracy`] = newAccuracy;
    }

    // Calculate overall accuracy
    const totalCorrect = (currentStats?.totalQuestionsCorrect || 0) +
      questionResults.filter(r => r.isCorrect).length;
    const totalAnswered = (currentStats?.totalQuestionsAnswered || 0) + questionResults.length;
    updates.overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    await updateDoc(statsDocRef, updates);
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
};

/**
 * Get user stats
 * @param {string} userId
 * @returns {Object} User stats
 */
export const getUserStats = async (userId) => {
  try {
    const statsDocRef = doc(firestore, COLLECTIONS.USER_STATS, userId);
    const statsDoc = await getDoc(statsDocRef);

    if (!statsDoc.exists()) {
      await initializeUserStats(userId);
      return {
        overallAccuracy: 0,
        totalQuestionsAnswered: 0,
        totalQuestionsCorrect: 0,
        subjects: {}
      };
    }

    return statsDoc.data();
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      overallAccuracy: 0,
      totalQuestionsAnswered: 0,
      totalQuestionsCorrect: 0,
      subjects: {}
    };
  }
};

/**
 * Get top N subjects for a user
 * @param {string} userId
 * @param {number} limit
 * @returns {Array} Top subjects sorted by accuracy
 */
export const getTopSubjects = async (userId, limit = 3) => {
  try {
    const stats = await getUserStats(userId);

    if (!stats.subjects) return [];

    const subjectsArray = Object.entries(stats.subjects)
      .map(([name, data]) => ({
        name,
        ...data
      }))
      .filter(s => s.total > 0) // Only include subjects with attempts
      .sort((a, b) => b.accuracy - a.accuracy); // Sort by accuracy descending

    return subjectsArray.slice(0, limit);
  } catch (error) {
    console.error('Error getting top subjects:', error);
    return [];
  }
};
