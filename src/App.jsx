// src/App.jsx
import { useState, useEffect } from "react";
import Login from "./Login.jsx";
import Mascot from "./components/Mascot.jsx";
import CodeEditor from "./components/CodeEditor.jsx";
import { onAuthChange } from "./firebase.js";

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
  { name: "Python", lessons: pythonLessons },
  { name: "C", lessons: clLessons },
  { name: "C++", lessons: cppLessons },
  { name: "Go", lessons: goLessons },
  { name: "R", lessons: rLessons },
  { name: "SQL", lessons: sqlLessons },
  { name: "HTML", lessons: htmlLessons },
  { name: "CSS", lessons: cssLessons }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const lessons = currentLanguage.lessons;
  const current = lessons[currentLessonIndex];

  // Subscribe to Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthChange((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  if (!user) return <Login onLogin={setUser} />;

  const goNextLesson = () => currentLessonIndex < lessons.length - 1 && setCurrentLessonIndex(currentLessonIndex + 1);
  const goPrevLesson = () => currentLessonIndex > 0 && setCurrentLessonIndex(currentLessonIndex - 1);
  const changeLanguage = (langName) => {
    const selected = languages.find(l => l.name === langName);
    setCurrentLanguage(selected);
    setCurrentLessonIndex(0);
  };

  return (
    <div className="h-screen bg-[#020617] text-white flex flex-col">
      <nav className="h-14 flex items-center px-6 gap-4 border-b">
        <Mascot />
        <span className="font-black italic">ZENINLABS</span>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-48 border-r bg-gray-800 p-4 flex flex-col gap-2 overflow-y-auto">
          <h2 className="text-lg font-bold mb-2">Languages</h2>
          {languages.map(lang => (
            <button key={lang.name} className={`p-2 rounded ${lang.name === currentLanguage.name ? "bg-green-600" : "hover:bg-gray-700"}`} onClick={() => changeLanguage(lang.name)}>
              {lang.name}
            </button>
          ))}
          <hr className="my-2 border-gray-600" />
          <h2 className="text-lg font-bold mb-2">Lessons</h2>
          {lessons.map((l, idx) => (
            <div key={l.id} onClick={() => setCurrentLessonIndex(idx)} className={`p-2 hover:bg-white/5 cursor-pointer rounded ${idx === currentLessonIndex ? "bg-white/10" : ""}`}>
              {l.title}
            </div>
          ))}
        </aside>

        <main className="flex flex-1">
          <section className="w-1/2 p-6 overflow-y-auto">
            <h1 className="text-xl font-black">{current.title}</h1>
            <pre className="mt-4 text-sm whitespace-pre-wrap">{current.content}</pre>
            <div className="flex gap-2 mt-6">
              <button onClick={goPrevLesson} disabled={currentLessonIndex === 0} className="bg-gray-700 px-4 py-2 rounded disabled:opacity-50">Previous</button>
              <button onClick={goNextLesson} disabled={currentLessonIndex === lessons.length - 1} className="bg-green-600 px-4 py-2 rounded disabled:opacity-50">Next</button>
            </div>
          </section>

          <section className="w-1/2 border-l p-4 flex flex-col">
            <CodeEditor
              language={currentLanguage.name.toLowerCase()}
              starterCode={current.starterCode}
              expectedOutput={current.expectedOutput}
              solution={current.solution}
            />
          </section>
        </main>
      </div>
    </div>
  );
}





