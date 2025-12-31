import React, { useState, useEffect } from "react";
import Login from "./Login";
import {
  htmlLessons, pythonLessons, clLessons, cppLessons,
  cssLessons, goLessons, sqlLessons, rLessons,
} from "./courses/index.js";

export default function App() {
  // --- STATE & AUTH ---
  const [user, setUser] = useState(localStorage.getItem("zenin_user") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("zenin_user"));
  const [course, setCourse] = useState("python");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // --- MASCOT & PROGRESS ---
  const [mascotMsg, setMascotMsg] = useState("Welcome, Ninja. Ready to master the scrolls?");
  const [progress, setProgress] = useState(JSON.parse(localStorage.getItem("zenin_stats")) || {});

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
  const [current, setCurrent] = useState(lessons[0] || { id: 1, title: "Loading..." });
  const [userCode, setUserCode] = useState("");

  // --- SOUND SYSTEM ---
  const playSuccessSound = () => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3");
    audio.volume = 0.4;
    audio.play().catch(e => console.log("Audio play blocked until user interaction"));
  };

  // --- REFRESH LESSON ON COURSE CHANGE ---
  useEffect(() => {
    if (lessons.length > 0) {
      setCurrent(lessons[0]);
      setUserCode(lessons[0].starterCode || "");
      setOutput("");
    }
  }, [course]);

  // --- REAL CODE EXECUTION (PISTON API) ---
  const handleRunCode = async () => {
    setIsLoading(true);
    setMascotMsg("Analyzing your code jutsu...");
    
    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
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
        setMascotMsg("⚠️ A bug! Even the best Ninjas fail. Check the error log.");
      } else {
        // SUCCESS LOGIC
        playSuccessSound();
        setMascotMsg("✨ Perfect! 2.5% Progress Syncing...");
        
        // Update Progress: track IDs to prevent double-counting
        const completedKey = `done_${course}`;
        let doneList = JSON.parse(localStorage.getItem(completedKey)) || [];
        
        if (!doneList.includes(current.id)) {
          doneList.push(current.id);
          localStorage.setItem(completedKey, JSON.stringify(doneList));
          
          const newPercentage = (doneList.length / 40) * 100;
          const newStats = { ...progress, [course]: newPercentage };
          setProgress(newStats);
          localStorage.setItem("zenin_stats", JSON.stringify(newStats));
        }
      }
    } catch (err) {
      setOutput("Connection Error: Execution server unreachable.");
      setMascotMsg("My connection to the server is sealed. Try again later!");
    }
    setIsLoading(false);
  };

  const handleLogin = (name) => {
    localStorage.setItem("zenin_user", name);
    setUser(name);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-[#0f172a] text-white font-mono overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-80 bg-[#1e293b] border-r-2 border-red-500 flex flex-col">
        <div className="p-6 text-center border-b border-slate-700">
          <h2 className="text-xl tracking-[4px] font-bold">ZENIN<span className="text-red-500">LABS</span></h2>
          <div className="text-[10px] text-green-400 mt-1 uppercase">Ninja: {user}</div>
          <div className="w-full bg-slate-900 h-1 mt-3 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${progress[course] || 0}%` }}></div>
          </div>
          <div className="text-[9px] mt-1 text-slate-400">{progress[course] || 0}% COMPLETE</div>
        </div>

        <div className="grid grid-cols-2 gap-1 p-2">
          {Object.keys(allCourses).map((c) => (
            <button key={c} onClick={() => setCourse(c)} 
              className={`p-2 text-[10px] rounded transition ${course === c ? 'bg-red-500' : 'bg-slate-800 hover:bg-slate-700'}`}>
              {c.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1">
          {lessons.map((l) => (
            <div key={l.id} onClick={() => { setCurrent(l); setUserCode(l.starterCode); }}
              className={`p-4 cursor-pointer border-b border-slate-800 text-xs transition ${current.id === l.id ? 'bg-red-500/10 text-red-500 border-l-4 border-l-red-500' : 'hover:bg-slate-800'}`}>
              {l.title}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 p-8 overflow-y-auto relative">
        {/* MASCOT */}
        <div className="fixed bottom-10 right-10 flex items-center gap-4 z-50 animate-bounce-slow">
          <div className="bg-white text-black text-[11px] p-3 rounded-2xl rounded-br-none shadow-2xl max-w-[180px] font-sans font-bold">
            {mascotMsg}
          </div>
          <img src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user}`} className="w-16 h-16 bg-slate-800 rounded-full border-2 border-red-500 shadow-red-500/20 shadow-lg" alt="AI Mascot" />
        </div>

        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-4">{current.title}</h1>
          <div className="bg-slate-800/50 p-6 rounded-xl border-l-4 border-red-500 mb-6 text-sm leading-relaxed text-slate-300">
            {current.content}
          </div>

          <div className="relative group">
             <div className="absolute top-2 right-4 text-[10px] text-slate-500 uppercase">Editor</div>
             <textarea value={userCode} onChange={(e) => setUserCode(e.target.value)} 
                className="w-full h-72 bg-black text-green-400 p-6 rounded-xl border border-slate-700 focus:border-red-500 outline-none text-sm font-mono shadow-2xl" />
          </div>

          <button onClick={handleRunCode} disabled={isLoading}
            className="mt-6 px-10 py-4 bg-red-500 hover:bg-red-600 disabled:bg-slate-600 text-white font-bold rounded-lg transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-red-500/20">
            {isLoading ? "COMPILING..." : "EXECUTE CODE ▶"}
          </button>

          {output && (
            <div className="mt-8 p-6 bg-black rounded-xl border border-slate-800 shadow-inner">
              <div className="text-[10px] text-slate-500 mb-2 uppercase tracking-widest">Terminal Output</div>
              <pre className="text-green-400 text-sm whitespace-pre-wrap">{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
