import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
  OAuthProvider,
  onAuthStateChanged
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

// SPEED FIX: Optimized for Vercel/Web production
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
  // This helps multiple tabs share the connection so it stays "warm"
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

// ================= AUTH HELPERS =================

export const signUpWithEmail = async (email, password, username) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  
  // RUN IN BACKGROUND: Don't wait for the display name update to finish
  updateProfile(cred.user, { displayName: username }).catch(e => console.error("Profile update failed", e));
  
  return cred.user;
};

export const loginWithEmail = async (email, password) => {
  // Simple, direct login
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
};

export const loginWithApple = async () => {
  const provider = new OAuthProvider("apple.com");
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const logout = () => signOut(auth);
export const onAuthChange = (cb) => onAuthStateChanged(auth, cb);

// ================= FIRESTORE HELPERS =================

export const createUserProfile = async (uid, data) => {
  const ref = doc(db, "users", uid);
  // Set and forget
  return setDoc(ref, {
    xp: 0,
    completedLessons: [],
    online: true,
    createdAt: new Date().toISOString(),
    ...data,
  }, { merge: true }); // Merge true prevents overwriting if double-called
};

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
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


