import React, { useState, useEffect } from "react";
import Landing from "./Landing"; // Import the new Landing Page
import Login from "./Login";
import Sharingan from "./components/Sharingan";
import { 
  htmlLessons, pythonLessons, clLessons, cppLessons, 
  cssLessons, goLessons, sqlLessons, rLessons 
} from "./courses/index.js";

export default function App() {
  // --- STATE ---
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("zn_user")) || null);
  const [view, setView] = useState("landing"); // Default view
  
  // IDE States
  const [activeLang, setActiveLang] = useState("PYTHON");
  const [lessonIdx, setLessonIdx] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("");
  const [mascotMsg, setMascotMsg] = useState("Focus your chakra...");

  // --- COURSE DATA MAP ---
  const allCourses = {
    PYTHON: pythonLessons, SQL: sqlLessons, HTML: htmlLessons, 
    CSS: cssLessons, GO: goLessons, C: clLessons, 
    CPP: cppLessons, R: rLessons
  };

  const currentLesson = allCourses[activeLang][lessonIdx];

  // --- EFFECTS ---
  // If user is already logged in, skip landing and login
  useEffect(() => {
    if (user) setView("ide");
  }, [user]);

  useEffect(() => {
    if (currentLesson) setUserCode(currentLesson.starterCode || "");
    setOutput("");
  }, [activeLang, lessonIdx]);

  // --- ROUTING LOGIC ---
  if (view === "landing" && !user) {
    return <Landing onGetStarted={() => setView("login")} />;
  }

  if (view === "login" && !user) {
    return <Login onLogin={(name) => {
      const userData = { username: name, joined: new Date() };
      localStorage.setItem("zn_user", JSON.stringify(userData));
      setUser(userData);
      setView("ide");
    }} />;
  }

  // --- MAIN IDE VIEW ---
  return (
    <div className="h-screen flex flex-col bg-[#020617] text-slate-300 font-sans overflow-hidden">
      
      {/* HEADER */}
      <nav className="h-14 bg-[#0b0f1a] border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-8">
          <h1 className="text-lg font-black text-white tracking-tighter italic cursor-pointer" onClick={() => setView("landing")}>
            ZENIN<span className="text-blue-500">LABS</span>
          </h1>
          <div className="flex h-full gap-1">
            {Object.keys(allCourses).map(lang => (
              <button key={lang} onClick={() => { setActiveLang(lang); setLessonIdx(0); }}
                className={`px-4 h-14 text-[10px] font-black transition-all border-b-2 ${activeLang === lang ? 'border-blue-500 text-blue-500 bg-blue-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                {lang}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-[9px] font-black text-orange-500 tracking-widest px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20">STREAK: 1</div>
           <Sharingan size="w-8 h-8" animate={false} />
        </div>
      </nav>

      {/* 3-COLUMN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* PANEL 1: CURRICULUM */}
        <aside className="w-64 bg-[#050810] border-r border-white/5 flex flex-col shrink-0">
          <div className="p-4 text-[10px] font-black text-slate-600 uppercase tracking-widest border-b border-white/5">Curriculum</div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {allCourses[activeLang].map((l, idx) => (
              <div key={l.id} onClick={() => setLessonIdx(idx)}
                className={`p-4 cursor-pointer transition-all border-l-4 ${lessonIdx === idx ? 'bg-blue-600/5 text-blue-400 border-blue-500' : 'border-transparent text-slate-500 hover:bg-white/5'}`}>
                <p className="text-[9px] opacity-40 font-mono leading-none mb-1">MODULE {idx + 1}</p>
                <h4 className="text-xs font-bold truncate">{l.title}</h4>
              </div>
            ))}
          </div>
        </aside>

        {/* PANEL 2: LESSON */}
        <section className="w-[450px] bg-[#020617] border-r border-white/5 flex flex-col shrink-0">
          <div className="p-4 text-[10px] font-black text-slate-600 uppercase tracking-widest border-b border-white/5">Lesson Scroll</div>
          <div className="flex-1 overflow-y-auto p-10 scrollbar-thin">
            <h2 className="text-2xl font-black text-white mb-6 leading-tight uppercase italic">{currentLesson?.title}</h2>
            <div className="prose prose-invert text-slate-400 text-sm leading-relaxed mb-8">
              {currentLesson?.content}
            </div>
            <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-3xl">
              <p className="text-blue-500 font-black text-[10px] uppercase mb-2 tracking-widest">Training Objective</p>
              <p className="text-xs text-slate-400 italic">"Write your code in the editor and click Execute."</p>
            </div>
          </div>
        </section>

        {/* PANEL 3: EDITOR */}
        <section className="flex-1 flex flex-col bg-[#050810]">
          <div className="flex-1 flex flex-col relative">
            <div className="h-10 bg-[#0b0f1a] border-b border-white/5 flex items-center px-6 justify-between shrink-0">
               <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">terminal.exe</span>
            </div>
            <textarea 
              value={userCode} onChange={(e) => setUserCode(e.target.value)} spellCheck="false"
              className="flex-1 bg-transparent p-8 font-mono text-sm text-blue-300 outline-none resize-none selection:bg-blue-500/20"
            />
          </div>

          <div className="h-12 bg-[#0b0f1a] border-y border-white/5 flex items-center px-6 justify-between shrink-0">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Console Output</span>
            <button onClick={() => { setOutput("Success: Scroll Complete!"); setMascotMsg("Excellent work, Ninja!"); }} 
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-1.5 rounded-full text-[10px] font-black uppercase shadow-lg shadow-blue-900/40 transition-all active:scale-95">
              Execute ▶
            </button>
          </div>

          <div className="h-56 bg-black/40 p-8 font-mono text-xs overflow-y-auto scrollbar-thin">
            <p className="opacity-30 mb-2 font-bold tracking-tighter"># ZENINLABS SYSTEM READY</p>
            <p className="text-green-400 leading-loose">{output || "> Waiting for signal..."}</p>
          </div>
        </section>
      </div>

      {/* MASCOT */}
      <div className="fixed bottom-8 right-8 flex items-center gap-4 pointer-events-none group z-50">
        <div className="bg-white text-black px-5 py-3 rounded-2xl rounded-br-none shadow-2xl font-black text-[11px] pointer-events-auto animate-in border-2 border-black">
          {mascotMsg}
        </div>
        <div className="pointer-events-auto"><Sharingan size="w-16 h-16" /></div>
      </div>
    </div>
  );
}
