import { useState, useEffect } from "react";
import { onAuthChange, getUserProfile, updateUserProfile, logout, subscribeLeaderboard } from "./firebase";
import CodeEditor from "./components/CodeEditor.jsx";
import Mascot from "./components/Mascot.jsx";
import Login from "./Login.jsx";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// Course imports... (assuming paths are correct)
import { pythonLessons } from "./courses/python.js";
// ... (rest of imports)

const languages = [
  { name: "Python", lessons: pythonLessons, id: "python" },
  // ... (rest of languages)
];

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPaystackOpen, setIsPaystackOpen] = useState(false);

  // League Ranking Logic
  const getLeague = (xp) => {
    if (xp >= 1000) return { name: "DIAMOND", color: "#0ea5e9", icon: "💎" };
    if (xp >= 800) return { name: "GOLD", color: "#f59e0b", icon: "🥇" };
    if (xp >= 600) return { name: "SILVER", color: "#94a3b8", icon: "🥈" };
    if (xp >= 400) return { name: "BRONZE", color: "#b45309", icon: "🥉" };
    if (xp >= 200) return { name: "IRON", color: "#64748b", icon: "🛡️" };
    return { name: "ROOKIE", color: "#4ade80", icon: "🥚" };
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setUser({ uid: firebaseUser.uid, ...profile });
        const unsubLeader = subscribeLeaderboard(setLeaderboard);
        return () => unsubLeader();
      } else { setUser(null); }
      setInitializing(false);
    });
    return () => unsubscribeAuth();
  }, []);

  if (initializing) return <div style={styles.loading}>RESUMING_NINJA_SESSION...</div>;
  if (!user) return <Login onLogin={setUser} />;

  const current = currentLanguage.lessons[currentLessonIndex] || {};
  const myLeague = getLeague(user.xp || 0);

  return (
    <PayPalScriptProvider options={{ "client-id": "test" }}>
      <div style={styles.appContainer}>
        <nav style={styles.nav}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Mascot />
            <span style={styles.logo}>ZENIN<span style={{ color: '#ef4444' }}>LABS</span></span>
            <div style={{ ...styles.leagueTag, color: myLeague.color, borderColor: myLeague.color }}>
              {myLeague.icon} {myLeague.name}
            </div>
          </div>
          <div style={styles.navRight}>
            <span style={styles.xpBadge}>XP {user.xp || 0}</span>
            <button onClick={() => logout()} style={styles.logoutBtn}>LOGOUT</button>
          </div>
        </nav>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* LEADERBOARD SIDEBAR */}
          <aside style={styles.sidebar}>
            <div style={styles.sideTitle}>TOP 30 NINJAS</div>
            <div style={styles.leaderboardScroll}>
              {leaderboard.map((u, i) => {
                const l = getLeague(u.xp || 0);
                return (
                  <div key={u.uid} style={{ ...styles.leaderRow, borderLeft: `3px solid ${l.color}`, backgroundColor: u.uid === user.uid ? 'rgba(34,197,94,0.1)' : 'transparent' }}>
                    <div>
                      <div style={styles.leaderName}>{i + 1}. {u.username}</div>
                      <div style={{ fontSize: '8px', color: l.color }}>{l.name}</div>
                    </div>
                    <span style={styles.leaderXp}>{u.xp}</span>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* SCROLLABLE LESSON PANEL */}
          <main style={styles.lessonPanel}>
            <div style={styles.scrollArea}>
              <div style={styles.moduleTag}>MODULE {currentLessonIndex + 1}</div>
              <h1 style={styles.lessonTitle}>{current.title}</h1>
              <p style={styles.lessonText}>{current.content}</p>

              {/* SOLUTION SECTION AT BOTTOM */}
              <div style={styles.solutionContainer}>
                <h4 style={styles.solLabel}>EXPECTED OUTPUT</h4>
                <div style={styles.solCode}>{current.expectedOutput}</div>
                
                <h4 style={styles.solLabel}>VIEW SOLUTION</h4>
                <pre style={styles.solCode}>{current.starterCode}</pre>
              </div>

              <div style={styles.navBtns}>
                <button onClick={() => setCurrentLessonIndex(p => Math.max(0, p - 1))} style={styles.btnPrev}>PREV</button>
                <button onClick={() => setCurrentLessonIndex(p => p + 1)} style={styles.btnNext}>NEXT</button>
              </div>
            </div>
          </main>

          {/* EDITOR */}
          <section style={{ flex: 1 }}>
            <CodeEditor user={user} setUser={setUser} setIsPaystackOpen={setIsPaystackOpen} language={currentLanguage.id} starterCode={current.starterCode} expectedOutput={current.expectedOutput} />
          </section>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}

const styles = {
  appContainer: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#020617', color: '#fff' },
  nav: { height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', backgroundColor: '#000', borderBottom: '1px solid #1e293b' },
  logo: { fontSize: '20px', fontWeight: '900', marginLeft: '10px' },
  leagueTag: { marginLeft: '20px', fontSize: '9px', fontWeight: 'bold', border: '1px solid', padding: '3px 8px', borderRadius: '4px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '15px' },
  xpBadge: { backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '5px 15px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' },
  logoutBtn: { background: 'none', border: 'none', color: '#475569', fontSize: '11px', cursor: 'pointer' },
  sidebar: { width: '200px', backgroundColor: '#000', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column' },
  sideTitle: { padding: '20px', fontSize: '10px', fontWeight: 'bold', color: '#475569' },
  leaderboardScroll: { flex: 1, overflowY: 'auto', padding: '0 10px' },
  leaderRow: { display: 'flex', justifyContent: 'space-between', padding: '10px', marginBottom: '5px', borderRadius: '4px' },
  leaderName: { fontSize: '12px', color: '#fff', fontWeight: 'bold' },
  leaderXp: { color: '#22c55e', fontSize: '11px', fontWeight: 'bold' },
  lessonPanel: { flex: 1, borderRight: '1px solid #1e293b', overflow: 'hidden' },
  scrollArea: { height: '100%', overflowY: 'auto', padding: '40px' },
  moduleTag: { color: '#22c55e', fontSize: '11px', fontWeight: 'bold' },
  lessonTitle: { fontSize: '32px', fontWeight: '900', margin: '15px 0' },
  lessonText: { lineHeight: '1.7', color: '#cbd5e1', fontSize: '15px' },
  solutionContainer: { marginTop: '50px', borderTop: '1px dashed #1e293b', paddingTop: '30px' },
  solLabel: { fontSize: '10px', color: '#475569', marginBottom: '10px' },
  solCode: { display: 'block', padding: '15px', background: '#000', borderRadius: '8px', color: '#64748b', fontSize: '12px', marginBottom: '20px' },
  navBtns: { display: 'flex', gap: '10px', paddingBottom: '60px' },
  btnPrev: { flex: 1, padding: '12px', background: '#1e293b', border: 'none', color: '#fff', borderRadius: '6px' },
  btnNext: { flex: 1, padding: '12px', background: '#22c55e', border: 'none', color: '#000', fontWeight: 'bold', borderRadius: '6px' },
  loading: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontFamily: 'monospace' }
};
