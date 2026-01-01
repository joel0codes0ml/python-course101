import { useState } from "react";
import Mascot from "./components/Mascot.jsx";
import CodeEditor from "./components/CodeEditor.jsx";
// Add all your imports here
import { pythonLessons } from "./courses/python.js";
import { clLessons } from "./courses/clessons.js";
import { cppLessons } from "./courses/cpplessons.js";
import { goLessons } from "./courses/golessons.js";
import { sqlLessons } from "./courses/sqllessons.js";
import { rLessons } from "./courses/Rlessons.js"; // New
import { htmlLessons } from "./courses/html.js"; // New
import { cssLessons } from "./courses/css.js"; // New

const languages = [
  { name: "Python", lessons: pythonLessons, id: "python" },
  { name: "C", lessons: clLessons, id: "c" },
  { name: "C++", lessons: cppLessons, id: "cpp" },
  { name: "Go", lessons: goLessons, id: "go" },
  { name: "SQL", lessons: sqlLessons, id: "sqlite3" },
  { name: "R", lessons: rLessons, id: "r" },
  { name: "HTML", lessons: htmlLessons, id: "html" },
  { name: "CSS", lessons: cssLessons, id: "css" }
];

export default function App({ user }) {
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const lessons = currentLanguage.lessons;
  const current = lessons[currentLessonIndex] || { title: "End of Path", content: "Select a lesson to begin." };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: '#020617', color: '#fff', overflow: 'hidden', margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
      
      {/* HEADER: Pitch Black */}
      <nav style={{ height: '56px', display: 'flex', alignItems: 'center', padding: '0 24px', backgroundColor: '#000', borderBottom: '1px solid #1e293b', flexShrink: 0 }}>
        <Mascot />
        <span style={{ marginLeft: '12px', fontWeight: '900', fontStyle: 'italic', fontSize: '20px', letterSpacing: '-1px' }}>ZENIN<span style={{ color: '#ef4444' }}>LABS</span></span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: 'bold', background: 'rgba(34, 197, 94, 0.1)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>XP {user?.xp || 0}</span>
        </div>
      </nav>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* PANEL 1: SIDEBAR (NAVIGATION) */}
        <aside style={{ width: '220px', backgroundColor: '#000', borderRight: '1px solid #1e293b', overflowY: 'auto', flexShrink: 0 }}>
          <div style={{ padding: '20px 16px 10px', fontSize: '10px', fontWeight: '800', color: '#475569', letterSpacing: '1px' }}>CURRICULUM</div>
          {languages.map(lang => (
            <button 
              key={lang.name}
              onClick={() => { setCurrentLanguage(lang); setCurrentLessonIndex(0); }}
              style={{ width: '100%', textAlign: 'left', padding: '12px 20px', backgroundColor: 'transparent', color: lang.name === currentLanguage.name ? '#ef4444' : '#94a3b8', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
            >
              {lang.name} {lang.name === currentLanguage.name && "•"}
            </button>
          ))}
        </aside>

        {/* WORKSPACE: HALF LESSON / HALF EDITOR */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* PANEL 2: LESSON (50%) */}
          <main style={{ flex: '1 1 50%', backgroundColor: '#020617', padding: '40px', overflowY: 'auto', borderRight: '1px solid #1e293b' }}>
            <div style={{ color: '#22c55e', fontSize: '11px', fontWeight: '900', letterSpacing: '2px', marginBottom: '8px' }}>MODULE {currentLessonIndex + 1}</div>
            <h1 style={{ fontSize: '32px', fontWeight: '900', fontStyle: 'italic', color: '#fff', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '-1px' }}>{current.title}</h1>
            
            {/* GREEN PLACEHOLDER BOX */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderLeft: '4px solid #22c55e', padding: '24px', borderRadius: '8px', marginBottom: '40px' }}>
              <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>{current.content}</p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setCurrentLessonIndex(p => Math.max(0, p-1))} style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: '#1e293b', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>PREVIOUS</button>
              <button onClick={() => setCurrentLessonIndex(p => Math.min(lessons.length-1, p+1))} style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: '#22c55e', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>NEXT LESSON</button>
            </div>
          </main>

          {/* PANEL 3: CODE EDITOR (50%) */}
          <section style={{ flex: '1 1 50%', backgroundColor: '#000', position: 'relative' }}>
            <CodeEditor 
              language={currentLanguage.id}
              version={currentLanguage.version}
              starterCode={current.starterCode}
              expectedOutput={current.expectedOutput}
              solution={current.solution}
            />
          </section>

        </div>
      </div>
    </div>
  );
}
