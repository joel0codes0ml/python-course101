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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence)
  .catch((err) => console.error("Auth Persistence Error:", err));

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ 
    tabManager: persistentMultipleTabManager() 
  })
});

// ================= AUTHENTICATION =================

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

export const signUpWithEmail = async (email, password, username) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const photo = `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${username}`;
  
  await updateProfile(cred.user, { displayName: username, photoURL: photo });
  
  // We trigger the creation, but we don't necessarily need to "await" it 
  // if we want the UI to snap to the dashboard immediately.
  createUserProfile(cred.user.uid, { username, email, photoURL: photo });
  
  return cred.user;
};

export const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

// ================= USER DATA & PROFILES =================

export const createUserProfile = async (uid, data) => {
  const ref = doc(db, "users", uid);
  const tempId = Math.floor(1000 + Math.random() * 9000);

  return setDoc(ref, {
    xp: 0,
    dailyExecutions: 0, // Track the 25 runs limit
    streak: 1,
    bio: "", 
    username: data.username || `NINJA_${tempId}`,
    links: { instagram: "", linkedin: "", youtube: "" },
    sectorProgress: { web: 0, data: 0, ai: 0, sys: 0 },
    setupComplete: true, // SILENT ONBOARDING: Set to true immediately
    createdAt: new Date().toISOString(),
    ...data,
  }, { merge: true });
};

export const updateUserProfile = async (uid, data) => {
  const ref = doc(db, "users", uid);
  return updateDoc(ref, data);
};

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

// Real-time listener so XP and Runs update without refreshing
export const subscribeToUserData = (uid, callback) => {
  return onSnapshot(doc(db, "users", uid), (snap) => {
    if (snap.exists()) callback(snap.data());
  });
};

// ================= GLOBAL DATA =================

export const subscribeLeaderboard = (callback) => {
  const q = query(collection(db, "users"), orderBy("xp", "desc"), limit(50));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
  });
};


