import { useState } from "react";
import Login from "./Login.jsx"; 
import Mascot from "./components/Mascot.jsx";
import CodeEditor from "./components/CodeEditor.jsx";

import {
  htmlLessons,
  cssLessons,
  pythonLessons,
  clLessons,
  cppLessons,
  goLessons,
  sqlLessons,
  rLessons
} from "./courses/index.js";

const languages = [
  { name: "Python", lessons: pythonLessons, pistonLang: "python", version: "3.10.0" },
  { name: "C", lessons: clLessons, pistonLang: "c", version: "10.2.0" },
  { name: "C++", lessons: cppLessons, pistonLang: "cpp", version: "10.2.0" },
  { name: "Go", lessons: goLessons, pistonLang: "go", version: "1.16.2" },
  { name: "R", lessons: rLessons, pistonLang: "r", version: "4.1.0" },
  { name: "SQL", lessons: sqlLessons, pistonLang: "sqlite3", version: "3.36.0" },
  { name: "HTML", lessons: htmlLessons, pistonLang: "html", version: "5.0.0" },
  { name: "CSS", lessons: cssLessons, pistonLang: "css", version: "3.0.0" }
];

export default function App({ user }) {
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const lessons = currentLanguage.lessons;
  const current = lessons[currentLessonIndex] || { title: "End of Course", content: "Great job!" };

  const goNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) setCurrentLessonIndex(currentLessonIndex + 1);
  };
  const goPrevLesson = () => {
    if (currentLessonIndex > 0) setCurrentLessonIndex(currentLessonIndex - 1);
  };
  const changeLanguage = (langName) => {
    const selected = languages.find(l => l.name === langName);
    setCurrentLanguage(selected);
    setCurrentLessonIndex(0);
    setOutput(""); // Clear terminal on language change
  };

  // --- THE EXECUTION ENGINE ---
  const handleExecuteCode = async (code) => {
    setIsRunning(true);
    setOutput("Initialising Zenin Virtual Environment...");

    // Basic logic for Web Languages (HTML/CSS)
    if (currentLanguage.name === "HTML" || currentLanguage.name === "CSS") {
      setOutput("Displaying Rendered Output...");
      setIsRunning(false);
      return;
    }

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        body: JSON.stringify({
          language: currentLanguage.pistonLang,
          version: currentLanguage.version,
          files: [{ content: code }],
        }),
      });

      const data = await response.json();
      
      if (data.run.stderr) {
        setOutput(`Error:\n${data.run.stderr}`);
      } else {
        setOutput(data.run.output || "Success: (No output returned)");
      }
    } catch (err) {
      setOutput("Error: Execution service unavailable.");
    } finally {
      setIsRunning(false);
    }
  };

  const completeLesson = (langName, lessonId) => {
    console.log(`User completed lesson ${lessonId} in ${langName}`);
  };

  return (
    <div className="h-screen bg-[#020617] text-white flex flex-col font-sans">
      <nav className="h-14 flex items-center px-6 gap-4 border-b border-white/5 bg-[#0b0f1a]">
        <Mascot />
        <span className="font-black italic tracking-tighter text-lg">ZENIN<span className="text-blue-500">LABS</span></span>
        <div className="ml-auto flex items-center gap-3">
            <span className="bg-orange-500/10 text-orange-500 text-[10px] font-black px-3 py-1 rounded-full border border-orange-500/20 tracking-widest uppercase">🔥 Streak: 1</span>
            <span className="text-xs font-bold text-slate-400">XP {user?.xp || 0}</span>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* ASIDE: LANGUAGES & LESSONS */}
        <aside className="w-56 border-r border-white/5 bg-[#050810] flex flex-col overflow-y-auto scrollbar-thin">
          <div className="p-4">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Languages</h2>
            <div className="grid grid-cols-1 gap-1">
                {languages.map(lang => (
                    <button 
                    key={lang.name} 
                    className={`p-2 text-left text-xs font-bold rounded-lg transition-all ${lang.name === currentLanguage.name ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:bg-white/5"}`} 
                    onClick={() => changeLanguage(lang.name)}
                    >
                    {lang.name}
                    </button>
                ))}
            </div>
          </div>

          <hr className="border-white/5" />

          <div className="p-4 flex-1">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Curriculum</h2>
            {lessons.map((l, idx) => (
                <div 
                key={l.id} 
                onClick={() => setCurrentLessonIndex(idx)} 
                className={`p-3 text-xs mb-1 cursor-pointer rounded-lg transition-all border-l-2 ${idx === currentLessonIndex ? "bg-blue-600/10 text-blue-400 border-blue-500" : "border-transparent text-slate-500 hover:bg-white/5"}`}
                >
                <p className="text-[9px] opacity-40 font-mono mb-1">MODULE {idx + 1}</p>
                <h4 className="font-bold truncate">{l.title}</h4>
                </div>
            ))}
          </div>
        </aside>

        <main className="flex flex-1 overflow-hidden">
          {/* CONTENT SECTION */}
          <section className="w-[450px] p-10 overflow-y-auto bg-[#020617] border-r border-white/5 scrollbar-thin">
            <h1 className="text-3xl font-black text-white italic tracking-tighter mb-6 uppercase">{current.title}</h1>
            <div className="text-slate-400 text-sm leading-relaxed mb-10 prose prose-invert">
                {current.content}
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => completeLesson(currentLanguage.name, current.id)} className="bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all uppercase tracking-widest text-[10px]">Mark Complete (+10 XP)</button>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={goPrevLesson} disabled={currentLessonIndex === 0} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl disabled:opacity-30 transition-all text-[10px] uppercase">Previous</button>
                <button onClick={goNextLesson} disabled={currentLessonIndex === lessons.length - 1} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl disabled:opacity-30 transition-all text-[10px] uppercase">Next</button>
              </div>
            </div>
          </section>

          {/* EDITOR SECTION */}
          <section className="flex-1 flex flex-col bg-[#050810]">
            <CodeEditor
              language={currentLanguage.name.toLowerCase()}
              starterCode={current.starterCode}
              expectedOutput={current.expectedOutput}
              solution={current.solution}
              onExecute={handleExecuteCode} // Pass the handler
              output={output} // Pass the output state
              isRunning={isRunning} // Pass the loading state
            />
          </section>
        </main>
      </div>
    </div>
  );
}






