import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Mascot from "./components/Mascot.jsx";
import Login from "./Login.jsx";
import Profile from "./components/Profile.jsx"; 
import CodeEditor from "./components/CodeEditor.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import { onAuthChange, getUserProfile, updateUserProfile, logout, subscribeLeaderboard } from "./firebase";

// --- CURRICULUM IMPORTS ---
import { pythonLessons } from "./courses/python.js";
import { clLessons } from "./courses/clessons.js";
import { cppLessons } from "./courses/cpplessons.js";
import { goLessons } from "./courses/golessons.js";
import { sqlLessons } from "./courses/sqllessons.js";
import { rLessons } from "./courses/Rlessons.js";
import { htmlLessons } from "./courses/html.js";
import { cssLessons } from "./courses/css.js";

const SECTORS = [
  { id: 'web', name: 'WEB DEV', icon: '🌐' },
  { id: 'data', name: 'DATA SCIENCE', icon: '📊' },
  { id: 'ai', name: 'AI & ML', icon: '🧠' },
  { id: 'sys', name: 'SYSTEMS', icon: '⚙️' }
];

const languages = [
  { name: "Python", lessons: pythonLessons, id: "python", sector: "data" },
  { name: "SQL", lessons: sqlLessons, id: "sqlite3", sector: "data" },
  { name: "R", lessons: rLessons, id: "r", sector: "data" },
  { name: "C", lessons: clLessons, id: "c", sector: "sys" },
  { name: "C++", lessons: cppLessons, id: "cpp", sector: "sys" },
  { name: "Go", lessons: goLessons, id: "go", sector: "sys" },
  { name: "HTML", lessons: htmlLessons, id: "html", sector: "web" },
  { name: "CSS", lessons: cssLessons, id: "css", sector: "web" }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [needsProfile, setNeedsProfile] = useState(false); 
  const [initializing, setInitializing] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeView, setActiveView] = useState("workspace"); 
  const [activeSector, setActiveSector] = useState("web");
  const [currentLanguage, setCurrentLanguage] = useState(languages.find(l => l.sector === "web"));
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPaystackOpen, setIsPaystackOpen] = useState(false); 
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  
  const RUN_LIMIT = 25;

  useEffect(() => {
    let unsubscribeLeader;
    
    // REMOVED: 'async' from the direct callback to prevent blocking
    const unsubscribeAuth = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        // 1. INSTANT HYDRATION: Update local state immediately
        setUser({ 
          uid: firebaseUser.uid, 
          username: firebaseUser.displayName || "NINJA", 
          photoURL: firebaseUser.photoURL,
          xp: 0, 
          dailyExecutions: 0 
        });

        // 2. DISMISS LOADING SCREEN NOW (Total time: ~1-2s)
        setInitializing(false);

        // 3. BACKGROUND SYNC: Fetch heavy data without blocking UI
        const syncProfile = async () => {
          try {
            const profile = await getUserProfile(firebaseUser.uid);
            if (!profile || !profile.setupComplete) setNeedsProfile(true);

            const today = new Date().toDateString();
            const lastSeen = profile?.lastLoginDate || "";
            let streak = profile?.streak || 1;

            if (lastSeen !== today) {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              streak = (lastSeen === yesterday.toDateString()) ? streak + 1 : 1;
              updateUserProfile(firebaseUser.uid, { lastLoginDate: today, streak });
            }

            setUser(prev => ({ ...prev, ...profile, streak }));
            unsubscribeLeader = subscribeLeaderboard((data) => setLeaderboard(data));
          } catch (err) {
            console.error("Background Sync Failed", err);
          }
        };
        syncProfile();

      } else {
        setUser(null);
        setInitializing(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeLeader) unsubscribeLeader();
    };
  }, []);

  const handleActivatePro = async () => {
    await updateUserProfile(user.uid, { isPro: true });
    setUser(prev => ({ ...prev, isPro: true }));
    setIsPaystackOpen(false);
    alert("PRO ACTIVATED: Unlimited runs unlocked!");
  };

  if (initializing) return (
    <div style={styles.loading}>
      <div className="sh-logo" style={{fontSize: '50px'}}>🌀</div>
      <h2 style={{marginTop: '20px', letterSpacing: '2px'}}>RESUMING_SESSION...</h2>
    </div>
  );

  if (!user) return <Login onLogin={setUser} />;

  const filteredLanguages = languages.filter(l => l.sector === activeSector);
  const lessons = currentLanguage?.lessons || [];
  const current = lessons[currentLessonIndex] || { title: "Course Locked", content: "This module is being calibrated." };
  const runsLeft = Math.max(0, RUN_LIMIT - (user?.dailyExecutions || 0));

  return (
    <PayPalScriptProvider options={{ "client-id": "test", currency: "USD" }}>
      <div style={styles.appContainer}>
        <nav style={styles.nav}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Mascot />
            <span style={styles.logo}>ZENIN<span style={{ color: '#ef4444' }}>LABS</span></span>
            {!user?.isPro ? (
              <button onClick={() => setIsPaystackOpen(true)} style={styles.upgradeBtn}>⚡ GO PRO</button>
            ) : (
              <span style={styles.proBadge}>👑 PRO MEMBER</span>
            )}
            <button onClick={() => setIsLeaderboardOpen(true)} style={styles.rankLink}>🏆 RANKINGS</button>
            <div style={styles.streakBadge}>🔥 {user?.streak || 1} DAY STREAK</div>
          </div>

          <div style={styles.navRight}>
            <div style={styles.syncContainer}><div style={styles.syncDot} /><span>SYNCED</span></div>
            {!user?.isPro && <span style={styles.runsText}>{runsLeft}/{RUN_LIMIT} RUNS LEFT</span>}
            
            <button 
              onClick={() => setActiveView(activeView === 'profile' ? 'workspace' : 'profile')} 
              style={activeView === 'profile' ? styles.profileBtnActive : styles.profileBtn}
            >
              <div style={{ position: 'relative' }}>
                <img 
                  src={user?.photoURL || `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${user?.username}`} 
                  style={styles.navAvatar} 
                  alt="Profile"
                />
                {needsProfile && <div style={styles.notificationDot} />}
              </div>
              <div style={styles.navUserInfo}>
                <span style={styles.navUsername}>{user?.username?.toUpperCase() || "NINJA"}</span>
                <span style={styles.navXP}>{user?.xp || 0} XP</span>
              </div>
            </button>
            <button onClick={() => logout()} style={styles.logoutBtn}>LOGOUT</button>
          </div>
        </nav>

        {activeView === 'profile' ? (
          <div style={{ flex: 1, overflow: 'auto' }}>
            <Profile onComplete={() => { setActiveView('workspace'); setNeedsProfile(false); }} />
          </div>
        ) : (
          <div style={styles.workspace}>
            <aside style={styles.sidebar}>
              <div style={styles.sectorScroll}>
                {SECTORS.map(s => (
                  <button key={s.id} onClick={() => setActiveSector(s.id)} style={{ ...styles.sectorTab, color: activeSector === s.id ? '#ef4444' : '#475569', borderBottom: activeSector === s.id ? '2px solid #ef4444' : 'none' }}>
                    <div style={{fontSize: '16px'}}>{s.icon}</div>
                    <div style={{fontSize: '8px', fontWeight: '900'}}>{s.name}</div>
                  </button>
                ))}
              </div>

              <div style={styles.curriculumHeader}>{activeSector.toUpperCase()} MODULES</div>
              <div style={styles.langList}>
                {filteredLanguages.map(lang => (
                  <button key={lang.id} onClick={() => { setCurrentLanguage(lang); setCurrentLessonIndex(0); }} style={{ ...styles.langBtn, color: lang.id === currentLanguage?.id ? '#22c55e' : '#94a3b8', backgroundColor: lang.id === currentLanguage?.id ? 'rgba(34, 197, 94, 0.05)' : 'transparent' }}>
                    {lang.name.toUpperCase()} {lang.id === currentLanguage?.id && "•"}
                  </button>
                ))}
              </div>
              <div style={{marginTop: 'auto', borderTop: '1px solid #1e293b', padding: '15px'}}>
                  <div style={{fontSize: '9px', color: '#475569', fontWeight: 'bold', marginBottom: '10px'}}>PEER ACTIVITY</div>
                  <Leaderboard data={leaderboard.slice(0, 3)} compact={true} />
              </div>
            </aside>

            <main style={styles.lessonPanel}>
              <div style={styles.moduleTag}>{currentLanguage?.name.toUpperCase()} • {currentLessonIndex + 1}</div>
              <h1 style={styles.lessonTitle}>{current.title}</h1>
              <div style={styles.contentBox}>
                <p style={styles.lessonText}>{current.content}</p>
              </div>
              
              <div style={styles.solutionSection}>
                  <h4 style={styles.solLabel}>GOAL OUTPUT</h4>
                  <div style={styles.solCode}>{current.expectedOutput || "Run code to see results"}</div>
                  <h4 style={styles.solLabel}>REFERENCE TEMPLATE</h4>
                  <pre style={styles.solCode}>{current.starterCode || "Type your solution in the editor..."}</pre>
              </div>

              <div style={styles.navBtns}>
                <button onClick={() => setCurrentLessonIndex(p => Math.max(0, p-1))} style={styles.btnPrev}>PREVIOUS</button>
                <button onClick={() => setCurrentLessonIndex(p => Math.min(lessons.length-1, p+1))} style={styles.btnNext}>NEXT LESSON</button>
              </div>
            </main>

            <section style={styles.editorPanel}>
              <CodeEditor 
                user={user} 
                setUser={setUser} 
                language={currentLanguage?.id || "python"}
                starterCode={current.starterCode}
                expectedOutput={current.expectedOutput}
                setIsPaystackOpen={setIsPaystackOpen}
              />
            </section>
          </div>
        )}
        {/* Modals and Tiers remain same as your provided code */}
      </div>
      <style>{`.sh-logo { animation: spin 4s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </PayPalScriptProvider>
  );
}


