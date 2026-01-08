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

// Keep users logged in after refresh
setPersistence(auth, browserLocalPersistence)
  .catch((err) => console.error("Persistence Error:", err));

// High-speed Database initialization (WebSockets + Local Cache)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ 
    tabManager: persistentMultipleTabManager() 
  })
});

// ================= AUTH HELPERS (COMPLETE) =================

export const signUpWithEmail = async (email, password, username) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: username });
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

// ================= FIRESTORE HELPERS (OPTIMIZED) =================

/** Creates the ninja profile with League support */
export const createUserProfile = async (uid, data) => {
  const ref = doc(db, "users", uid);
  return setDoc(ref, {
    xp: 0,
    dailyExecutions: 0, 
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

export const updateUserProfile = async (uid, updates) => {
  const ref = doc(db, "users", uid);
  return updateDoc(ref, updates);
};

/** * REAL-TIME LEADERBOARD (Top 30 Ninjas)
 * This limit(30) ensures fast performance as your user base grows.
 */
export const subscribeLeaderboard = (callback) => {
  const q = query(
    collection(db, "users"), 
    orderBy("xp", "desc"), 
    limit(30)
  );
  
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
  });
};


