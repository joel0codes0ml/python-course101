import React, { useState, useEffect } from "react";
import { lessons as pythonLessons } from "./lessons";
import { htmlLessons } from "./courses/html";
import Login from "./Login";

export default function App() {
  const [user, setUser] = useState(localStorage.getItem("zenin_user") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("zenin_user"));
  const [course, setCourse] = useState("python");

  const lessons = course === "python" ? pythonLessons : htmlLessons;
  const [current, setCurrent] = useState(lessons[0]);
  const [userCode, setUserCode] = useState(lessons[0].starterCode);
  const [output, setOutput] = useState("");

  useEffect(() => {
    setCurrent(lessons[0]);
    setUserCode(lessons[0].starterCode);
    setOutput("");
  }, [course]);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("zenin_progress", JSON.stringify({ course, current }));
    }
  }, [current, course, isLoggedIn]);

  const handleLogin = (name) => {
    localStorage.setItem("zenin_user", name);
    setUser(name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("zenin_user");
    localStorage.removeItem("zenin_progress");
    setIsLoggedIn(false);
    setUser("");
  };

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#0f172a", color: "#fff" }}>
      {/* Sidebar */}
      <div style={{ width: "300px", background: "#1e293b", borderRight: "2px solid #ef4444", overflowY: "auto" }}>
        <div style={{ padding: "20px", textAlign: "center", borderBottom: "1px solid #334155" }}>
          <h2 style={{ fontFamily: "monospace", letterSpacing: "2px" }}>ZENIN<span style={{ color: "#ef4444" }}>LABS</span></h2>
          <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "10px" }}>LOGOUT</button>
        </div>

        {/* Course Switch */}
        <div style={{ display: "flex", gap: "8px", padding: "10px" }}>
          <button onClick={() => setCourse("python")} style={courseBtn(course === "python")}>Python</button>
          <button onClick={() => setCourse("html")} style={courseBtn(course === "html")}>HTML</button>
        </div>

        {/* Lesson List */}
        {lessons.map((l) => (
          <div
            key={l.id}
            onClick={() => { setCurrent(l); setUserCode(l.starterCode); setOutput(""); }}
            style={{
              padding: "15px",
              cursor: "pointer",
              borderBottom: "1px solid #334155",
              background: current.id === l.id ? "#ef444422" : "transparent",
              color: current.id === l.id ? "#ef4444" : "#fff"
            }}
          >
            {l.title}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
        <h1>{current.title}</h1>
        <p style={{ background: "#1e293b", padding: "20px", borderRadius: "10px" }}>{current.content}</p>

        <textarea
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          style={{
            width: "100%",
            height: "300px",
            background: "#000",
            color: "#4ade80",
            padding: "20px",
            fontFamily: "monospace",
            borderRadius: "10px",
            border: "1px solid #334155"
          }}
        />

        <button
          onClick={() => setOutput(">>> Code executed successfully")}
          style={{
            marginTop: "20px",
            padding: "12px 30px",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          RUN ▶
        </button>

        {output && (
          <div style={{
            marginTop: "20px",
            padding: "20px",
            background: "#000",
            color: "#4ade80",
            fontFamily: "monospace",
            borderRadius: "5px"
          }}>
            {output}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper for course buttons
function courseBtn(active) {
  return {
    flex: 1,
    padding: "8px",
    background: active ? "#ef4444" : "#334155",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  };
}
