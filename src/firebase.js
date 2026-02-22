// src/firebase.js

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  OAuthProvider,
  signInWithPopup
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
  orderBy,
  limit
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
export const db = getFirestore(app);

// --- AUTH ---
export const onAuthChange = (callback) =>
  onAuthStateChanged(auth, callback);

export const signUpWithEmail = async (email, password, username) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  const photo = `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${username}`;

  // Fire and forget (non-blocking)
  updateProfile(cred.user, { displayName: username, photoURL: photo });

  createUserProfile(cred.user.uid, {
    username,
    email,
    photoURL: photo
  });

  return cred.user;
};

export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

export const loginWithApple = async () => {
  const provider = new OAuthProvider("apple.com");
  return signInWithPopup(auth, provider);
};

// --- USER DATA ---
export const createUserProfile = async (uid, data) => {
  const ref = doc(db, "users", uid);
  const tempId = Math.floor(1000 + Math.random() * 9000);

  return setDoc(
    ref,
    {
      xp: 0,
      username: data.username || `NINJA_${tempId}`,
      bio: "",
      links: { instagram: "", linkedin: "", youtube: "" },
      sectorProgress: { web: 0, data: 0, ai: 0, sys: 0 },
      streak: 1,
      setupComplete: true,
      createdAt: new Date().toISOString(),
      ...data
    },
    { merge: true }
  );
};

export const updateUserProfile = (uid, data) =>
  updateDoc(doc(db, "users", uid), data);

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

export const subscribeToUserData = (uid, callback) =>
  onSnapshot(doc(db, "users", uid), (s) => {
    if (s.exists()) callback(s.data());
  });

export const subscribeLeaderboard = (callback) => {
  const q = query(
    collection(db, "users"),
    orderBy("xp", "desc"),
    limit(50)
  );

  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ uid: d.id, ...d.data() })))
  );
};
