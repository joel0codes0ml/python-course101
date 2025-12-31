import React, { useState, useEffect, useMemo } from "react";
import Login from "./Login";
import {
  htmlLessons, pythonLessons, clLessons, cppLessons,
  cssLessons, goLessons, sqlLessons, rLessons,
} from "./courses/index.js";

export default function App() {
  // --- AUTH & PROFILE ---
  const [user, setUser] = useState(localStorage.getItem("zenin_user") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("zenin_user"));
  const [points, setPoints] = useState(parseInt(localStorage.getItem("zenin_points")) || 0);
  const [referral, setReferral] = useState(localStorage.getItem("zenin_referral") || "");

  // --- NAVIGATION & UI ---
  const [view, setView] = useState("dashboard"); // 'dashboard' or 'coding'
  const [course, setCourse] = useState("python");
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState("");
  
  // --- MASCOT & PROGRESS ---
  const [mascotMsg, setMascotMsg] = useState("Ready to climb the ranks, Ninja?");
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

  // --- DYNAMIC CONTENT (DAILY CHALLENGE & LEADERBOARD) ---
  const dailyChallenge = useMemo(() => {
    const day = new Date().getDate();
    const challengeList = allCourses.python; // Default to Python for daily
    return challengeList[day % challengeList.length];
  }, []);

  const leaderboardData = [
    { name: "Satoshi_N", xp: 2450, rank: 1 },
    { name: "Ada_Lovelace", xp: 2100, rank: 2 },
    { name: user, xp: points, rank: "You" },
    { name: "Code_Sensei", xp: 1800, rank: 3 },
    { name: "Linus_T", xp: 1550, rank: 4 },
  ].sort((a, b) => b.xp - a.xp);

  // --- SOUND SYSTEM ---
  const playSuccessSound = () => {
    const audio = new Audio("https://cdn.freesound.org/previews/536/536420_4921214-lq.mp3"); // iPhone-style Ding
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio blocked"));
  };

  // --- EFFECTS ---
  useEffect(() => {
    if (lessons.length > 0) {
      setCurrent(lessons[0]);
      setUserCode(lessons[0].starterCode || "");
      setOutput("");
    }
  }, [course]);

  useEffect(() => {
    localStorage.setItem("zenin_points", points);
    localStorage.setItem("zenin_referral", referral);
  }, [points, referral]);

  // --- HANDLERS ---
  const handleRunCode = async () => {
    setIsLoading(true);
    setMascotMsg("Analyzing your scroll...");
    
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
      
      // We show the "Executed Code" first as requested
      setOutput(`>>> SOURCE CODE:\n${userCode}\n\n>>> OUTPUT:\n${result}`);

      if (data.run.stderr) {
        setMascotMsg("⚠️ Error in the jutsu! Fix the red text to proceed.");
      } else {
        playSuccessSound();
        setMascotMsg("✨ Masterful! +10 XP earned.");
        setPoints(prev => prev + 10);
        
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
      setOutput("Server sealed. Connection lost.");
      setMascotMsg("Connection error! The server is meditating.");
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
    <div className="flex h-screen bg-[#020617] text-white font-mono overflow-hidden">
      
      {/* REFERRAL SURVEY MODAL */}
      {!referral && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border-2 border-red-500 p-8 rounded-2xl max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-2">WELCOME TO THE DOJO</h2>
            <p className="text-slate-400 mb-6 text-sm">How did you hear about ZeninLabs?</p>
            <div className="grid grid-cols-1 gap-2">
              {["GitHub", "Social Media", "Friend", "Google"].map(s => (
                <button key={s} onClick={() => setReferral(s)} className="p-3 bg-slate-800 hover:bg-red-500 rounded-xl transition">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <div className="w-20 lg:w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col items-center py-6">
        <h2 className="hidden lg:block text-xl font-black mb-10 tracking-tighter">ZENIN<span className="text-red-500">LABS</span></h2>
        
        <div className="flex flex-col gap-6 w-full px-4">
          <button onClick={() => setView("dashboard")} className={`flex items-center gap-3 p-3 rounded-xl ${view === 'dashboard' ? 'bg-red-500' : 'hover:bg-slate-800'}`}>
            🏠 <span className="hidden lg:block">Dashboard</span>
          </button>
          <button onClick={() => setView("coding")} className={`flex items-center gap-3 p-3 rounded-xl ${view === 'coding' ? 'bg-red-500' : 'hover:bg-slate-800'}`}>
            ⚔️ <span className="hidden lg:block">Coding Lab</span>
          </button>
        </div>

        <div className="mt-auto p-4 hidden lg:block w-full">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Your XP</div>
            <div className="text-2xl font-bold text-red-500">{points}</div>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto">
        
        {view === "dashboard" ? (
          <div className="p-8 max-w-6xl mx-auto animate-in">
            <h1 className="text-4xl font-bold mb-2">Welcome, {user}</h1>
            <p className="text-slate-400 mb-10 text-sm">You have completed {Object.keys(progress).length} languages so far.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT: PROGRESS & CHALLENGE */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gradient-to-br from-red-600 to-orange-600 p-6 rounded-3xl shadow-xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <span className="bg-black/20 text-[10px] px-3 py-1 rounded-full font-bold uppercase">Daily Challenge</span>
                    <h2 className="text-2xl font-bold mt-2">{dailyChallenge?.title}</h2>
                    <button onClick={() => { setCourse("python"); setView("coding"); }} className="mt-4 px-6 py-2 bg-white text-black font-bold rounded-lg text-sm">ACCEPT JUTSU</button>
                  </div>
                  <div className="absolute top-[-20px] right-[-20px] text-9xl opacity-10 group-hover:scale-110 transition-transform">⚡</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.keys(allCourses).map(c => (
                    <div key={c} onClick={() => { setCourse(c); setView("coding"); }} className="bg-[#1e293b] p-4 rounded-2xl border border-slate-800 hover:border-red-500 cursor-pointer transition">
                      <div className="text-[10px] text-slate-500 uppercase mb-1">{c}</div>
                      <div className="text-lg font-bold">{(progress[c] || 0).toFixed(1)}%</div>
                      <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full" style={{ width: `${progress[c] || 0}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: LEADERBOARD */}
              <div className="bg-[#0f172a] rounded-3xl border border-slate-800 p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">🏆 Leaderboard</h3>
                <div className="space-y-4">
                  {leaderboardData.map((player, i) => (
                    <div key={i} className={`flex justify-between items-center p-3 rounded-xl ${player.name === user ? 'bg-red-500/20 border border-red-500/50' : 'bg-slate-900'}`}>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold w-4 ${i === 0 ? 'text-yellow-400' : ''}`}>{player.rank}</span>
                        <span className="text-sm">{player.name}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-400">{player.xp} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full lg:flex-row">
             {/* CODING SIDEBAR */}
             <div className="w-full lg:w-80 bg-[#0f172a] border-r border-slate-800 overflow-y-auto">
                <div className="p-6 border-b border-slate-800">
                  <select value={course} onChange={(e) => setCourse(e.target.value)} className="w-full bg-slate-800 p-2 rounded text-xs outline-none">
                    {Object.keys(allCourses).map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                  </select>
                </div>
                {lessons.map((l) => (
                  <div key={l.id} onClick={() => { setCurrent(l); setUserCode(l.starterCode); }}
                    className={`p-4 cursor-pointer border-b border-slate-800 text-xs transition ${current.id === l.id ? 'bg-red-500/10 text-red-500 border-l-4 border-l-red-500' : 'hover:bg-slate-800'}`}>
                    {l.title}
                  </div>
                ))}
             </div>

             {/* EDITOR AREA */}
             <div className="flex-1 p-8 relative">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-3xl font-bold mb-4">{current.title}</h1>
                  <div className="bg-[#1e293b] p-6 rounded-xl border-l-4 border-red-500 mb-6 text-sm leading-relaxed text-slate-300">
                    {current.content}
                  </div>

                  <div className="relative group">
                    <textarea value={userCode} onChange={(e) => setUserCode(e.target.value)} 
                      className="w-full h-80 bg-black text-green-400 p-6 rounded-xl border border-slate-700 focus:border-red-500 outline-none text-sm font-mono shadow-2xl" />
                  </div>

                  <button onClick={handleRunCode} disabled={isLoading}
                    className="mt-6 px-10 py-4 bg-red-500 hover:bg-red-600 disabled:bg-slate-600 text-white font-bold rounded-lg transition-all active:scale-95 flex items-center gap-2">
                    {isLoading ? "COMPILING..." : "EXECUTE CODE ▶"}
                  </button>

                  {output && (
                    <div className="mt-8 p-6 bg-black rounded-xl border border-slate-800 font-mono">
                      <div className="text-[10px] text-slate-500 mb-2 uppercase">Terminal</div>
                      <pre className="text-green-400 text-sm whitespace-pre-wrap">{output}</pre>
                    </div>
                  )}
                </div>

                {/* MASCOT (Only in coding view) */}
                <div className="fixed bottom-10 right-10 flex items-center gap-4 z-50">
                  <div className="bg-white text-black text-[11px] p-3 rounded-2xl rounded-br-none shadow-2xl max-w-[180px] font-sans font-bold">
                    {mascotMsg}
                  </div>
                  <img src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user}`} className="w-16 h-16 bg-slate-800 rounded-full border-2 border-red-500 shadow-lg" alt="AI Mascot" />
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
