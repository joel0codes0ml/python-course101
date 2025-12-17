import React, { useState, useEffect } from "react";
import { lessons } from "./lessons"; // Make sure the path matches your file name

export default function App() {
  const [user, setUser] = useState(localStorage.getItem("zenin_user") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("zenin_user"));
  
  // Progress starts from lesson 1 OR where they left off
  const [current, setCurrent] = useState(() => {
    const saved = localStorage.getItem("zenin_progress");
    return saved ? JSON.parse(saved) : lessons[0];
  });

  const [userCode, setUserCode] = useState(current.starterCode);

  // This saves their spot every time they click a new lesson
  useEffect(() => {
    setUserCode(current.starterCode);
    if (isLoggedIn) {
      localStorage.setItem("zenin_progress", JSON.stringify(current));
    }
  }, [current, isLoggedIn]);

  const handleLogin = (name) => {
    localStorage.setItem("zenin_user", name);
    setUser(name);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    // Render your Login Screen here (or import it from a Login.jsx file)
    return <LoginUI onLogin={handleLogin} />;
  }

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#0f172a" }}>
      {/* Your Sidebar mapping through the imported 'lessons' */}
      {/* Your Code Editor and Output */}
    </div>
  );
}
