import React, { useState, useEffect } from "react";
import Login from "./Login";
import Profile from "./components/Profile";
import Leaderboard from "./components/Leaderboard";
import Footer from "./components/Footer";
import {
  htmlLessons, pythonLessons, clLessons, cppLessons,
  cssLessons, goLessons, sqlLessons, rLessons,
} from "./courses/index.js";

export default function App() {
  // --- 1. AUTHENTICATION ---
  const [user, setUser] = useState(localStorage.getItem("app_user") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("app_user"));

  // --- 2. DATA & PROGRESS ---
  const [points, setPoints] = useState(parseInt(localStorage.getItem("app_points")) || 0);
  const [streak, setStreak] = useState(parseInt(localStorage.getItem("app_streak")) || 0);
  const [progress, setProgress] = useState(JSON.parse(localStorage.getItem("app_stats")) || {});
  const [referral, setReferral] = useState(localStorage.getItem("app_referral") || "");

  // --- 3. NAVIGATION ---
  const [view, setView] = useState("dashboard"); 
  const [course, setCourse] = useState("python");
  const [output, setOutput] = useState("");
  const [mascotMsg, setMascotMsg] = useState("");

  const allCourses = {
    python: { title: "Python", lessons: pythonLessons, icon: "🐍" },
    sql: { title: "SQL", lessons: sqlLessons, icon: "🗄️" },
    html: { title: "HTML", lessons: htmlLessons, icon: "🌐" },
    css: { title: "CSS", lessons: cssLessons, icon: "🎨" },
    go: { title: "Go", lessons: goLessons, icon: "🐹" },
    c: { title: "C", lessons: clLessons, icon: "⚙️" },
    cpp: { title: "C++", lessons: cppLessons, icon: "🚀" },
    r: { title: "R", lessons: rLessons, icon: "📊" }
  };

  const [currentLesson, setCurrentLesson] = useState(null);
  const [userCode, setUserCode] = useState("");

  // --- STREAK RESET LOGIC ---
  useEffect(() => {
    if (isLoggedIn && referral) { // Only track streak after they finish setup
      const today = new Date().toDateString();
      const lastLogin = localStorage.getItem("app_last_login");
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastLogin !== today) {
        if (lastLogin === yesterday.toDateString()) {
          const newStreak = streak + 1;
          setStreak(newStreak);
          localStorage.setItem("app_streak", newStreak);
        } else {
          setStreak(1);
          localStorage.setItem("app_streak", 1);
        }
        localStorage.setItem("app_last_login", today);
      }
    }
  }, [isLoggedIn, referral]);

  // --- RENDER LOGIC (THE ORDER YOU ASKED FOR) ---

  // STEP 1: LOGIN FIRST
  if (!isLoggedIn) {
    return <Login onLogin={(name) => { 
      setUser(name); 
      setIsLoggedIn(true); 
      localStorage.setItem("app_user", name); 
    }} />;
  }
  
  // STEP 2: ASK QUESTIONS (ONLY AFTER LOGIN)
  if (!referral) {
    return (
      <div className="h-screen bg-[#0b0f1a] flex items-center justify-center p-6 font-sans">
        <div className="bg-[#161b2a] p-10 rounded-2xl border border-slate-800 max-w-md w-full shadow-2xl">
          <h2 className="text-2xl font-bold mb-2 text-white text-center">Welcome, {user}!</h2>
          <p className="text-slate-400 text-sm mb-8 text-center">How did you hear about CoddyClone?</p>
          <div className="grid gap-3">
            {["Google Search", "GitHub", "Social Media", "From a Friend"].map(source => (
              <button key={source} onClick={() => {
                setReferral(source); 
                localStorage.setItem("app_referral", source);
              }} className="p-4 bg-slate-800 hover:bg-blue-600 rounded-xl transition text-sm text-white font-semibold text-left border border-slate-700">
                {source}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // STEP 3: THE MAIN APP (DASHBOARD / LESSONS)
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-200 font-sans flex flex-col">
      {/* PROFESSIONAL NAV */}
      <nav className="h-16 border-b border-slate-800 bg-[#0b0f1a] sticky top-0 z-50 px-8 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <h1 className="text-xl font-black text-white cursor-pointer tracking-tighter" onClick={() => setView("dashboard")}>
            CODDY<span className="text-blue-500">CLONE</span>
          </h1>
          <div className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-widest text-slate-500">
            <button onClick={() => setView("dashboard")} className={view === 'dashboard' ? 'text-blue-500' : 'hover:text-white'}>Courses</button>
            <button onClick={() => setView("leaderboard")} className={view === 'leaderboard' ? 'text-blue-500' : 'hover:text-white'}>Leaderboard</button>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 text-orange-500 text-xs font-bold">
            🔥 {streak}
          </div>
          <button onClick={() => setView("profile")} className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 hover:border-blue-500 transition-all">👤</button>
        </div>
      </nav>

      <main className="flex-1">
        {view === "dashboard" && (
          <div className="max-w-7xl mx-auto p-10">
            <header className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-2">Learning Path</h2>
              <p className="text-slate-400">Select a language to continue your coding journey.</p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(allCourses).map(([key, data]) => (
                <div key={key} className="bg-[#161b2a] border border-slate-800 rounded-2xl p-6 hover:shadow-blue-500/5 hover:border-blue-500/40 transition-all group">
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{data.icon}</div>
                  <h3 className="font-bold text-white mb-1">{data.title}</h3>
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-2 uppercase">
                    <span>Progress</span>
                    <span>{Math.round(progress[key] || 0)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mb-6">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-700" style={{ width: `${progress[key] || 0}%` }} />
                  </div>
                  <button onClick={() => { 
                    setCourse(key); 
                    setCurrentLesson(data.lessons[0]); 
                    setUserCode(data.lessons[0].starterCode); 
                    setView("lesson"); 
                  }} className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white tracking-widest transition-colors">
                    {progress[key] > 0 ? "CONTINUE" : "LEARN"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "leaderboard" && <Leaderboard currentUser={{ name: user, xp: points, streak }} />}
        {view === "profile" && <Profile user={user} points={points} progress={progress} streak={streak} />}

        {view === "lesson" && (
          <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
            {/* SIDEBAR */}
            <div className="w-72 bg-[#0f172a] border-r border-slate-800 overflow-y-auto">
              <div className="p-4 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase">Curriculum</div>
              {lessons.map(l => (
                <div key={l.id} onClick={() => { setCurrentLesson(l); setUserCode(l.starterCode); }}
                  className={`p-4 border-b border-slate-800 cursor-pointer text-xs font-medium transition-all ${currentLesson?.id === l.id ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-500' : 'text-slate-400 hover:bg-slate-800'}`}>
                  {l.id}. {l.title}
                </div>
              ))}
            </div>
            
            {/* EDITOR AREA */}
            <div className="flex-1 p-10 overflow-y-auto relative bg-[#0b0f1a]">
              <h2 className="text-2xl font-bold text-white mb-4">{currentLesson?.title}</h2>
              <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800/50 mb-8 text-sm text-slate-400 leading-relaxed shadow-inner">
                {currentLesson?.content}
              </div>
              
              <div className="relative group">
                <textarea value={userCode} onChange={(e) => setUserCode(e.target.value)} 
                  className="w-full h-[400px] bg-[#050810] text-blue-300 p-6 rounded-2xl border border-slate-800 font-mono text-sm focus:border-blue-500 outline-none transition-all shadow-2xl" 
                  spellCheck="false"
                />
              </div>

              <div className="mt-6 flex items-center gap-6">
                <button onClick={() => {}} className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
                  RUN CODE
                </button>
              </div>

              {/* THE SMALL MASCOT (Tucked away) */}
              <div className="fixed bottom-8 right-8 flex items-end gap-3 pointer-events-none">
                {mascotMsg && (
                  <div className="bg-white text-slate-900 text-[11px] px-4 py-2 rounded-2xl shadow-2xl font-bold animate-in pointer-events-auto">
                    {mascotMsg}
                  </div>
                )}
                <div className="w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center text-xl shadow-xl border-2 border-white/10 pointer-events-auto cursor-help">
                  🤖
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {(view === "dashboard" || view === "profile") && <Footer languages={Object.keys(allCourses)} />}
    </div>
  );
}
