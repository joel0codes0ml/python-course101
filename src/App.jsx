import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Mascot from "./components/Mascot.jsx";
import Login from "./Login.jsx";
import CodeEditor from "./components/CodeEditor.jsx";
import { onAuthChange, getUserProfile, updateUserProfile, logout, subscribeLeaderboard } from "./firebase";

// FULL CURRICULUM IMPORTS
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
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPaystackOpen, setIsPaystackOpen] = useState(false); 
  const RUN_LIMIT = 12;

  // PERSISTENCE & LEADERBOARD SYNC
  useEffect(() => {
    const unsubscribeAuth = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setUser({ uid: firebaseUser.uid, ...profile });
          
          const unsubscribeLeader = subscribeLeaderboard((data) => {
            setLeaderboard(data);
          });
          return () => unsubscribeLeader();
        } catch (err) {
          console.error("Session recovery failed:", err);
          setUser({ uid: firebaseUser.uid, username: "NINJA", xp: 0 });
        }
      } else {
        setUser(null);
      }
      setInitializing(false);
    });
    return () => unsubscribeAuth();
  }, []);

  const handleActivatePro = async () => {
    await updateUserProfile(user.uid, { isPro: true });
    setUser(prev => ({ ...prev, isPro: true }));
    setIsPaystackOpen(false);
    alert("Welcome to Zenin Pro! Access is now UNLIMITED.");
  };

  if (initializing) return (
    <div style={styles.loading}>
      <div className="sh-logo" style={{fontSize: '50px'}}>🌀</div>
      <h2 style={{marginTop: '20px', letterSpacing: '2px'}}>RESUMING_SESSION...</h2>
    </div>
  );

  if (!user) return <Login onLogin={setUser} />;

  const lessons = currentLanguage.lessons || [];
  const current = lessons[currentLessonIndex] || { title: "Coming Soon", content: "Stay tuned for more modules!" };
  const runsLeft = Math.max(0, RUN_LIMIT - (user?.dailyExecutions || 0));

  return (
    <PayPalScriptProvider options={{ "client-id": "test", currency: "USD" }}>
      <div style={styles.appContainer}>
        {/* HEADER NAV */}
        <nav style={styles.nav}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Mascot />
            <span style={styles.logo}>ZENIN<span style={{ color: '#ef4444' }}>LABS</span></span>
            
            {!user?.isPro ? (
              <button onClick={() => setIsPaystackOpen(true)} style={styles.upgradeBtn}>⚡ GO PRO</button>
            ) : (
              <span style={styles.proBadge}>👑 PRO MEMBER</span>
            )}
          </div>
          <div style={styles.navRight}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '15px' }}>
              <div style={styles.syncDot} />
              <span style={{ fontSize: '9px', color: '#475569' }}>SYNCED</span>
            </div>
            {!user?.isPro && (
              <span style={styles.runsText}>{runsLeft}/{RUN_LIMIT} RUNS LEFT</span>
            )}
            <span onClick={() => { if(window.confirm("Logout?")) logout(); }} style={styles.userBadge}>
              {user?.username?.toUpperCase() || 'NINJA'} | XP {user?.xp || 0}
            </span>
            <button onClick={() => logout()} style={styles.logoutBtn}>LOGOUT</button>
          </div>
        </nav>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* SIDEBAR - CURRICULUM & LEADERBOARD */}
          <aside style={styles.sidebar}>
            <div style={styles.curriculumHeader}>CURRICULUM</div>
            {languages.map(lang => (
              <button 
                key={lang.id}
                onClick={() => { setCurrentLanguage(lang); setCurrentLessonIndex(0); }}
                style={{ ...styles.langBtn, color: lang.id === currentLanguage.id ? '#ef4444' : '#94a3b8' }}
              >
                {lang.name} {lang.id === currentLanguage.id && "•"}
              </button>
            ))}
            
            <div style={{...styles.curriculumHeader, marginTop: '30px'}}>TOP 30 NINJAS</div>
            <div style={styles.leaderboardBox}>
              {leaderboard.map((u, i) => (
                <div key={i} style={styles.leaderRow}>
                  <span style={{color: '#94a3b8'}}>{i+1}. {u.username}</span>
                  <span style={{color: '#22c55e'}}>{u.xp}</span>
                </div>
              ))}
            </div>
          </aside>

          {/* MAIN LESSON PANEL */}
          <main style={styles.lessonContainer}>
            <div style={styles.moduleTag}>MODULE {currentLessonIndex + 1}</div>
            <h1 style={styles.lessonTitle}>{current.title}</h1>
            <div style={styles.contentBox}>
              <p style={styles.contentText}>{current.content}</p>
            </div>
            
            {/* VIEW SOLUTION SECTION */}
            <div style={styles.solutionSection}>
                <h4 style={styles.solLabel}>EXPECTED OUTPUT</h4>
                <div style={styles.solCode}>{current.expectedOutput}</div>
                <h4 style={styles.solLabel}>VIEW SOLUTION</h4>
                <pre style={styles.solCode}>{current.starterCode}</pre>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '30px', paddingBottom: '40px' }}>
              <button onClick={() => setCurrentLessonIndex(p => Math.max(0, p-1))} style={styles.btnPrev}>PREVIOUS</button>
              <button onClick={() => setCurrentLessonIndex(p => Math.min(lessons.length-1, p+1))} style={styles.btnNext}>NEXT LESSON</button>
            </div>
          </main>

          {/* CODE EDITOR PANEL */}
          <section style={{ flex: 1, backgroundColor: '#000' }}>
            <CodeEditor 
              user={user} setUser={setUser} 
              language={currentLanguage.id}
              starterCode={current.starterCode}
              expectedOutput={current.expectedOutput}
              setIsPaystackOpen={setIsPaystackOpen}
            />
          </section>
        </div>

        {/* PAYMENT MODAL */}
        {isPaystackOpen && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalCard}>
              <h2 style={{ color: '#fff', fontSize: '20px' }}>Unlock Zenin Pro</h2>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>Kenya or Global Card</p>
              <div style={styles.paymentMethodBox}>
                  <span style={styles.methodLabel}>KENYA (M-PESA / CARD)</span>
                  <button onClick={() => window.open("https://paystack.shop/pay/zdrj1fu6qq", "_blank")} style={styles.paystackLink}>PAY KES 500</button>
                  <button onClick={handleActivatePro} style={styles.verifyBtn}>I HAVE PAID VIA M-PESA</button>
              </div>
              <div style={{ margin: '15px 0', color: '#475569', fontSize: '10px', fontWeight: 'bold' }}>OR</div>
              <div style={styles.paymentMethodBoxPayPal}>
                  <PayPalButtons 
                    style={{ layout: 'vertical', shape: 'rect', height: 40 }}
                    onApprove={handleActivatePro}
                  />
              </div>
              <button onClick={() => setIsPaystackOpen(false)} style={styles.modalClose}>MAYBE LATER</button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .sh-logo { animation: spin 4s linear infinite; }
      `}</style>
    </PayPalScriptProvider>
  );
}

const styles = {
  appContainer: { display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: '#020617', color: '#fff', overflow: 'hidden' },
  nav: { height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', backgroundColor: '#000', borderBottom: '1px solid #1e293b' },
  logo: { marginLeft: '12px', fontWeight: '900', fontStyle: 'italic', fontSize: '20px', letterSpacing: '-1px' },
  upgradeBtn: { marginLeft: '20px', backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: '900', cursor: 'pointer' },
  proBadge: { marginLeft: '20px', color: '#22c55e', fontSize: '10px', fontWeight: '900', border: '1px solid #22c55e', padding: '4px 10px', borderRadius: '4px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '15px' },
  syncDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px #22c55e' },
  runsText: { color: '#475569', fontSize: '11px', fontWeight: 'bold' },
  userBadge: { color: '#22c55e', fontSize: '12px', fontWeight: 'bold', background: 'rgba(34, 197, 94, 0.1)', padding: '4px 12px', borderRadius: '20px', cursor: 'pointer' },
  logoutBtn: { background: 'none', border: 'none', color: '#475569', fontSize: '11px', cursor: 'pointer' },
  sidebar: { width: '220px', backgroundColor: '#000', borderRight: '1px solid #1e293b', overflowY: 'auto', display: 'flex', flexDirection: 'column' },
  curriculumHeader: { padding: '20px 16px 10px', fontSize: '10px', fontWeight: '800', color: '#475569' },
  langBtn: { width: '100%', textAlign: 'left', padding: '12px 20px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  leaderboardBox: { padding: '0 20px', flex: 1 },
  leaderRow: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '8px' },
  lessonContainer: { flex: '1 1 50%', backgroundColor: '#020617', padding: '40px', overflowY: 'auto', borderRight: '1px solid #1e293b' },
  moduleTag: { color: '#22c55e', fontSize: '11px', fontWeight: '900', marginBottom: '8px' },
  lessonTitle: { fontSize: '32px', fontWeight: '900', fontStyle: 'italic', marginBottom: '24px' },
  contentBox: { backgroundColor: 'rgba(255,255,255,0.03)', borderLeft: '4px solid #22c55e', padding: '24px', borderRadius: '8px', marginBottom: '40px' },
  contentText: { color: '#cbd5e1', fontSize: '15px', lineHeight: '1.7' },
  solutionSection: { marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed #1e293b' },
  solLabel: { fontSize: '10px', color: '#475569', marginBottom: '8px' },
  solCode: { display: 'block', padding: '15px', background: '#000', borderRadius: '8px', color: '#64748b', fontSize: '12px', fontFamily: 'monospace', marginBottom: '20px' },
  btnPrev: { flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: '#1e293b', color: '#fff', border: 'none', cursor: 'pointer' },
  btnNext: { flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: '#22c55e', color: '#000', border: 'none', cursor: 'pointer' },
  loading: { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#ef4444', fontFamily: 'monospace' },
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 },
  modalCard: { background: '#020617', border: '1px solid #1e293b', padding: '30px', borderRadius: '20px', width: '360px', textAlign: 'center' },
  modalClose: { background: 'none', border: 'none', color: '#475569', marginTop: '20px', cursor: 'pointer', fontSize: '11px' },
  paymentMethodBox: { padding: '15px', border: '1px solid #22c55e', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.05)', textAlign: 'left' },
  paymentMethodBoxPayPal: { padding: '15px', border: '1px solid #cbd5e1', borderRadius: '12px', background: '#fff', textAlign: 'left' },
  methodLabel: { fontSize: '9px', fontWeight: '900', color: '#22c55e', display: 'block', marginBottom: '10px' },
  paystackLink: { width: '100%', display: 'block', backgroundColor: '#22c55e', color: '#000', padding: '12px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginBottom: '5px' },
  verifyBtn: { width: '100%', backgroundColor: 'transparent', color: '#22c55e', border: 'none', padding: '5px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }
};
