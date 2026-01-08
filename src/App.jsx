import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Mascot from "./components/Mascot.jsx";
import Login from "./Login.jsx";
import CodeEditor from "./components/CodeEditor.jsx";
import Leaderboard from "./components/Leaderboard.jsx"; // IMPORT LEADERBOARD
import { onAuthChange, getUserProfile, updateUserProfile, logout, subscribeLeaderboard } from "./firebase";

// CURRICULUM IMPORTS
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
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false); // MODAL STATE
  const RUN_LIMIT = 12;

  useEffect(() => {
    let unsubscribeLeader;
    const recoveryTimeout = setTimeout(() => {
      if (initializing) {
        console.warn("Firebase timeout: Forcing UI");
        setInitializing(false);
      }
    }, 3000);

    const unsubscribeAuth = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setUser({ 
            uid: firebaseUser.uid, 
            xp: 0, 
            dailyExecutions: 0,
            streak: 0, // NEW
            ...profile 
          });
          unsubscribeLeader = subscribeLeaderboard((data) => setLeaderboard(data));
        } catch (err) {
          console.error("Profile recovery failed:", err);
          setUser({ uid: firebaseUser.uid, username: "NINJA", xp: 0 });
        }
      } else {
        setUser(null);
      }
      clearTimeout(recoveryTimeout);
      setInitializing(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeLeader) unsubscribeLeader();
      clearTimeout(recoveryTimeout);
    };
  }, []);

  if (initializing) return (
    <div style={styles.loading}>
      <div className="sh-logo" style={{fontSize: '50px'}}>🌀</div>
      <h2 style={{marginTop: '20px', letterSpacing: '2px'}}>RESUMING_SESSION...</h2>
    </div>
  );

  if (!user) return <Login onLogin={setUser} />;

  const lessons = currentLanguage.lessons || [];
  const current = lessons[currentLessonIndex] || { title: "End of Path", content: "Great job!" };
  const runsLeft = Math.max(0, RUN_LIMIT - (user?.dailyExecutions || 0));

  return (
    <PayPalScriptProvider options={{ "client-id": "test", currency: "USD" }}>
      <div style={styles.appContainer}>
        <nav style={styles.nav}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Mascot />
            <span style={styles.logo}>ZENIN<span style={{ color: '#ef4444' }}>LABS</span></span>
            {!user?.isPro && <button onClick={() => setIsPaystackOpen(true)} style={styles.upgradeBtn}>⚡ GO PRO</button>}
            
            {/* RANKINGS PLACEHOLDER */}
            <button onClick={() => setIsLeaderboardOpen(true)} style={styles.rankLink}>🏆 RANKINGS</button>
            <div style={styles.streakBadge}>🔥 {user?.streak || 0} DAY STREAK</div>
          </div>

          <div style={styles.navRight}>
            <div style={styles.syncContainer}><div style={styles.syncDot} /><span>SYNCED</span></div>
            {!user?.isPro && <span style={styles.runsText}>{runsLeft}/{RUN_LIMIT} RUNS</span>}
            <span style={styles.userBadge}>{user?.username?.toUpperCase()} | XP {user?.xp || 0}</span>
            <button onClick={() => logout()} style={styles.logoutBtn}>LOGOUT</button>
          </div>
        </nav>

        <div style={styles.workspace}>
          <aside style={styles.sidebar}>
            <div style={styles.curriculumHeader}>CURRICULUM</div>
            {languages.map(lang => (
              <button 
                key={lang.id}
                onClick={() => { setCurrentLanguage(lang); setCurrentLessonIndex(0); }}
                style={{ ...styles.langBtn, color: lang.id === currentLanguage.id ? '#ef4444' : '#94a3b8' }}
              >
                {lang.name}
              </button>
            ))}
            
            {/* COMPACT SIDEBAR LEADERBOARD PREVIEW */}
            <div style={{marginTop: 'auto'}}>
                <Leaderboard data={leaderboard.slice(0, 5)} compact={true} />
            </div>
          </aside>

          <main style={styles.lessonPanel}>
            <div style={styles.moduleTag}>MODULE {currentLessonIndex + 1}</div>
            <h1 style={styles.lessonTitle}>{current.title}</h1>
            <p style={styles.lessonText}>{current.content}</p>
            <div style={styles.solutionSection}>
                <h4 style={styles.solLabel}>EXPECTED OUTPUT</h4>
                <div style={styles.solCode}>{current.expectedOutput}</div>
                <h4 style={styles.solLabel}>SOLUTION (TYPE THIS OUT)</h4>
                <pre style={styles.solCode}>{current.starterCode}</pre>
            </div>
            <div style={styles.navBtns}>
              <button onClick={() => setCurrentLessonIndex(p => Math.max(0, p-1))} style={styles.btnPrev}>PREV</button>
              <button onClick={() => setCurrentLessonIndex(p => Math.min(lessons.length-1, p+1))} style={styles.btnNext}>NEXT</button>
            </div>
          </main>

          <section style={styles.editorPanel}>
            <CodeEditor 
              user={user} setUser={setUser} 
              language={currentLanguage.id}
              starterCode={current.starterCode}
              expectedOutput={current.expectedOutput}
              setIsPaystackOpen={setIsPaystackOpen}
            />
          </section>
        </div>

        {/* FULL TIER LEADERBOARD MODAL */}
        {isLeaderboardOpen && (
          <div style={styles.modalOverlay} onClick={() => setIsLeaderboardOpen(false)}>
            <div style={styles.leaderboardModal} onClick={e => e.stopPropagation()}>
               <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                  <h2 style={{margin: 0}}>GLOBAL RANKINGS</h2>
                  <button onClick={() => setIsLeaderboardOpen(false)} style={styles.modalCloseX}>✕</button>
               </div>
               <div style={styles.tierGrid}>
                  <TierColumn title="DIAMOND" xp="801+" data={leaderboard.filter(u => u.xp >= 801).slice(0,20)} color="#3b82f6" />
                  <TierColumn title="GOLD" xp="601-800" data={leaderboard.filter(u => u.xp >= 601 && u.xp <= 800).slice(0,20)} color="#f59e0b" />
                  <TierColumn title="SILVER" xp="401-600" data={leaderboard.filter(u => u.xp >= 401 && u.xp <= 600).slice(0,20)} color="#94a3b8" />
                  <TierColumn title="BRONZE" xp="201-400" data={leaderboard.filter(u => u.xp >= 201 && u.xp <= 400).slice(0,20)} color="#b45309" />
                  <TierColumn title="IRON" xp="0-200" data={leaderboard.filter(u => u.xp <= 200).slice(0,20)} color="#475569" />
               </div>
            </div>
          </div>
        )}
      </div>
      <style>{`.sh-logo { animation: spin 4s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </PayPalScriptProvider>
  );
}

// Sub-component for Tiers
const TierColumn = ({ title, xp, data, color }) => (
  <div style={styles.tierCol}>
    <div style={{...styles.tierHeader, borderBottom: `2px solid ${color}`}}>
      <div style={{fontSize: '10px', color: color}}>{title}</div>
      <div style={{fontSize: '9px', color: '#475569'}}>{xp} XP</div>
    </div>
    <div style={styles.tierList}>
      {data.map((ninja, i) => (
        <div key={i} style={styles.tierRow}>
          <span>{i+1}. {ninja.username}</span>
          <span>{ninja.xp}</span>
        </div>
      ))}
    </div>
  </div>
);

const styles = {
  // ... existing styles ...
  appContainer: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#020617', color: '#fff', overflow: 'hidden' },
  nav: { height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', backgroundColor: '#000', borderBottom: '1px solid #1e293b' },
  logo: { marginLeft: '12px', fontWeight: '900', fontStyle: 'italic', fontSize: '20px' },
  upgradeBtn: { marginLeft: '20px', backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: '900', cursor: 'pointer' },
  rankLink: { marginLeft: '20px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' },
  streakBadge: { marginLeft: '15px', color: '#fb923c', fontSize: '11px', fontWeight: '900' },
  navRight: { display: 'flex', alignItems: 'center', gap: '15px' },
  syncContainer: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#475569' },
  syncDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px #22c55e' },
  runsText: { color: '#475569', fontSize: '11px', fontWeight: 'bold' },
  userBadge: { color: '#22c55e', fontSize: '12px', fontWeight: 'bold', background: 'rgba(34, 197, 94, 0.1)', padding: '4px 12px', borderRadius: '20px' },
  logoutBtn: { background: 'none', border: 'none', color: '#475569', fontSize: '11px', cursor: 'pointer' },
  workspace: { display: 'flex', flex: 1, overflow: 'hidden' },
  sidebar: { width: '200px', backgroundColor: '#000', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column' },
  curriculumHeader: { padding: '20px 16px 10px', fontSize: '10px', fontWeight: '800', color: '#475569' },
  langBtn: { width: '100%', textAlign: 'left', padding: '12px 20px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  lessonPanel: { flex: '1 1 50%', padding: '40px', overflowY: 'auto', borderRight: '1px solid #1e293b' },
  editorPanel: { flex: '1 1 50%', backgroundColor: '#000' },
  moduleTag: { color: '#22c55e', fontSize: '11px', fontWeight: '900' },
  lessonTitle: { fontSize: '28px', fontWeight: '900', margin: '15px 0' },
  lessonText: { color: '#cbd5e1', lineHeight: '1.7', fontSize: '15px' },
  solutionSection: { marginTop: '40px', borderTop: '1px dashed #1e293b', paddingTop: '20px' },
  solLabel: { fontSize: '10px', color: '#475569', marginBottom: '8px' },
  solCode: { display: 'block', padding: '15px', background: '#000', borderRadius: '8px', color: '#64748b', fontSize: '12px', marginBottom: '20px' },
  navBtns: { display: 'flex', gap: '12px', marginTop: '30px', paddingBottom: '30px' },
  btnPrev: { flex: 1, padding: '12px', background: '#1e293b', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer' },
  btnNext: { flex: 1, padding: '12px', background: '#22c55e', border: 'none', color: '#000', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' },
  loading: { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#ef4444', fontFamily: 'monospace' },
  
  // MODAL STYLES
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  leaderboardModal: { backgroundColor: '#020617', width: '90%', maxWidth: '1200px', height: '80vh', borderRadius: '20px', border: '1px solid #1e293b', padding: '30px', display: 'flex', flexDirection: 'column' },
  modalCloseX: { background: 'none', border: 'none', color: '#475569', fontSize: '20px', cursor: 'pointer' },
  tierGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', flex: 1, minHeight: 0 },
  tierCol: { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  tierHeader: { padding: '15px', textAlign: 'center' },
  tierList: { padding: '10px', overflowY: 'auto', flex: 1 },
  tierRow: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '8px 4px', borderBottom: '1px solid rgba(255,255,255,0.05)' }
};
