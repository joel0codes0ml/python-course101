import { useState, useEffect } from "react";
import { onAuthChange, getUserProfile, logout, subscribeLeaderboard } from "./firebase";
import CodeEditor from "./components/CodeEditor.jsx";
import Login from "./Login.jsx";

// ... (Your languages/lessons arrays here) ...

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false); // MODAL STATE
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPaystackOpen, setIsPaystackOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (u) => {
      if (u) {
        const profile = await getUserProfile(u.uid);
        setUser({ uid: u.uid, username: u.displayName, ...profile });
        subscribeLeaderboard(setLeaderboard);
      } else { setUser(null); }
      setInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  if (initializing) return <div style={styles.loading}>RESUMING SESSION...</div>;
  if (!user) return <Login onLogin={setUser} />;

  const currentLesson = currentLanguage.lessons[currentLessonIndex] || {};
  const runsLeft = 12 - (user.dailyExecutions || 0);

  return (
    <div style={styles.appContainer}>
      {/* TOP NAV */}
      <nav style={styles.nav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={styles.logo}>ZENIN<span style={{ color: '#ef4444' }}>LABS</span></span>
          <button onClick={() => setIsPaystackOpen(true)} style={styles.proBtn}>⚡ GO PRO</button>
        </div>
        <div style={styles.navRight}>
          <span style={styles.syncStatus}>● SYNCED</span>
          <span style={styles.runsText}>{user.isPro ? "UNLIMITED" : `${runsLeft}/12 RUNS LEFT`}</span>
          <span style={styles.userInfo}>{user.username?.toUpperCase()} | XP {user.xp || 0}</span>
          <button onClick={() => logout()} style={styles.logoutLink}>LOGOUT</button>
        </div>
      </nav>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* SIDEBAR - RESTORED ORIGINAL */}
        <aside style={styles.sidebar}>
          <div style={styles.sideSection}>
            <div style={styles.sideLabel}>CURRICULUM</div>
            <div style={styles.langList}>
              {languages.map(lang => (
                <span 
                  key={lang.id} 
                  onClick={() => setCurrentLanguage(lang)}
                  style={{...styles.langItem, color: currentLanguage.id === lang.id ? '#fff' : '#475569'}}
                >
                  {lang.name}
                </span>
              ))}
            </div>
          </div>

          {/* LEADERBOARD TRIGGER */}
          <div style={{marginTop: 'auto', padding: '20px', borderTop: '1px solid #1e293b'}}>
             <button onClick={() => setShowLeaderboard(true)} style={styles.boardBtn}>🏆 LEADERBOARD</button>
          </div>
        </aside>

        {/* LESSON AREA */}
        <main style={styles.lessonArea}>
          <div style={styles.scrollContent}>
            <div style={styles.moduleTag}>MODULE {currentLessonIndex + 1}</div>
            <h1 style={styles.lessonTitle}>{currentLessonIndex + 1}: {currentLesson.title}</h1>
            <p style={styles.lessonText}>{currentLesson.content}</p>
            
            {/* Solution Helpers */}
            <div style={styles.helpBox}>
              <div style={styles.helpLabel}>EXPECTED OUTPUT</div>
              <div style={styles.helpCode}>{currentLesson.expectedOutput}</div>
              <div style={styles.helpLabel}>HINT / SOLUTION</div>
              <pre style={styles.helpCode}>{currentLesson.starterCode}</pre>
            </div>

            <div style={styles.lessonNav}>
              <button onClick={() => setCurrentLessonIndex(p => Math.max(0, p-1))} style={styles.navBtn}>PREVIOUS</button>
              <button onClick={() => setCurrentLessonIndex(p => p+1)} style={styles.nextBtn}>NEXT LESSON</button>
            </div>
          </div>
        </main>

        {/* EDITOR */}
        <section style={{ flex: 1 }}>
          <CodeEditor 
            user={user} setUser={setUser} 
            setIsPaystackOpen={setIsPaystackOpen}
            language={currentLanguage.id} 
            starterCode={currentLesson.starterCode} 
            expectedOutput={currentLesson.expectedOutput} 
          />
        </section>
      </div>

      {/* LEADERBOARD OVERLAY */}
      {showLeaderboard && (
        <div style={styles.overlay} onClick={() => setShowLeaderboard(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={{margin: '0 0 20px 0'}}>TOP 30 NINJAS</h3>
            {leaderboard.map((u, i) => (
              <div key={i} style={styles.boardRow}>
                <span>{i+1}. {u.username}</span>
                <span style={{color: '#22c55e'}}>{u.xp} XP</span>
              </div>
            ))}
            <button onClick={() => setShowLeaderboard(false)} style={styles.closeBtn}>CLOSE</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  appContainer: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#000', color: '#fff', fontFamily: 'Inter, sans-serif' },
  nav: { height: '60px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 25px' },
  logo: { fontWeight: '900', fontSize: '18px', letterSpacing: '1px' },
  proBtn: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' },
  navRight: { display: 'flex', alignItems: 'center', gap: '20px', fontSize: '11px', fontWeight: 'bold' },
  syncStatus: { color: '#22c55e' },
  runsText: { color: '#475569' },
  userInfo: { color: '#fff' },
  logoutLink: { background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '11px' },
  sidebar: { width: '240px', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column' },
  sideSection: { padding: '25px' },
  sideLabel: { fontSize: '10px', color: '#475569', fontWeight: 'bold', marginBottom: '15px' },
  langList: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  langItem: { fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' },
  boardBtn: { width: '100%', padding: '10px', background: '#1e293b', border: 'none', color: '#fff', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' },
  lessonArea: { flex: 0.8, borderRight: '1px solid #1e293b', overflow: 'hidden' },
  scrollContent: { height: '100%', overflowY: 'auto', padding: '40px' },
  moduleTag: { color: '#22c55e', fontSize: '11px', fontWeight: 'bold', marginBottom: '10px' },
  lessonTitle: { fontSize: '24px', fontWeight: '900', marginBottom: '20px' },
  lessonText: { color: '#cbd5e1', lineHeight: '1.6', fontSize: '15px' },
  helpBox: { marginTop: '40px', borderTop: '1px solid #1e293b', paddingTop: '20px' },
  helpLabel: { fontSize: '10px', color: '#475569', marginBottom: '10px', fontWeight: 'bold' },
  helpCode: { display: 'block', padding: '15px', background: '#020617', color: '#64748b', borderRadius: '5px', marginBottom: '20px', fontSize: '12px', fontFamily: 'monospace' },
  lessonNav: { display: 'flex', gap: '15px', marginTop: '40px', paddingBottom: '40px' },
  navBtn: { padding: '12px 25px', background: '#1e293b', border: 'none', color: '#fff', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  nextBtn: { padding: '12px 25px', background: '#fff', border: 'none', color: '#000', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { width: '300px', backgroundColor: '#020617', padding: '30px', borderRadius: '12px', border: '1px solid #1e293b' },
  boardRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1e293b', fontSize: '13px' },
  closeBtn: { marginTop: '20px', width: '100%', padding: '10px', background: '#ef4444', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' },
  loading: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#22c55e', fontFamily: 'monospace' }
};
