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

// High-speed Database initialization with Local Caching
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ 
    tabManager: persistentMultipleTabManager() 
  })
});

// ================= AUTH HELPERS =================

/** * OPTIMIZED SIGNUP: 
 * Takes the user to the app instantly while processing profile in background.
 */
export const signUpWithEmail = async (email, password, username) => {
  // 1. Only wait for the account creation (The critical part)
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  
  // 2. BACKGROUND TASKS: We DO NOT 'await' these. 
  // They run while the user is already being redirected to the dashboard.
  updateProfile(cred.user, { displayName: username }).catch(e => console.error("BG Profile Update Error:", e));
  
  createUserProfile(cred.user.uid, { 
    username: username,
    email: email 
  }).catch(e => console.error("BG DB Creation Error:", e));
  
  // 3. Return immediately
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
    streak: 0,
    lastExecutionDate: "",
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

/** Optimized update function used by CodeEditor & Payments */
export const updateUserProfile = async (uid, updates) => {
  if (!uid) return;
  const ref = doc(db, "users", uid);
  return updateDoc(ref, updates);
};

/** REAL-TIME LEADERBOARD */
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


