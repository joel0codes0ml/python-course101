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
    <PayPalScriptProvider options={{ "client-id": "YOUR_PAYPAL_CLIENT_ID" }}>
      <div style={styles.appContainer}>
        
        {/* HEADER */}
        <nav style={styles.nav}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Mascot />
            <span style={styles.logo}>ZENIN<span style={{ color: '#ef4444' }}>LABS</span></span>
            
            {/* TOP LEFT PAYMENT SECTION */}
            <div style={{ marginLeft: '24px', display: 'flex', alignItems: 'center' }}>
              {!user?.isPro ? (
                <button onClick={() => setIsPaypalOpen(true)} style={styles.upgradeBtn}>
                  ✨ GET PRO
                </button>
              ) : (
                <span style={styles.proBadge}>👑 PRO MEMBER</span>
              )}
            </div>
          </div>

          <div style={styles.navRight}>
              {!user?.isPro && (
                <span style={styles.runsText}>{8 - (user?.dailyExecutions || 0)}/8 RUNS LEFT</span>
              )}
              <span style={styles.userBadge}>
                {user?.username || 'NINJA'} | XP {user?.xp || 0}
              </span>
          </div>
        </nav>

        {/* MAIN LAYOUT */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
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

        {/* PAYPAL MODAL */}
        {isPaypalOpen && (
          <PayPalModal 
            user={user} 
            setUser={setUser} 
            onClose={() => setIsPaypalOpen(false)} 
          />
        )}
      </div>
    </PayPalScriptProvider>
  );
}

// SUB-COMPONENT: PAYPAL MODAL
function PayPalModal({ user, setUser, onClose }) {
  const [plan, setPlan] = useState("monthly");
  const price = plan === "monthly" ? "2.50" : "20.00";

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalCard}>
        <h2 style={{ color: '#fff', marginBottom: '8px' }}>Zenin Pro</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>Unlimited executions and full curriculum access.</p>
        
        <div style={styles.toggleGroup}>
          <button onClick={() => setPlan("monthly")} style={plan === "monthly" ? styles.toggleActive : styles.toggleInactive}>Monthly ($2.50)</button>
          <button onClick={() => setPlan("yearly")} style={plan === "yearly" ? styles.toggleActive : styles.toggleInactive}>Yearly ($20)</button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <PayPalButtons 
            style={{ layout: "vertical", shape: "rect" }}
            createOrder={(data, actions) => actions.order.create({ purchase_units: [{ amount: { value: price } }] })}
            onApprove={async (data, actions) => {
              const details = await actions.order.capture();
              await updateUserProfile(user.uid, { isPro: true, paypalId: details.id });
              setUser(prev => ({ ...prev, isPro: true }));
              onClose();
            }}
          />
        </div>
        <button onClick={onClose} style={styles.modalClose}>Maybe later</button>
      </div>
    </div>
  );
}

const styles = {
  appContainer: { display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: '#020617', color: '#fff', overflow: 'hidden', fontFamily: 'sans-serif' },
  nav: { height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', backgroundColor: '#000', borderBottom: '1px solid #1e293b', flexShrink: 0 },
  logo: { marginLeft: '12px', fontWeight: '900', fontStyle: 'italic', fontSize: '20px', letterSpacing: '-1px' },
  upgradeBtn: { backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '6px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' },
  proBadge: { color: '#f59e0b', fontSize: '11px', fontWeight: '900', letterSpacing: '1px' },
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
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalCard: { background: '#020617', border: '1px solid #1e293b', padding: '32px', borderRadius: '20px', width: '360px', textAlign: 'center' },
  toggleGroup: { display: 'flex', background: '#000', padding: '4px', borderRadius: '10px', border: '1px solid #1e293b' },
  toggleActive: { flex: 1, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: 'bold', cursor: 'pointer' },
  toggleInactive: { flex: 1, background: 'transparent', color: '#64748b', border: 'none', padding: '10px', cursor: 'pointer' },
  modalClose: { background: 'none', border: 'none', color: '#475569', marginTop: '20px', cursor: 'pointer', fontSize: '12px' }
};
