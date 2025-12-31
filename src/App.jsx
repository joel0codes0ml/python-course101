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
  // --- AUTH & USER STATE ---
  const [user, setUser] = useState(localStorage.getItem("app_user") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("app_user"));
  const [referral, setReferral] = useState(localStorage.getItem("app_referral") || "");
  
  // --- STATS ---
  const [points, setPoints] = useState(parseInt(localStorage.getItem("app_points")) || 0);
  const [streak, setStreak] = useState(parseInt(localStorage.getItem("app_streak")) || 0);
  const [progress, setProgress] = useState(JSON.parse(localStorage.getItem("app_stats")) || {});

  // --- NAVIGATION & EDITOR ---
  const [view, setView] = useState("dashboard"); 
  const [course, setCourse] = useState("python");
  const [currentLesson, setCurrentLesson] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("");
  const [mascotMsg, setMascotMsg] = useState("");

  const allCourses = {
    python: { title: "Python 3", icon: "🐍", lessons: pythonLessons },
    sql: { title: "SQL Mastery", icon: "🗄️", lessons: sqlLessons },
    html: { title: "HTML5", icon: "🌐", lessons: htmlLessons },
    css: { title: "CSS3", icon: "🎨", lessons: cssLessons },
    go: { title: "Golang", icon: "🐹", lessons: goLessons },
    c: { title: "C Language", icon: "⚙️", lessons: clLessons },
    cpp: { title: "C++", icon: "🚀", lessons: cppLessons },
    r: { title: "R Stats", icon: "📊", lessons: rLessons }
  };

  // --- STREAK RESET LOGIC ---
  useEffect(() => {
    if (isLoggedIn && referral) {
      const today = new Date().toDateString();
      const lastLogin = localStorage.getItem("app_last_login");
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      if (lastLogin !== today) {
        if (lastLogin === yesterdayStr) {
          const newStreak = streak + 1;
          setStreak(newStreak);
          localStorage.setItem("app_streak", newStreak);
        } else {
          setStreak(1); // Reset if missed a day
          localStorage.setItem("app_streak", 1);
        }
        localStorage.setItem("app_last_login", today);
      }
    }
  }, [isLoggedIn, referral]);

  // --- PROGRESS TRACKER (+20 XP) ---
  const completeLesson = () => {
    const key = `done_${course}`;
    let done = JSON.parse(localStorage.getItem(key)) || [];
    if (!done.includes(currentLesson.id)) {
      done.push(currentLesson.id);
      localStorage.setItem(key, JSON.stringify(done));
      
      const newPoints = points + 20;
      setPoints(newPoints);
      localStorage.setItem("app_points", newPoints);

      const courseLessons = allCourses[course].lessons;
      const newStats = { ...progress, [course]: (done.length / courseLessons.length) * 100 };
      setProgress(newStats);
      localStorage.setItem("app_stats", JSON.stringify(newStats));
      setMascotMsg("Correct! +20 XP earned.");
    }
  };

  // --- RENDERING VIEWS ---

  // 1. LOGIN VIEW
  if (!isLoggedIn) return <Login onLogin={(n) => { setUser(n); setIsLoggedIn(true); localStorage.setItem("app_user", n); }} />;
  
  // 2. SURVEY VIEW (ZeninLabs Style)
  if (!referral) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="bg-[#0f172a] p-10 rounded-3xl border border-slate-800 max-w-md w-full shadow-2xl animate-in">
        <h2 className="text-2xl font-bold mb-2 text-white text-center">Setup Profile</h2>
        <p className="text-slate-400 text-sm mb-8 text-center">How did you find ZeninLabs?</p>
        <div className="grid gap-3">
          {["Google", "GitHub", "Twitter", "A Friend"].map(s => (
            <button key={s} onClick={() => { setReferral(s); localStorage.setItem("app_referral", s); }} 
            className="p-4 bg-slate-800 hover:bg-blue-600 rounded-2xl transition text-sm text-white font-medium text-left border border-slate-700">
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // 3. MAIN APP
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex flex-col">
      <nav className="h-16 border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50 px-8 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <h1 className="text-xl font-bold text-white tracking-tighter" onClick={() => setView("dashboard")}>
            ZENIN<span className="text-blue-500">LABS</span>
          </h1>
          <div className="hidden md:flex gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <button onClick={() => setView("dashboard")} className={view === 'dashboard' ? 'text-blue-500' : 'hover:text-white'}>Courses</button>
            <button onClick={() => setView("leaderboard")} className={view === 'leaderboard' ? 'text-blue-500' : 'hover:text-white'}>Leaderboard</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 text-orange-500 text-xs font-bold">
            🔥 {streak}
          </div>
          <button onClick={() => setView("profile")} className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 hover:border-blue-500">👤</button>
        </div>
      </nav>

      <main className="flex-1">
        {view === "dashboard" && (
          <div className="max-w-7xl mx-auto p-10 animate-in">
            <h2 className="text-2xl font-bold mb-8 text-white">Continue Learning</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(allCourses).map(([key, data]) => (
                <div key={key} className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                  <div className="text-3xl mb-4">{data.icon}</div>
                  <h3 className="font-bold text-white mb-4">{data.title}</h3>
                  <div className="w-full bg-slate-800 h-1 rounded-full mb-6">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progress[key] || 0}%` }} />
                  </div>
                  <button onClick={() => { setCourse(key); setCurrentLesson(data.lessons[0]); setUserCode(data.lessons[0].starterCode); setView("lesson"); }} 
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white uppercase tracking-widest">
                    {progress[key] > 0 ? "Resume" : "Start Course"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "leaderboard" && <Leaderboard currentUser={{ name: user, xp: points, streak }} />}
        {view === "profile" && <Profile user={user} points={points} progress={progress} streak={streak} />}

        {view === "lesson" && (
          <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            <div className="w-72 bg-[#020617] border-r border-slate-800 overflow-y-auto">
              <div className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lessons</div>
              {allCourses[course].lessons.map(l => (
                <div key={l.id} onClick={() => { setCurrentLesson(l); setUserCode(l.starterCode); }}
                  className={`p-4 border-b border-slate-800 cursor-pointer text-xs font-medium transition-all ${currentLesson?.id === l.id ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-500' : 'text-slate-400 hover:bg-slate-800'}`}>
                  {l.title}
                </div>
              ))}
            </div>
            <div className="flex-1 p-10 overflow-y-auto relative bg-[#020617] pb-24">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4">{currentLesson?.title}</h2>
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 mb-8 text-sm text-slate-400 leading-relaxed">{currentLesson?.content}</div>
                <textarea value={userCode} onChange={(e) => setUserCode(e.target.value)} 
                  className="w-full h-96 bg-black text-blue-300 p-6 rounded-2xl border border-slate-800 font-mono text-sm focus:border-blue-500 outline-none" 
                />
                <button onClick={completeLesson} className="mt-6 px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/10">
                  RUN CODE
                </button>
              </div>

              {/* SMALL 40px MASCOT */}
              <div className="fixed bottom-8 right-8 flex items-end gap-3 pointer-events-none">
                {mascotMsg && (
                  <div className="bg-white text-slate-900 text-[11px] px-4 py-2 rounded-2xl shadow-2xl font-bold animate-in pointer-events-auto">
                    {mascotMsg}
                  </div>
                )}
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-lg shadow-xl border-2 border-white/10 pointer-events-auto">
                  🤖
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {view === "dashboard" && <Footer languages={Object.keys(allCourses)} />}
    </div>
  );
}
