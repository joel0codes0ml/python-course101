import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
  OAuthProvider,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import {
  initializeFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC4iHWhpIWiDrkDK-bgYUHJcui_7Y54pwk",
  authDomain: "zeninlabs-546ab.firebaseapp.com",
  projectId: "zeninlabs-546ab",
  storageBucket: "zeninlabs-546ab.firebasestorage.app",
  messagingSenderId: "790058421720",
  appId: "1:790058421720:web:cbe60501b037a560a2f6ad",
};

// --- INITIALIZATION ---
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Persist session across refreshes
setPersistence(auth, browserLocalPersistence)
  .catch((err) => console.error("Persistence Error:", err));

// High-speed Database initialization
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ 
    tabManager: persistentMultipleTabManager() 
  })
});

// ================= AUTH HELPERS =================

export const signUpWithEmail = async (email, password, username) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: username });
  
  // Create the initial database entry immediately after signup
  await createUserProfile(cred.user.uid, { 
    username: username,
    email: email 
  });
  
  return cred.user;
};

export const loginWithEmail = async (email, password) => {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
};

export const loginWithApple = async () => {
  const provider = new OAuthProvider("apple.com");
  const res = await signInWithPopup(auth, provider);
  return res.user;
};

export const logout = () => signOut(auth);
export const onAuthChange = (cb) => onAuthStateChanged(auth, cb);

// ================= FIRESTORE HELPERS =================

/** Creates profile with Streak and Tier support */
export const createUserProfile = async (uid, data) => {
  const ref = doc(db, "users", uid);
  return setDoc(ref, {
    xp: 0,
    dailyExecutions: 0, 
    streak: 0,                // Added for tracking
    lastExecutionDate: "",    // Added for tracking
    isPro: false,
    completedLessons: [],
    online: true,
    createdAt: new Date().toISOString(),
    ...data,
  }, { merge: true });
};

export const getUserProfile = async (uid) => {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error("Fetch profile failed:", e);
    return null;
  }
};

/** Optimized update function used by CodeEditor */
export const updateUserProfile = async (uid, updates) => {
  if (!uid) return;
  const ref = doc(db, "users", uid);
  return updateDoc(ref, updates);
};

/** REAL-TIME LEADERBOARD 
 * Fetches top 100 to ensure all 5 tiers (20 per tier) have data
 */
export const subscribeLeaderboard = (callback) => {
  const q = query(
    collection(db, "users"), 
    orderBy("xp", "desc"), 
    limit(100) 
  );
  
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
  });
};


