import { useState } from "react";
import Mascot from "./components/Mascot.jsx";
import CodeEditor from "./components/CodeEditor.jsx";
import {
  htmlLessons, cssLessons, pythonLessons, clLessons,
  cppLessons, goLessons, sqlLessons, rLessons
} from "./courses/index.js";

const languages = [
  { name: "Python", lessons: pythonLessons, key: "python", version: "3.10.0" },
  { name: "C", lessons: clLessons, key: "c", version: "10.2.0" },
  { name: "C++", lessons: cppLessons, key: "cpp", version: "10.2.0" },
  { name: "Go", lessons: goLessons, key: "go", version: "1.16.2" },
  { name: "R", lessons: rLessons, key: "r", version: "4.1.0" },
  { name: "SQL", lessons: sqlLessons, key: "sqlite3", version: "3.36.0" },
  { name: "HTML", lessons: htmlLessons, key: "html", version: "5.0.0" },
  { name: "CSS", lessons: cssLessons, key: "css", version: "3.0.0" }
];

export default function App({ user }) {
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const lessons = currentLanguage.lessons;
  const current = lessons[currentLessonIndex] || { title: "End of Path", content: "Great work!" };

  return (
    <div className="h-screen bg-[#020617] text-white flex flex-col overflow-hidden animate-in">
      {/* HEADER */}
      <nav className="h-14 flex items-center px-6 gap-4 border-b border-white/5 bg-black z-50">
        <Mascot />
        <span className="font-black italic tracking-tighter text-xl">ZENIN<span className="text-red-600">LABS</span></span>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">XP {user?.xp || 0}</span>
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10" />
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* PANEL 1: SIDEBAR (BLACK) */}
        <aside className="w-60 bg-black border-r border-white/5 flex flex-col shrink-0">
          <div className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Curriculum</div>
          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            {languages.map(lang => (
              <button 
                key={lang.name} 
                className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all ${lang.name === currentLanguage.name ? "bg-red-600/10 text-red-500 border border-red-600/20" : "text-slate-500 hover:bg-white/5"}`} 
                onClick={() => { setCurrentLanguage(lang); setCurrentLessonIndex(0); }}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </aside>

        {/* PANEL 2: LESSON (GREEN ACCENTS) */}
        <main className="w-[450px] bg-[#020617] border-r border-white/5 overflow-y-auto p-10 flex flex-col shrink-0">
          <div className="flex-1">
            <div className="inline-block px-3 py-1 rounded-md bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-widest mb-4 border border-green-500/20">
              Module {currentLessonIndex + 1}
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter mb-8 leading-none">
              {current.title}
            </h1>
            
            {/* CONTENT PLACEHOLDER STYLE */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-green-500 group-hover:h-full transition-all" />
               <p className="text-slate-400 text-sm leading-relaxed font-medium">
                 {current.content}
               </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setCurrentLessonIndex(prev => Math.max(0, prev - 1))} className="flex-1 bg-slate-900 border border-white/10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Prev</button>
            <button onClick={() => setCurrentLessonIndex(prev => Math.min(lessons.length - 1, prev + 1))} className="flex-1 bg-green-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black shadow-lg shadow-green-600/20 hover:scale-[1.02] transition-all">Next</button>
          </div>
        </main>

        {/* PANEL 3: CMD TERMINAL EDITOR (BLACK/HUGE) */}
        <section className="flex-1 bg-black flex flex-col relative">
          <CodeEditor 
            language={currentLanguage.key}
            version={currentLanguage.version}
            starterCode={current.starterCode}
            expectedOutput={current.expectedOutput}
            solution={current.solution}
          />
        </section>
      </div>
    </div>
  );
}






