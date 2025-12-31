import React, { useState, useEffect, useRef } from "react";
import Login from "./Login";
import {
  htmlLessons, pythonLessons, clLessons, cppLessons,
  cssLessons, goLessons, sqlLessons, rLessons,
} from "./courses/index.js";

export default function App() {
  const [user, setUser] = useState(localStorage.getItem("zenin_user") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("zenin_user"));
  const [course, setCourse] = useState("python");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // MASCOT & PROGRESS STATE
  const [mascotMsg, setMascotMsg] = useState("Welcome back, Ninja! Ready to code?");
  const [progress, setProgress] = useState(JSON.parse(localStorage.getItem("zenin_stats")) || {
    python: 0, html: 0, c: 0, cpp: 0, css: 0, go: 0, sql: 0, r: 0
  });

  const allCourses = {
    python: pythonLessons || [],
    html: htmlLessons || [],
    c: clLessons || [],
    cpp: cppLessons || [],
    css: cssLessons || [],
    go: goLessons || [],
    sql: sqlLessons || [],
    r: rLessons || [],
  };

  const lessons = allCourses[course] || [];
  const [current, setCurrent] = useState(lessons[0] || { id: 1, title: "Loading...", content: "", starterCode: "" });
  const [userCode, setUserCode] = useState(current?.starterCode || "");

  // SOUND EFFECT
  const playSuccess = () => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3"); // iPhone-style chime
    audio.play();
  };

  useEffect(() => {
    if (lessons.length > 0) {
      setCurrent(lessons[0]);
      setUserCode(lessons[0].starterCode);
      setOutput("");
    }
  }, [course]);

  // REAL CODE EXECUTION
  const handleRunCode = async () => {
    setIsLoading(true);
    setMascotMsg("Analyzing your scrolls...");
    
    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: course === 'c' ? 'c' : course === 'cpp' ? 'cpp' : course,
          version: "*",
          files: [{ content: userCode }],
        }),
      });

      const data = await response.json();
      const result = data.run.output || data.run.stderr;
      setOutput(result);

      if (data.run.stderr) {
        setMascotMsg("⚠️ A bug in your jutsu! Look at the error message.");
      } else {
        // Progress Logic (2.5% per lesson)
        playSuccess();
        setMascotMsg("✅ Excellent! 2.5% Progress Gained!");
        const newProgress = { ...progress, [course]: Math.min(progress[course] + 2.5, 100) };
        setProgress(newProgress);
        localStorage.setItem("zenin_stats", JSON.stringify(newProgress));
      }
    } catch (err) {
      setOutput("Connection Error: Execution failed.");
      setMascotMsg("The server is currently sealed. Try again later.");
    }
    setIsLoading(false);
  };

  const handleLogin = (name) => {
    localStorage.setItem("zenin_user", name);
    setUser(name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser("");
  };

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#0f172a", color: "#fff", fontFamily: 'monospace' }}>
      {/* SIDEBAR */}
      <div style={{ width: "300px", background: "#1e293b", borderRight: "2px solid #ef4444", display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: "20px", textAlign: "center", borderBottom: "1px solid #334155" }}>
          <h2 style={{ letterSpacing: "2px" }}>ZENIN<span style={{ color: "#ef4444" }}>LABS</span></h2>
          <div style={{fontSize: '12px', color: '#4ade80'}}>Ninja: {user} | {progress[course]}%</div>
          <button onClick={handleLogout} style={{ color: "#64748b", cursor: "pointer", fontSize: "10px", background: 'none', border: 'none' }}>LOGOUT</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: '1fr 1fr', gap: "4px", padding: "10px" }}>
          {Object.keys(allCourses).map((c) => (
            <button key={c} onClick={() => setCourse(c)} style={courseBtn(course === c)}>{c.toUpperCase()}</button>
          ))}
        </div>

        <div style={{ overflowY: "auto", flex: 1 }}>
          {lessons.map((l) => (
            <div key={l.id} onClick={() => { setCurrent(l); setUserCode(l.starterCode); }} style={lessonLink(current.id === l.id)}>
              {l.title}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: "30px", overflowY: "auto", position: 'relative' }}>
        {/* MASCOT COMPONENT */}
        <div style={mascotContainer}>
            <div style={speechBubble}>{mascotMsg}</div>
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Zenin" style={mascotImg} alt="Mascot" />
        </div>

        <h1>{current.title}</h1>
        <p style={{ background: "#1e293b", padding: "15px", borderRadius: "10px", borderLeft: '4px solid #ef4444' }}>{current.content}</p>

        <textarea value={userCode} onChange={(e) => setUserCode(e.target.value)} style={editorStyle} />

        <button onClick={handleRunCode} disabled={isLoading} style={runBtn}>
          {isLoading ? "EXECUTING..." : "INITIALIZE JUTSU ▶"}
        </button>

        <div style={consoleStyle}>
          <div style={{color: '#64748b', borderBottom: '1px solid #334155', marginBottom: '10px', fontSize: '12px'}}>TERMINAL OUTPUT:</div>
          {output || "Awaiting input..."}
        </div>
      </div>
    </div>
  );
}

// STYLES
const courseBtn = (active) => ({ padding: "6px", background: active ? "#ef4444" : "#0f172a", color: "#fff", border: "1px solid #334155", borderRadius: "4px", cursor: "pointer", fontSize: '10px' });
const lessonLink = (active) => ({ padding: "12px", cursor: "pointer", borderBottom: "1px solid #334155", background: active ? "#ef444422" : "transparent", color: active ? "#ef4444" : "#fff", fontSize: '13px' });
const editorStyle = { width: "100%", height: "250px", background: "#000", color: "#4ade80", padding: "20px", fontFamily: "monospace", borderRadius: "10px", border: "1px solid #334155", outline: 'none', marginTop: '10px' };
const consoleStyle = { marginTop: "20px", padding: "20px", background: "#000", color: "#4ade80", fontFamily: "monospace", borderRadius: "10px", border: '1px solid #1e293b', minHeight: '80px', whiteSpace: 'pre-wrap' };
const runBtn = { marginTop: "15px", padding: "12px 40px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer", letterSpacing: '1px' };

// MASCOT STYLES
const mascotContainer = { position: 'fixed', bottom: '20px', right: '20px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 100 };
const speechBubble = { background: '#fff', color: '#000', padding: '10px 15px', borderRadius: '15px', fontSize: '12px', maxWidth: '200px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', position: 'relative' };
const mascotImg = { width: '60px', height: '60px', background: '#1e293b', borderRadius: '50%', border: '2px solid #ef4444' };
