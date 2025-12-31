import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 1. Initialize State from LocalStorage
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('coddy_user')) || {
    username: "",
    points: 0,
    referral: "",
    joinedDate: new Date().toLocaleDateString()
  });

  const [completedLessons, setCompletedLessons] = useState(
    JSON.parse(localStorage.getItem('coddy_progress')) || { python: [], sql: [], html: [], go: [] }
  );

  // 2. Persistent Saving
  useEffect(() => {
    localStorage.setItem('coddy_user', JSON.stringify(user));
    localStorage.setItem('coddy_progress', JSON.stringify(completedLessons));
  }, [user, completedLessons]);

  // 3. iPhone Sound Logic
  const playSuccessSound = () => {
    const audio = new Audio('https://www.soundjay.com/phone/sounds/iphone-sms-tone.mp3');
    audio.play().catch(e => console.log("Sound blocked by browser"));
  };

  const markComplete = (course, id) => {
    if (!completedLessons[course].includes(id)) {
      setCompletedLessons(prev => ({
        ...prev,
        [course]: [...prev[course], id]
      }));
      setUser(prev => ({ ...prev, points: prev.points + 10 }));
      playSuccessSound();
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, completedLessons, markComplete }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
