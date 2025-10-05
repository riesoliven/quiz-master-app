import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  limit,
  orderBy
} from 'firebase/firestore';
import { firestore, COLLECTIONS } from './firebase';

/**
 * Fetch random questions from Firestore by difficulty and subject
 * @param {string} difficulty - easy, average, difficult, impossible
 * @param {number} count - number of questions to fetch
 * @param {Array<string>} subjects - array of subject names to filter by (optional)
 * @returns {Promise<Array>} Array of question objects
 */
export const getQuestionsByDifficulty = async (difficulty, count, subjects = null) => {
  try {
    let q;

    if (subjects && subjects.length > 0) {
      // Query with subject filter
      q = query(
        collection(firestore, COLLECTIONS.QUESTIONS),
        where('difficulty', '==', difficulty),
        where('subject', 'in', subjects)
      );
    } else {
      // Query without subject filter
      q = query(
        collection(firestore, COLLECTIONS.QUESTIONS),
        where('difficulty', '==', difficulty)
      );
    }

    const snapshot = await getDocs(q);
    const questions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Shuffle and return requested count
    const shuffled = questions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  } catch (error) {
    console.error(`Error fetching ${difficulty} questions:`, error);
    return [];
  }
};

/**
 * Get quiz questions with proper difficulty progression
 * @param {Object} config - Configuration object
 * @param {Array<string>} config.subjects - Subject names to include
 * @param {Object} config.distribution - { easy: 5, average: 4, difficult: 3, impossible: 2 }
 * @returns {Promise<Array>} Array of 14 questions in difficulty order
 */
export const getQuizQuestions = async (config = {}) => {
  const {
    subjects = null, // null means all subjects
    distribution = { easy: 5, average: 4, difficult: 3, impossible: 2 }
  } = config;

  const questions = [];

  try {
    // Fetch questions for each difficulty level in order
    for (const [difficulty, count] of Object.entries(distribution)) {
      const difficultyQuestions = await getQuestionsByDifficulty(
        difficulty,
        count,
        subjects
      );
      questions.push(...difficultyQuestions);
    }

    return questions.slice(0, 14); // Ensure exactly 14 questions
  } catch (error) {
    console.error('Error generating quiz:', error);
    return [];
  }
};

/**
 * Add a new question to Firestore
 * @param {Object} question - Question object
 * @returns {Promise<string>} Document ID of created question
 */
export const addQuestion = async (question) => {
  try {
    const docRef = await addDoc(collection(firestore, COLLECTIONS.QUESTIONS), {
      ...question,
      createdAt: new Date().toISOString()
    });
    console.log('Question added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
};

/**
 * Get all questions (for admin/debugging purposes)
 * @returns {Promise<Array>} All questions
 */
export const getAllQuestions = async () => {
  try {
    const snapshot = await getDocs(collection(firestore, COLLECTIONS.QUESTIONS));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching all questions:', error);
    return [];
  }
};

/**
 * Get question count by subject and difficulty
 * @returns {Promise<Object>} Count statistics
 */
export const getQuestionStats = async () => {
  try {
    const snapshot = await getDocs(collection(firestore, COLLECTIONS.QUESTIONS));
    const stats = {};

    snapshot.docs.forEach(doc => {
      const { subject, difficulty } = doc.data();
      if (!stats[subject]) {
        stats[subject] = { easy: 0, average: 0, difficult: 0, impossible: 0 };
      }
      if (stats[subject][difficulty] !== undefined) {
        stats[subject][difficulty]++;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error fetching question stats:', error);
    return {};
  }
};
