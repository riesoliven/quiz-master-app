import { doc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { firestore, auth, COLLECTIONS } from './firebase';

/**
 * Delete all user data from Firestore and Authentication
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
export const deleteUserAccount = async (userId) => {
  try {
    console.log('Starting account deletion for user:', userId);

    // Delete from all Firestore collections
    const deletions = [
      // Delete user profile
      deleteDoc(doc(firestore, COLLECTIONS.USERS, userId)),

      // Delete leaderboard entry
      deleteDoc(doc(firestore, COLLECTIONS.LEADERBOARD, userId)),

      // Delete user stats
      deleteDoc(doc(firestore, COLLECTIONS.USER_STATS, userId)),
    ];

    // Delete all score records
    const scoresQuery = query(
      collection(firestore, COLLECTIONS.SCORES),
      where('userId', '==', userId)
    );
    const scoresSnapshot = await getDocs(scoresQuery);
    scoresSnapshot.forEach((doc) => {
      deletions.push(deleteDoc(doc.ref));
    });

    // Execute all Firestore deletions
    await Promise.all(deletions);
    console.log('Firestore data deleted successfully');

    // Delete from Firebase Authentication
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.uid === userId) {
      await deleteUser(currentUser);
      console.log('Auth user deleted successfully');
    }

    return true;
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};
