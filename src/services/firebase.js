// Firebase configuration using JavaScript SDK (compatible with Expo)
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5pkuyk7u3UDqwLW-eodEVg3NPwFtW1F0",
  authDomain: "battle-of-the-brains-d2eae.firebaseapp.com",
  projectId: "battle-of-the-brains-d2eae",
  storageBucket: "battle-of-the-brains-d2eae.firebasestorage.app",
  messagingSenderId: "236365066873",
  appId: "1:236365066873:web:c38236edae74bad9db1aa8"
};

// Initialize Firebase only if not already initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Get Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);

// Export Firebase services
export { auth, firestore };

// Firestore Collections
export const COLLECTIONS = {
  USERS: 'users',
  LEADERBOARD: 'leaderboard',
  SCORES: 'scores',
  USER_STATS: 'userStats'
};
