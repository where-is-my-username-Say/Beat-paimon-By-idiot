import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, get, query, orderByChild, limitToLast } from 'firebase/database';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

// Firebase configuration (public config - safe to expose)
const firebaseConfig = {
  apiKey: "AIzaSyDqVxH_wZ8kN5Y6xJ3mR7pL4tQ9sU2vW1x",
  authDomain: "duck-clicker-game.firebaseapp.com",
  databaseURL: "https://duck-clicker-game-default-rtdb.firebaseio.com",
  projectId: "duck-clicker-game",
  storageBucket: "duck-clicker-game.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Leaderboard functions
export const submitScore = async (playerName, score, kills) => {
  try {
    const leaderboardRef = ref(database, 'leaderboard');
    const newScoreRef = push(leaderboardRef);
    await set(newScoreRef, {
      playerName,
      score: Math.floor(score),
      kills,
      timestamp: Date.now()
    });
    return true;
  } catch (error) {
    console.error('Error submitting score:', error);
    return false;
  }
};

export const getTopScores = async (limit = 10) => {
  try {
    const leaderboardRef = ref(database, 'leaderboard');
    const topScoresQuery = query(leaderboardRef, orderByChild('score'), limitToLast(limit));
    const snapshot = await get(topScoresQuery);
    
    if (snapshot.exists()) {
      const scores = [];
      snapshot.forEach((childSnapshot) => {
        scores.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      // Sort in descending order
      return scores.reverse();
    }
    return [];
  } catch (error) {
    console.error('Error getting top scores:', error);
    return [];
  }
};

// Auth functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return null;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
};

export { auth };

