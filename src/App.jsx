import { useState } from "react";
import Mascot from "./components/Mascot.jsx";
import CodeEditor from "./components/CodeEditor.jsx";
import { pythonLessons, clLessons, cppLessons, goLessons, sqlLessons, htmlLessons, cssLessons, rLessons } from "./courses/index.js";

const languages = [
  { name: "Python", lessons: pythonLessons, id: "python" },
  { name: "C", lessons: clLessons, id: "c" },
  { name: "C++", lessons: cppLessons, id: "cpp" },
  { name: "Go", lessons: goLessons, id: "go" },
  { name: "SQL", lessons: sqlLessons, id: "sqlite3" },
  { name: "HTML", lessons: htmlLessons, id: "html" },
  { name: "CSS", lessons: cssLessons, id: "css" }
];

export default function App({ user }) {
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const lessons = currentLanguage.lessons;
  const current = lessons[currentLessonIndex] || { title: "End of Path", content: "Great work!" };

  return (
    <div className="h-screen flex flex-col bg-[#020617] text-slate-300">
      {/* GLOBAL NAV */}
      <nav className="h-14 flex items-center px-6 border-b border-white/5 bg-black">
        <Mascot />
        <span className="ml-3 font-black tracking-tighter text-xl italic text-white">ZENIN<span className="text-red-600">LABS</span></span>
        <div className="ml-auto flex items-center gap-6">
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global XP</span>
             <span className="text-sm font-bold text-green-500">{user?.xp || 0}</span>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        
        {/* PANEL 1: CURRICULUM (LEFT) */}
        <aside className="w-56 bg-black border-r border-white/5 flex flex-col shrink-0">
          <div className="p-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Curriculum</div>
          <div className="flex-1 overflow-y-auto px-2 pb-10">
            {languages.map(lang => (
              <button 
                key={lang.name} 
                onClick={() => { setCurrentLanguage(lang); setCurrentLessonIndex(0); }}
                className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all mb-1 ${lang.name === currentLanguage.name ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "text-slate-500 hover:bg-white/5"}`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </aside>

        {/* PANEL 2: LESSON CONTENT (MIDDLE) */}
        <main className="w-[500px] border-r border-white/5 bg-[#020617] overflow-y-auto p-8 shrink-0 flex flex-col">
          <div className="flex-1">
            <div className="text-[10px] font-black text-green-500 mb-2 uppercase tracking-widest">
              Module {currentLessonIndex + 1}
            </div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-6 leading-tight">
              {current.title}
            </h1>
            
            {/* THE GREEN PLACEHOLDER CARD */}
            <div className="lesson-card p-6 rounded-2xl border-l-4 border-green-600 mb-8">
               <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                 {current.content}
               </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button onClick={() => setCurrentLessonIndex(p => Math.max(0, p-1))} className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-slate-800 transition-all">Prev</button>
            <button onClick={() => setCurrentLessonIndex(p => Math.min(lessons.length-1, p+1))} className="flex-1 bg-green-600 text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all">Next</button>
          </div>
        </main>

        {/* PANEL 3: TERMINAL / IDE (RIGHT) */}
        <section className="flex-1 bg-black flex flex-col overflow-hidden">
          <CodeEditor 
            language={currentLanguage.id}
            starterCode={current.starterCode}
            expectedOutput={current.expectedOutput}
            solution={current.solution}
          />
        </section>

      </div>
    </div>
  );
}
