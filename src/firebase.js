// src/firebase.js
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
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

// 🔥 Firebase config (YOUR REAL PROJECT)
const firebaseConfig = {
  apiKey: "AIzaSyC4iHWhpIWiDrkDK-bgYUHJcui_7Y54pwk",
  authDomain: "zeninlabs-546ab.firebaseapp.com",
  projectId: "zeninlabs-546ab",
  storageBucket: "zeninlabs-546ab.firebasestorage.app",
  messagingSenderId: "790058421720",
  appId: "1:790058421720:web:cbe60501b037a560a2f6ad",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth & DB
export const auth = getAuth(app);
export const db = getFirestore(app);

// ================= AUTH HELPERS =================

export const signUpWithEmail = async (email, password, username) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: username });
  return cred.user;
};

export const loginWithEmail = async (email, password) => {
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
  await setDoc(ref, {
    xp: 0,
    completedLessons: [],
    online: true,
    ...data,
  });
};

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

export const updateUserProfile = async (uid, updates) => {
  await updateDoc(doc(db, "users", uid), updates);
};

export const subscribeLeaderboard = (callback) => {
  const q = query(collection(db, "users"), orderBy("xp", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
  });
};




