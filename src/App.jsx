import { useState, useEffect } from "react";
import { onAuthChange, getUserProfile, updateUserProfile, logout, subscribeLeaderboard } from "./firebase";
import CodeEditor from "./components/CodeEditor.jsx";
import Mascot from "./components/Mascot.jsx";
import Login from "./Login.jsx";

// ... Keep your language imports here ...

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPaystackOpen, setIsPaystackOpen] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setUser({ uid: firebaseUser.uid, ...profile });
        // Start Leaderboard sync
        const unsubscribeLeader = subscribeLeaderboard((data) => setLeaderboard(data));
        return () => unsubscribeLeader();
      } else { setUser(null); }
      setInitializing(false);
    });
    return () => unsubscribeAuth();
  }, []);

  if (initializing) return <div style={styles.loading}>RESUMING_SESSION...</div>;
  if (!user) return <Login onLogin={setUser} />;

  const current = currentLanguage.lessons[currentLessonIndex] || {};

  return (
    <div style={styles.appContainer}>
      <nav style={styles.nav}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Mascot />
          <span style={styles.logo}>ZENIN<span style={{ color: '#ef4444' }}>LABS</span></span>
        </div>
        <div style={styles.navRight}>
          <span style={styles.userBadge}>{user.username?.toUpperCase()} | XP {user.xp}</span>
          <button onClick={() => logout()} style={styles.logoutBtn}>LOGOUT</button>
        </div>
      </nav>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* LEADERBOARD SIDEBAR */}
        <aside style={styles.sidebar}>
          <div style={styles.sideHeader}>LEADERBOARD</div>
          {leaderboard.map((u, i) => (
            <div key={u.uid} style={styles.leaderRow}>
              <span>{i+1}. {u.username}</span>
              <span style={{color: '#22c55e'}}>{u.xp}</span>
            </div>
          ))}
        </aside>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* SCROLLABLE LESSON PANEL */}
          <main style={styles.lessonPanel}>
            <div style={styles.scrollArea}>
              <div style={styles.moduleTag}>MODULE {currentLessonIndex + 1}</div>
              <h1 style={styles.lessonTitle}>{current.title}</h1>
              <p style={styles.lessonText}>{current.content}</p>

              {/* VIEW SOLUTION SECTION */}
              <div style={styles.solutionSection}>
                <h4 style={styles.solLabel}>EXPECTED OUTPUT</h4>
                <div style={styles.solCode}>{current.expectedOutput}</div>
                
                <h4 style={styles.solLabel}>VIEW SOLUTION</h4>
                <pre style={styles.solCode}>{current.starterCode}</pre>
              </div>

              <div style={styles.navBtns}>
                <button onClick={() => setCurrentLessonIndex(p => Math.max(0, p-1))} style={styles.btnPrev}>PREV</button>
                <button onClick={() => setCurrentLessonIndex(p => Math.min(currentLanguage.lessons.length-1, p+1))} style={styles.btnNext}>NEXT</button>
              </div>
            </div>
          </main>

          <section style={{ flex: 1 }}>
            <CodeEditor 
              user={user} setUser={setUser} 
              language={currentLanguage.id}
              starterCode={current.starterCode}
              expectedOutput={current.expectedOutput}
              setIsPaystackOpen={setIsPaystackOpen}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

const styles = {
  appContainer: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#020617', color: '#fff' },
  nav: { height: '60px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', backgroundColor: '#000' },
  logo: { fontSize: '20px', fontWeight: '900', marginLeft: '10px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '15px' },
  userBadge: { background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '5px 15px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' },
  logoutBtn: { background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '11px' },
  sidebar: { width: '180px', backgroundColor: '#000', borderRight: '1px solid #1e293b', padding: '20px' },
  sideHeader: { fontSize: '10px', color: '#475569', fontWeight: 'bold', marginBottom: '15px' },
  leaderRow: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '8px' },
  lessonPanel: { flex: 1, backgroundColor: '#020617', borderRight: '1px solid #1e293b', overflow: 'hidden' },
  scrollArea: { height: '100%', overflowY: 'auto', padding: '40px' },
  moduleTag: { color: '#22c55e', fontSize: '11px', fontWeight: 'bold' },
  lessonTitle: { fontSize: '32px', fontWeight: '900', margin: '10px 0 20px' },
  lessonText: { lineHeight: '1.7', color: '#cbd5e1', fontSize: '15px' },
  solutionSection: { marginTop: '60px', paddingTop: '30px', borderTop: '1px dashed #1e293b' },
  solLabel: { fontSize: '10px', color: '#475569', marginBottom: '8px' },
  solCode: { display: 'block', padding: '15px', background: '#000', borderRadius: '8px', color: '#64748b', fontSize: '12px', fontFamily: 'monospace', marginBottom: '20px', border: '1px solid #0f172a' },
  navBtns: { display: 'flex', gap: '10px', marginTop: '20px', paddingBottom: '60px' },
  btnPrev: { flex: 1, padding: '12px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  btnNext: { flex: 1, padding: '12px', background: '#22c55e', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  loading: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontFamily: 'monospace' }
};
