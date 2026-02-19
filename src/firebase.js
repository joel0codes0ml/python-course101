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
  where, // Added for Sector filtering
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";

// SECURITY REMINDER: In production, move these to a .env file!
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

// Keep the user logged in on refresh
setPersistence(auth, browserLocalPersistence)
  .catch((err) => console.error("Persistence Error:", err));

// Database with high-speed local caching
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ 
    tabManager: persistentMultipleTabManager() 
  })
});

// ================= AUTH HELPERS =================

export const signUpWithEmail = async (email, password, username) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update Firebase Auth Profile
  await updateProfile(cred.user, { 
    displayName: username,
    photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}` // Default avatar
  });
  
  // Create Extended Firestore Profile
  await createUserProfile(cred.user.uid, { 
    username, 
    email,
    photoURL: cred.user.photoURL 
  });
  
  return cred.user;
};

export const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);

// ================= USER & PROFILE HELPERS =================

export const createUserProfile = async (uid, data) => {
  const ref = doc(db, "users", uid);
  return setDoc(ref, {
    xp: 0,
    level: 1,
    streak: 0,
    gems: 0,
    bio: "New Zenin Student",
    links: { github: "", linkedin: "", website: "" }, // Social links
    completedLessons: [],
    sectorProgress: { web: 0, data: 0, ai: 0 }, // Tracking progress per sector
    createdAt: new Date().toISOString(),
    ...data,
  }, { merge: true });
};

/** * SPEED FIX: Real-time User Listener
 * Instead of one-time getDoc, this keeps the dashboard 
 * updated instantly when XP or streaks change.
 */
export const subscribeToUserData = (uid, callback) => {
  return onSnapshot(doc(db, "users", uid), (snap) => {
    if (snap.exists()) callback(snap.data());
  });
};

// ================= COURSE & SECTOR HELPERS =================

/** Fetch courses specifically for Web, Data Science, or AI */
export const subscribeToSectorCourses = (sectorId, callback) => {
  const q = query(
    collection(db, "courses"),
    where("sector", "==", sectorId),
    orderBy("order", "asc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

// ================= SOCIAL & LEADERBOARD =================

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


