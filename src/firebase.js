
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

/** 1️⃣ Initialize Firebase */
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER",
  appId: "YOUR_APP_ID"
};
const app = initializeApp(firebaseConfig);

/** 2️⃣ Auth + Firestore exports */
export const auth = getAuth(app);
export const db = getFirestore(app);

/** 3️⃣ Auth Utilities */
export const signUpWithEmail = async (email, password, username) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: username });
  return userCredential.user;
};

export const loginWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const loginWithApple = async () => {
  const provider = new OAuthProvider("apple.com");
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const logout = async () => await signOut(auth);

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

/** 4️⃣ Firestore Utilities */
export const createUserProfile = async (uid, data) => {
  const defaultData = { xp: 0, completedLessons: [], online: true };
  await setDoc(doc(db, "users", uid), { ...defaultData, ...data });
};

export const getUserProfile = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateUserProfile = async (uid, updates) => {
  await updateDoc(doc(db, "users", uid), updates);
};

// Listen to all users for leaderboard (live)
export const subscribeLeaderboard = (callback) => {
  const q = query(collection(db, "users"), orderBy("xp", "desc"));
  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    callback(users);
  });
};


