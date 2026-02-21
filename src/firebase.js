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
  where,
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";

// SECURITY: Move these to Vercel Environment Variables (.env) for production!
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

// Persist session across refreshes
setPersistence(auth, browserLocalPersistence)
  .catch((err) => console.error("Auth Persistence Error:", err));

// Firestore with multi-tab offline support
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ 
    tabManager: persistentMultipleTabManager() 
  })
});

// ================= AUTHENTICATION =================

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

export const signUpWithEmail = async (email, password, username) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  
  await updateProfile(cred.user, { 
    displayName: username,
    photoURL: `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${username}`
  });
  
  await createUserProfile(cred.user.uid, { 
    username, 
    email,
    photoURL: cred.user.photoURL 
  });
  
  return cred.user;
};

export const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);

export const loginWithApple = async () => {
  const provider = new OAuthProvider('apple.com');
  return signInWithPopup(auth, provider);
};

export const logout = () => signOut(auth);

// ================= USER DATA & PROFILES =================

export const createUserProfile = async (uid, data) => {
  const ref = doc(db, "users", uid);
  return setDoc(ref, {
    xp: 0,
    level: 1,
    streak: 0,
    gems: 0,
    bio: "New Student",
    links: { instagram: "", linkedin: "", youtube: "" }, // UPDATED LINKS
    completedLessons: [],
    sectorProgress: { web: 0, data: 0, ai: 0, sys: 0 },
    createdAt: new Date().toISOString(),
    setupComplete: false, // Flag to trigger onboarding
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

export const subscribeToUserData = (uid, callback) => {
  return onSnapshot(doc(db, "users", uid), (snap) => {
    if (snap.exists()) callback(snap.data());
  });
};

// ================= GLOBAL DATA =================

export const subscribeLeaderboard = (callback) => {
  const q = query(
    collection(db, "users"), 
    orderBy("xp", "desc"), 
    limit(50) 
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
  });
};


