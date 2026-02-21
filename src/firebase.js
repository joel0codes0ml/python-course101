import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  OAuthProvider,
  signInWithPopup
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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence)
  .catch((err) => console.error("Auth Persistence Error:", err));

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ 
    tabManager: persistentMultipleTabManager() 
  })
});

// --- AUTH ---
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

/**
 * TURBO SIGN UP: 
 * We await ONLY the account creation. 
 * Profile and Firestore updates run in the background so the user 
 * hits the dashboard in record time.
 */
export const signUpWithEmail = async (email, password, username) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const photo = `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${username}`;
  
  // Background tasks: We don't 'await' these, letting the user proceed immediately.
  updateProfile(cred.user, { displayName: username, photoURL: photo });
  createUserProfile(cred.user.uid, { username, email, photoURL: photo });

  return cred.user;
};

export const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);

// APPLE LOGIN EXPORT (Satisfies Login.jsx imports)
export const loginWithApple = async () => {
  const provider = new OAuthProvider('apple.com');
  return signInWithPopup(auth, provider);
};

// --- USER DATA ---
export const createUserProfile = async (uid, data) => {
  const ref = doc(db, "users", uid);
  const tempId = Math.floor(1000 + Math.random() * 9000);
  
  // Returning the promise without blocking the UI flow
  return setDoc(ref, {
    xp: 0,
    username: data.username || `NINJA_${tempId}`,
    bio: "", 
    links: { instagram: "", linkedin: "", youtube: "" },
    sectorProgress: { web: 0, data: 0, ai: 0, sys: 0 },
    streak: 1,
    setupComplete: true, // SPEEDRUN: No longer blocks the dashboard
    createdAt: new Date().toISOString(),
    ...data,
  }, { merge: true });
};

export const updateUserProfile = (uid, data) => updateDoc(doc(db, "users", uid), data);
export const getUserProfile = async (uid) => (await getDoc(doc(db, "users", uid))).data();
export const subscribeToUserData = (uid, callback) => onSnapshot(doc(db, "users", uid), (s) => s.exists() && callback(s.data()));

export const subscribeLeaderboard = (callback) => {
  const q = query(collection(db, "users"), orderBy("xp", "desc"), limit(50));
  return onSnapshot(q, (snap) => callback(snap.docs.map(d => ({ uid: d.id, ...d.data() }))));
};


