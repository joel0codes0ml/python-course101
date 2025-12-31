import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (!u) return setUser(null);

      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          username: u.email.split("@")[0],
          xp: 0,
          streak: 1,
          completed: {}
        });
      }

      setUser({ uid: u.uid, ...snap.data() });
      setProgress(snap.data().completed || {});
    });
  }, []);

  const completeLesson = async (course, id) => {
    if (progress?.[course]?.includes(id)) return;

    const ref = doc(db, "users", user.uid);
    const updated = {
      ...progress,
      [course]: [...(progress[course] || []), id]
    };

    await updateDoc(ref, {
      completed: updated,
      xp: user.xp + 10
    });

    setProgress(updated);
    setUser(prev => ({ ...prev, xp: prev.xp + 10 }));
  };

  return (
    <UserContext.Provider value={{ user, progress, completeLesson }}>
      {children}
    </UserContext.Provider>
  );
};

