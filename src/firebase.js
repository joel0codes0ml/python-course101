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
  setPersistence,           // ADDED
  browserLocalPersistence   // ADDED
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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// 1. SESSION PERSISTENCE FIX: This keeps users logged in on reload
setPersistence(auth, browserLocalPersistence)
  .catch((err) => console.error("Persistence Error:", err));

// 2. SPEED FIX: Removed Long Polling (WebSockets are faster)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ 
    tabManager: persistentMultipleTabManager() 
  })
});

// ================= AUTH HELPERS =================

export const signUpWithEmail = async (email, password, username) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  updateProfile(cred.user, { displayName: username }).catch(e => console.error(e));
  return cred.user;
};

export const loginWithEmail = async (email, password) => {
  return (await signInWithEmailAndPassword(auth, email, password)).user;
};

export const loginWithApple = async () => {
  const provider = new OAuthProvider("apple.com");
  return (await signInWithPopup(auth, provider)).user;
};

export const logout = () => signOut(auth);
export const onAuthChange = (cb) => onAuthStateChanged(auth, cb);

// ================= FIRESTORE HELPERS =================

export const createUserProfile = async (uid, data) => {
  const ref = doc(db, "users", uid);
  return setDoc(ref, {
    xp: 0,
    dailyExecutions: 0, // Added to track the 12 runs
    isPro: false,
    completedLessons: [],
    online: true,
    createdAt: new Date().toISOString(),
    ...data,
  }, { merge: true });
};

export const getUserProfile = async (uid) => {
  // Use a "try/catch" to prevent infinite hanging
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

export const subscribeLeaderboard = (callback) => {
  const q = query(collection(db, "users"), orderBy("xp", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
  });
};


