import { useState, useEffect } from "react";
import Mascot from "./components/Mascot.jsx";
import CodeEditor from "./components/CodeEditor.jsx";
import Login from "./Login.jsx";
import { onAuthChange, getUserProfile, updateUserProfile } from "./firebase";
// Import PayPal components
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// Keep all your course data imports
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
  const [isPaystackOpen, setIsPaystackOpen] = useState(false); 

  const RUN_LIMIT = 12; 

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

  const handleActivatePro = async () => {
    await updateUserProfile(user.uid, { isPro: true });
    setUser(prev => ({ ...prev, isPro: true }));
    setIsPaystackOpen(false);
    alert("Welcome to Zenin Pro! Your unlimited access is now active.");
  };

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
          
          {!user?.isPro ? (
            <button onClick={() => setIsPaystackOpen(true)} style={styles.upgradeBtn}>
              ⚡ GO PRO
            </button>
          ) : (
            <span style={styles.proBadge}>👑 PRO MEMBER</span>
          )}
        </div>

        <div style={styles.navRight}>
            {!user?.isPro && (
              <span style={styles.runsText}>
                {Math.max(0, RUN_LIMIT - (user?.dailyExecutions || 0))}/{RUN_LIMIT} RUNS LEFT
              </span>
            )}
            <span style={styles.userBadge}>
              {user?.username?.toUpperCase() || 'NINJA'} | XP {user?.xp || 0}
            </span>
        </div>
      </nav>

      {/* MAIN BODY */}
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

      {/* MULTI-GATEWAY MODAL */}
      {isPaystackOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ color: '#fff', fontSize: '20px' }}>Unlock Zenin Pro</h2>
              <p style={{ color: '#94a3b8', fontSize: '13px' }}>Select your preferred payment method.</p>
            </div>

            {/* PAYSTACK SECTION */}
            <div style={styles.paymentMethodBox}>
                <span style={styles.methodLabel}>KENYA (M-PESA / CARD)</span>
                <a 
                  href="https://paystack.shop/pay/zdrj1fu6qq" 
                  target="_blank" 
                  rel="noreferrer"
                  style={styles.paystackLink}
                >
                  PAY KES 500
                </a>
                <button onClick={handleActivatePro} style={styles.verifyBtn}>
                  I HAVE PAID VIA M-PESA
                </button>
            </div>

            <div style={{ margin: '15px 0', color: '#475569', fontSize: '10px', fontWeight: 'bold' }}>OR</div>

            {/* PAYPAL SECTION */}
            <div style={styles.paymentMethodBoxPayPal}>
                <span style={{...styles.methodLabel, color: '#003087'}}>GLOBAL (PAYPAL / CARD)</span>
                <PayPalButtons 
                  style={{ layout: 'vertical', shape: 'rect', height: 40 }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [{ amount: { value: "4.00" } }]
                    });
                  }}
                  onApprove={handleActivatePro}
                />
            </div>

            <button onClick={() => setIsPaystackOpen(false)} style={styles.modalClose}>MAYBE LATER</button>
          </div>
        </div>
      )}
    </div>
    </PayPalScriptProvider>
  );
}

const styles = {
  appContainer: { display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: '#020617', color: '#fff', overflow: 'hidden', margin: 0, padding: 0, fontFamily: 'sans-serif' },
  nav: { height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', backgroundColor: '#000', borderBottom: '1px solid #1e293b', flexShrink: 0 },
  logo: { marginLeft: '12px', fontWeight: '900', fontStyle: 'italic', fontSize: '20px', letterSpacing: '-1px' },
  upgradeBtn: { marginLeft: '20px', backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 0 15px rgba(245, 158, 11, 0.2)' },
  proBadge: { marginLeft: '20px', color: '#22c55e', fontSize: '10px', fontWeight: '900', border: '1px solid #22c55e', padding: '4px 10px', borderRadius: '4px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '20px' },
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
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 },
  modalCard: { background: '#020617', border: '1px solid #1e293b', padding: '30px', borderRadius: '20px', width: '360px', textAlign: 'center' },
  modalClose: { background: 'none', border: 'none', color: '#475569', marginTop: '20px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' },
  paymentMethodBox: { padding: '15px', border: '1px solid #22c55e', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.05)', textAlign: 'left' },
  paymentMethodBoxPayPal: { padding: '15px', border: '1px solid #cbd5e1', borderRadius: '12px', background: '#fff', textAlign: 'left' },
  methodLabel: { fontSize: '9px', fontWeight: '900', color: '#22c55e', display: 'block', marginBottom: '10px' },
  paystackLink: { display: 'block', backgroundColor: '#22c55e', color: '#000', padding: '12px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center', marginBottom: '5px' },
  verifyBtn: { width: '100%', backgroundColor: 'transparent', color: '#22c55e', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }
};
