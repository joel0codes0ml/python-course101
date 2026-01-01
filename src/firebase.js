// src/firebase.js

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  signInWithPopup, 
  OAuthProvider 
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

/**
 * 1️⃣ Initialize Firebase
 */
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);

/**
 * 2️⃣ Auth + Firestore exports
 */
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * 3️⃣ Auth Utilities
 */

// Sign up with Email + Password
export const signUpWithEmail = async (email, password, username) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: username });
  return userCredential.user;
};

// Login with Email + Password
export const loginWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Login with Apple
export const loginWithApple = async () => {
  const provider = new OAuthProvider("apple.com");
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

// Logout
export const logout = async () => await signOut(auth);

/**
 * 4️⃣ Firestore Utilities
 */

// Create user profile document after signup
export const createUserProfile = async (uid, data) => {
  await setDoc(doc(db, "users", uid), data);
};

// Get user profile
export const getUserProfile = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

// Update user profile (XP, completed lessons, onboarding answers)
export const updateUserProfile = async (uid, updates) => {
  await updateDoc(doc(db, "users", uid), updates);
};

