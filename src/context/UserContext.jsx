// src/context/UserContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({});

  // Listen for auth state changes
  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        setProgress({});
        return;
      }

      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        // Create initial user profile
        await setDoc(ref, {
          username: u.email.split("@")[0],
          xp: 0,
          streak: 1,
          completed: {}
        });
      }

      const data = snap.exists() ? snap.data() : {};
      setUser({ uid: u.uid, ...data });
      setProgress(data.completed || {});
    });
  }, []);

  // Mark a lesson as complete
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
    setUser((prev) => ({ ...prev, xp: prev.xp + 10 }));
  };

  return (
    <UserContext.Provider value={{ user, progress, completeLesson }}>
      {children}
    </UserContext.Provider>
  );
};


