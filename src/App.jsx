import { useState, useEffect } from "react";
import Mascot from "./components/Mascot.jsx";
import CodeEditor from "./components/CodeEditor.jsx";
import Login from "./Login.jsx";
import { onAuthChange, getUserProfile, updateUserProfile } from "./firebase";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

// Course Data Imports
import { pythonLessons } from "./courses/python.js";
import { clLessons } from "./courses/clessons.js";
import { cppLessons } from "./courses/cpplessons.js";
import { goLessons } from "./courses/golessons.js";
import { sqlLessons } from "./courses/sqllessons.js";
import { rLessons } from "./courses/Rlessons.js";
import { htmlLessons } from "./courses/html.js";
import { cssLessons } from "./courses/css.js";

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

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPaypalOpen, setIsPaypalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setUser({ uid: firebaseUser.uid, ...profile });
      } else {
        setUser(null);
      }
      setInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  if (initializing) return <div style={styles.loading}>SYSTEM_INITIALIZING...</div>;
  if (!user) return <Login onLogin={setUser} />;

  const lessons = currentLanguage.lessons;
  const current = lessons[currentLessonIndex] || { title: "End of Path", content: "Select a lesson to begin." };

  return (
    <PayPalScriptProvider options={{ 
      "client-id": "AdCbJRCE9syXhIQUg7dpVLTFtiqlqhXIrLDx3F_ynEV2uEi4Zj9yMjTj_xln6WqafD2WkPiPMqsFs7j5", 
      currency: "USD" 
    }}>
      <div style={styles.appContainer}>
        
        {/* HEADER */}
        <nav style={styles.nav}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Mascot />
            <span style={styles.logo}>ZENIN<span style={{ color: '#ef4444' }}>LABS</span></span>
            
            {/* TOP LEFT UPGRADE BUTTON */}
            {!user?.isPro && (
              <button 
                onClick={() => setIsPaypalOpen(true)} 
                style={styles.upgradeBtn}
              >
                ⚡ GET PRO
              </button>
            )}
            {user?.isPro && (
              <span style={styles.proBadge}>👑 PRO MEMBER</span>
            )}
          </div>

          <div style={styles.navRight}>
              {!user?.isPro && (
                <span style={styles.runsText}>
                  {8 - (user?.dailyExecutions || 0)}/8 RUNS LEFT
                </span>
              )}
              <span style={styles.userBadge}>
                {user?.username || 'NINJA'} | XP {user?.xp || 0}
              </span>
          </div>
        </nav>

        {/* MAIN BODY */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* SIDEBAR */}
          <aside style={styles.sidebar}>
            <div style={styles.curriculumHeader}>CURRICULUM</div>
            {languages.map(lang => (
              <button 
                key={lang.name}
                onClick={() => { setCurrentLanguage(lang); setCurrentLessonIndex(0); }}
                style={{ ...styles.langBtn, color: lang.name === currentLanguage.name ? '#ef4444' : '#94a3b8' }}
              >
                {lang.name} {lang.name === currentLanguage.name && "•"}
              </button>
            ))}
          </aside>

          {/* LESSON & EDITOR */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <main style={styles.lessonContainer}>
              <div style={styles.moduleTag}>MODULE {currentLessonIndex + 1}</div>
              <h1 style={styles.lessonTitle}>{current.title}</h1>
              <div style={styles.contentBox}>
                <p style={styles.contentText}>{current.content}</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setCurrentLessonIndex(p => Math.max(0, p-1))} style={styles.btnPrev}>PREVIOUS</button>
                <button onClick={() => setCurrentLessonIndex(p => Math.min(lessons.length-1, p+1))} style={styles.btnNext}>NEXT LESSON</button>
              </div>
            </main>

            <section style={{ flex: '1 1 50%', backgroundColor: '#000', position: 'relative' }}>
              <CodeEditor 
                user={user}
                setUser={setUser}
                language={currentLanguage.id}
                starterCode={current.starterCode}
                expectedOutput={current.expectedOutput}
              />
            </section>
          </div>
        </div>

        {/* PAYPAL CHECKOUT MODAL */}
        {isPaypalOpen && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalCard}>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ color: '#fff', margin: '0 0 10px 0' }}>Go Pro</h2>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Unlimited access to all coding paths.</p>
              </div>

              <div style={{ minHeight: '150px' }}>
                <PayPalButtons 
                  style={{ layout: "vertical", shape: "rect", color: "gold" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [{
                        description: "ZeninLabs Pro Monthly",
                        amount: { value: "2.50" }
                      }]
                    });
                  }}
                  onApprove={async (data, actions) => {
                    const details = await actions.order.capture();
                    // Update Firebase
                    await updateUserProfile(user.uid, { isPro: true, paymentId: details.id });
                    // Update Local State
                    setUser(prev => ({ ...prev, isPro: true }));
                    setIsPaypalOpen(false);
                    alert("Welcome to the elite, Ninja! You are now PRO.");
                  }}
                />
              </div>

              <button onClick={() => setIsPaypalOpen(false)} style={styles.modalClose}>
                Maybe later
              </button>
            </div>
          </div>
        )}
      </div>
    </PayPalScriptProvider>
  );
}

const styles = {
  appContainer: { display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: '#020617', color: '#fff', overflow: 'hidden', fontFamily: 'sans-serif' },
  nav: { height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', backgroundColor: '#000', borderBottom: '1px solid #1e293b', flexShrink: 0 },
  logo: { marginLeft: '12px', fontWeight: '900', fontStyle: 'italic', fontSize: '20px', letterSpacing: '-1px' },
  upgradeBtn: { marginLeft: '24px', backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '4px', fontSize: '11px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)' },
  proBadge: { marginLeft: '24px', color: '#22c55e', fontSize: '10px', fontWeight: '900', border: '1px solid #22c55e', padding: '4px 10px', borderRadius: '4px' },
  navRight: { display: 'flex', gap: '20px', alignItems: 'center' },
  runsText: { color: '#475569', fontSize: '11px', fontWeight: 'bold' },
  userBadge: { color: '#22c55e', fontSize: '12px', fontWeight: 'bold', background: 'rgba(34, 197, 94, 0.1)', padding: '4px 12px', borderRadius: '20px' },
  sidebar: { width: '220px', backgroundColor: '#000', borderRight: '1px solid #1e293b', overflowY: 'auto' },
  curriculumHeader: { padding: '20px 16px 10px', fontSize: '10px', fontWeight: '800', color: '#475569', letterSpacing: '1px' },
  langBtn: { width: '100%', textAlign: 'left', padding: '12px 20px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  lessonContainer: { flex: '1 1 50%', backgroundColor: '#020617', padding: '40px', overflowY: 'auto', borderRight: '1px solid #1e293b' },
  moduleTag: { color: '#22c55e', fontSize: '11px', fontWeight: '900', letterSpacing: '2px', marginBottom: '8px' },
  lessonTitle: { fontSize: '32px', fontWeight: '900', fontStyle: 'italic', color: '#fff', marginBottom: '24px', textTransform: 'uppercase' },
  contentBox: { backgroundColor: 'rgba(255,255,255,0.03)', borderLeft: '4px solid #22c55e', padding: '24px', borderRadius: '8px', marginBottom: '40px' },
  contentText: { color: '#cbd5e1', fontSize: '15px', lineHeight: '1.7' },
  btnPrev: { flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: '#1e293b', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  btnNext: { flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: '#22c55e', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  loading: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#ef4444', fontFamily: 'monospace' },
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
  modalCard: { background: '#020617', border: '1px solid #1e293b', padding: '40px', borderRadius: '24px', width: '360px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' },
  modalClose: { background: 'none', border: 'none', color: '#475569', marginTop: '24px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }
};
