import React, { useState, useEffect } from "react";
import { allCourses } from "./courses/index.js";

// --- SUB-COMPONENT: SHARINGAN MASCOT ---
const Sharingan = ({ size = "w-12 h-12", animate = true }) => (
  <div className={`${size} relative rounded-full bg-[#cc0000] border-2 border-black shadow-[0_0_15px_rgba(204,0,0,0.4)] flex items-center justify-center ${animate ? 'animate-pulse' : ''}`}>
    <div className="w-1/4 h-1/4 bg-black rounded-full z-10 shadow-inner"></div>
    {[0, 120, 240].map((deg) => (
      <div key={deg} className="absolute w-full h-full" style={{ transform: `rotate(${deg}deg)` }}>
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rounded-full after:content-[''] after:absolute after:w-1.5 after:h-2 after:border-l-2 after:border-black after:rounded-full after:-top-0.5 after:left-1"></div>
      </div>
    ))}
  </div>
);

export default function App() {
  // Persistence States
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("zn_user")) || null);
  const [surveyDone, setSurveyDone] = useState(localStorage.getItem("zn_survey_done") === "true");
  
  // App Logic States
  const [view, setView] = useState(!user ? "login" : !surveyDone ? "survey" : "ide");
  const [activeLang, setActiveLang] = useState("PYTHON");
  const [lessonIdx, setLessonIdx] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mascotMsg, setMascotMsg] = useState("Focus your chakra, let's code.");

  const currentLesson = allCourses[activeLang]?.lessons[lessonIdx] || {};

  useEffect(() => {
    if (currentLesson.starterCode) setUserCode(currentLesson.starterCode);
    setError(""); setOutput("");
  }, [activeLang, lessonIdx]);

  // --- ACTIONS ---
  const handleLogin = (e) => {
    e.preventDefault();
    const data = { username: e.target.username.value, email: e.target.email.value };
    localStorage.setItem("zn_user", JSON.stringify(data));
    setUser(data);
    setView("survey");
  };

  const completeSurvey = () => {
    localStorage.setItem("zn_survey_done", "true");
    setSurveyDone(true);
    setView("ide");
  };

  const runCode = () => {
    setMascotMsg("Analyzing your jutsu...");
    // Simulation logic for valid syntax
    if (userCode.toLowerCase().includes("print") || activeLang !== "PYTHON") {
      setOutput("Success: Hello Zenin!");
      setError("");
      setMascotMsg("Perfect execution! +20 XP");
    } else {
      setError("SyntaxError: Check your code logic.");
      setOutput("");
      setMascotMsg("Careful... your focus is wavering.");
    }
  };

  // --- VIEW 1: PREMIUM LOGIN ---
  if (view === "login") return (
    <div className="h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="w-full max-w-sm animate-in">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4"><Sharingan size="w-16 h-16" /></div>
          <h1 className="text-3xl font-black text-white tracking-tighter">ZENIN<span className="text-blue-500">LABS</span></h1>
        </div>
        <form onSubmit={handleLogin} className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4">
          <input name="username" placeholder="Username" required className="w-full bg-[#020617] border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-blue-500 transition-all" />
          <input name="email" type="email" placeholder="Email" required className="w-full bg-[#020617] border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-blue-500 transition-all" />
          <input type="password" placeholder="Password" required className="w-full bg-[#020617] border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-red-500 transition-all" />
          <button className="w-full bg-blue-600 py-4 rounded-2xl font-black text-white uppercase tracking-widest hover:bg-blue-500 transition-all">Get Started</button>
        </form>
      </div>
    </div>
  );

  // --- VIEW 2: MASCOT SURVEY ---
  if (view === "survey") return (
    <div className="h-screen bg-[#020617] flex items-center justify-center">
      <div className="max-w-md w-full bg-[#0f172a] p-10 rounded-[3rem] border border-white/5 text-center shadow-2xl">
        <div className="flex justify-center mb-6"><Sharingan size="w-14 h-14" /></div>
        <h2 className="text-2xl font-black text-white mb-4 uppercase">Initialize Training</h2>
        <p className="text-slate-400 text-sm mb-8 italic">"How many minutes a day will you commit to the path?"</p>
        <div className="space-y-3 mb-8">
          {["15 Mins", "30 Mins", "1 Hour+"].map(t => (
            <button key={t} onClick={completeSurvey} className="w-full p-4 bg-[#020617] border border-slate-800 rounded-2xl hover:border-blue-500 text-white font-bold transition-all">{t}</button>
          ))}
        </div>
      </div>
    </div>
  );

  // --- VIEW 3: THE PRO IDE (DASHBOARD) ---
  return (
    <div className="h-screen flex flex-col bg-[#020617] text-slate-300 overflow-hidden font-sans">
      {/* TOP NAVIGATION */}
      <nav className="h-16 bg-[#0b0f1a] border-b border-white/5 flex items-center px-8 justify-between shrink-0 z-50">
        <div className="flex items-center gap-10 h-full">
          <h1 className="text-xl font-black text-white tracking-tighter cursor-pointer" onClick={() => setView("ide")}>
            ZENIN<span className="text-blue-500">LABS</span>
          </h1>
          <div className="flex h-full items-center">
            {Object.keys(allCourses).map(lang => (
              <button key={lang} onClick={() => { setActiveLang(lang); setLessonIdx(0); }}
                className={`px-5 h-full text-[10px] font-black tracking-widest transition-all border-b-2 ${activeLang === lang ? 'border-blue-500 text-blue-500 bg-blue-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                {lang}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black rounded-full">🔥 STREAK: 1</div>
          <div className="w-10 h-10 bg-slate-800 rounded-full border border-white/10 flex items-center justify-center font-bold uppercase">{user?.username[0]}</div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR: Lesson Navigator */}
        <aside className="w-72 bg-[#050810] border-r border-white/5 overflow-y-auto shrink-0 scrollbar-thin">
          <div className="p-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] border-b border-white/5">Curriculum</div>
          {allCourses[activeLang].lessons.map((lesson, idx) => (
            <div key={lesson.id} onClick={() => setLessonIdx(idx)}
              className={`p-4 mx-2 mt-2 rounded-xl cursor-pointer transition-all ${lessonIdx === idx ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-500 hover:bg-white/5'}`}>
              <p className="text-[10px] opacity-30 font-mono mb-1">MODULE {idx + 1}</p>
              <h4 className="text-xs font-bold truncate">{lesson.title}</h4>
            </div>
          ))}
        </aside>

        {/* WORKSPACE */}
        <main className="flex-1 flex overflow-hidden">
          {/* Instructions Panel */}
          <div className="flex-1 p-10 overflow-y-auto border-r border-white/5 bg-[#020617]">
            <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">{currentLesson.title}</h2>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 mb-8 text-sm leading-relaxed text-slate-400">
              {currentLesson.content}
            </div>
            <div className="p-6 border border-blue-500/20 bg-blue-500/5 rounded-3xl">
              <span className="text-blue-500 font-black text-[10px] uppercase block mb-2 tracking-widest">Training Objective</span>
              <p className="text-xs italic text-slate-300">Run the script and verify the output in the console.</p>
            </div>
          </div>

          {/* Editor & Console Panel */}
          <div className="flex-1 flex flex-col bg-black/20">
            <div className="flex-1 relative">
              <textarea value={userCode} onChange={(e) => setUserCode(e.target.value)} spellCheck="false"
                className="w-full h-full bg-[#050810] p-8 font-mono text-sm text-blue-300 outline-none resize-none" />
            </div>
            {/* TERMINAL BAR */}
            <div className="h-12 bg-[#0b0f1a] border-y border-white/5 flex items-center px-6 justify-between">
              <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Console Output</span>
              <button onClick={runCode} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-1.5 rounded-full text-[10px] font-black uppercase transition-all active:scale-95 shadow-lg shadow-blue-600/20">
                Execute ▶
              </button>
            </div>
            {/* CONSOLE OUTPUT */}
            <div className="h-56 bg-[#020617] p-6 font-mono text-xs overflow-y-auto">
              {error ? (
                <div className="text-red-500"><p className="font-bold uppercase mb-1">Error Detected</p>{error}</div>
              ) : (
                <div className="text-green-400"><p className="opacity-40 mb-2"># Zenin Terminal v1.0.0</p>{output || "> Waiting for execution..."}</div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* FLOATING MASCOT INTERACTION */}
      <div className="fixed bottom-10 right-10 flex items-center gap-4 pointer-events-none">
        <div className="bg-white text-black px-5 py-3 rounded-2xl rounded-br-none shadow-2xl font-bold text-xs pointer-events-auto animate-in">
          {mascotMsg}
        </div>
        <Sharingan size="w-16 h-16" />
      </div>
    </div>
  );
}
