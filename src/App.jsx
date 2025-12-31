import React, { useState, useEffect, useMemo } from "react";
import Login from "./Login";
import Profile from "./components/Profile";
import Leaderboard from "./components/Leaderboard";
import Footer from "./components/Footer";
import {
  htmlLessons, pythonLessons, clLessons, cppLessons,
  cssLessons, goLessons, sqlLessons, rLessons,
} from "./courses/index.js";

export default function App() {
  // --- AUTH & CORE STATE ---
  const [user, setUser] = useState(localStorage.getItem("app_user") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("app_user"));
  const [points, setPoints] = useState(parseInt(localStorage.getItem("app_points")) || 0);
  const [streak, setStreak] = useState(parseInt(localStorage.getItem("app_streak")) || 0);
  const [progress, setProgress] = useState(JSON.parse(localStorage.getItem("app_stats")) || {});
  const [referral, setReferral] = useState(localStorage.getItem("app_referral") || "");

  // --- NAVIGATION & VIEW ---
  const [view, setView] = useState("dashboard"); // dashboard, lesson, profile, leaderboard
  const [course, setCourse] = useState("python");
  const [isLoading, setIsLoading] = useState(false);
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

  const lessons = allCourses[course]?.lessons || [];
  const [currentLesson, setCurrentLesson] = useState(null);
  const [userCode, setUserCode] = useState("");

  // --- STREAK LOGIC ---
  useEffect(() => {
    if (isLoggedIn) {
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
        } else if (!lastLogin) {
          setStreak(1);
          localStorage.setItem("app_streak", 1);
        } else {
          setStreak(1); // Reset if day missed
          localStorage.setItem("app_streak", 1);
        }
        localStorage.setItem("app_last_login", today);
      }
    }
  }, [isLoggedIn]);

  // --- CODE EXECUTION ---
  const handleRunCode = async () => {
    setIsLoading(true);
    setMascotMsg("Processing...");
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
      setOutput(`> Execution Results:\n${result}`);

      if (!data.run.stderr) {
        setMascotMsg("Correct! +20 XP");
        const newPoints = points + 20;
        setPoints(newPoints);
        localStorage.setItem("app_points", newPoints);

        const key = `done_${course}`;
        let done = JSON.parse(localStorage.getItem(key)) || [];
        if (!done.includes(currentLesson.id)) {
          done.push(currentLesson.id);
          localStorage.setItem(key, JSON.stringify(done));
          const newStats = { ...progress, [course]: (done.length / 40) * 100 };
          setProgress(newStats);
          localStorage.setItem("app_stats", JSON.stringify(newStats));
        }
      } else {
        setMascotMsg("Check your syntax.");
      }
    } catch (err) { setOutput("Connection error."); }
    setIsLoading(false);
  };

  // --- RENDER HELPERS ---
  if (!isLoggedIn) return <Login onLogin={(name) => { setUser(name); setIsLoggedIn(true); localStorage.setItem("app_user", name); }} />;
  
  if (!referral) return (
    <div className="h-screen bg-[#0b0f1a] flex items-center justify-center p-6">
      <div className="bg-[#161b2a] p-8 rounded-2xl border border-slate-800 max-w-sm w-full text-center">
        <h2 className="text-xl font-bold mb-6">How did you find us?</h2>
        <div className="grid gap-3">
          {["Google", "GitHub", "Twitter", "Friend"].map(s => (
            <button key={s} onClick={() => {setReferral(s); localStorage.setItem("app_referral", s);}} className="p-3 bg-slate-800 hover:bg-blue-600 rounded-xl transition text-sm font-medium">{s}</button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-200 font-sans flex flex-col">
      {/* HEADER */}
      <nav className="h-16 border-b border-slate-800 bg-[#0b0f1a] sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-white cursor-pointer" onClick={() => setView("dashboard")}>CODDY<span className="text-blue-500">CLONE</span></h1>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
            <button onClick={() => setView("dashboard")} className={view === 'dashboard' ? 'text-blue-500' : ''}>Courses</button>
            <button onClick={() => setView("leaderboard")} className={view === 'leaderboard' ? 'text-blue-500' : ''}>Leaderboard</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 text-orange-500 text-xs font-bold">
            🔥 {streak}
          </div>
          <button onClick={() => setView("profile")} className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">👤</button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {view === "dashboard" && (
          <div className="max-w-7xl mx-auto p-8">
            <h2 className="text-2xl font-bold mb-8 text-white">Continue Learning</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(allCourses).map(([key, data]) => (
                <div key={key} className="bg-[#161b2a] border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                  <div className="text-2xl mb-3">{data.icon}</div>
                  <h3 className="font-bold text-white mb-1">{data.title}</h3>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full my-4">
                    <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${progress[key] || 0}%` }} />
                  </div>
                  <button onClick={() => { setCourse(key); setCurrentLesson(data.lessons[0]); setUserCode(data.lessons[0].starterCode); setView("lesson"); }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white">
                    {progress[key] > 0 ? "CONTINUE" : "START"}
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
            <div className="w-64 bg-[#0f172a] border-r border-slate-800 overflow-y-auto">
              {lessons.map(l => (
                <div key={l.id} onClick={() => { setCurrentLesson(l); setUserCode(l.starterCode); }}
                  className={`p-4 border-b border-slate-800 cursor-pointer text-xs ${currentLesson?.id === l.id ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500' : 'hover:bg-slate-800'}`}>
                  {l.title}
                </div>
              ))}
            </div>
            <div className="flex-1 p-8 overflow-y-auto relative bg-[#0b0f1a]">
              <h2 className="text-2xl font-bold text-white mb-4">{currentLesson?.title}</h2>
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 mb-8 text-sm text-slate-400 leading-relaxed">{currentLesson?.content}</div>
              <textarea value={userCode} onChange={(e) => setUserCode(e.target.value)} 
                className="w-full h-80 bg-black text-blue-300 p-6 rounded-xl border border-slate-800 font-mono text-sm focus:border-blue-500 outline-none resize-none" />
              <button onClick={handleRunCode} disabled={isLoading} className="mt-6 px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all">
                {isLoading ? "RUNNING..." : "RUN CODE"}
              </button>
              {output && <div className="mt-6 p-6 bg-black rounded-xl border border-slate-800 font-mono text-xs text-green-400 whitespace-pre-wrap">{output}</div>}
              {/* TINY MASCOT */}
              <div className="fixed bottom-6 right-6 flex items-center gap-3">
                {mascotMsg && <div className="bg-white text-black text-[10px] px-3 py-1.5 rounded-lg shadow-xl font-bold">{mascotMsg}</div>}
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-lg shadow-lg">🤖</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {view === "dashboard" && <Footer languages={Object.keys(allCourses)} />}
    </div>
  );
}
