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
  
  // View State Management
  const [activeView, setActiveView] = useState("workspace"); // 'workspace' or 'profile'
  
  const [activeSector, setActiveSector] = useState("web");
  const [currentLanguage, setCurrentLanguage] = useState(languages.find(l => l.sector === "web"));
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPaystackOpen, setIsPaystackOpen] = useState(false); 
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  
  const RUN_LIMIT = 25;

  useEffect(() => {
    let unsubscribeLeader;
    const unsubscribeAuth = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          
          // Check if they need a profile setup, but don't force the screen change
          if (!profile || !profile.setupComplete) {
            setNeedsProfile(true);
          } else {
            setNeedsProfile(false);
          }

          const today = new Date().toDateString();
          const lastSeen = profile?.lastLoginDate || "";
          let streak = profile?.streak || 1;

          if (lastSeen !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            streak = (lastSeen === yesterday.toDateString()) ? streak + 1 : 1;
            updateUserProfile(firebaseUser.uid, { lastLoginDate: today, streak });
          }

          setUser({ uid: firebaseUser.uid, xp: 0, dailyExecutions: 0, ...profile, streak });
          unsubscribeLeader = subscribeLeaderboard((data) => setLeaderboard(data));
        } catch (err) {
          console.error("Auth Error:", err);
          setUser({ uid: firebaseUser.uid, username: "STUDENT", xp: 0 });
        }
      } else {
        setUser(null);
        setNeedsProfile(false);
      }
      setInitializing(false);
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
        
        {/* TOP NAVIGATION */}
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
            
            {/* NEW PROFILE TOGGLE BUTTON */}
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
                {/* Red dot notification if profile is incomplete */}
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

        {/* DYNAMIC VIEW RENDERING */}
        {activeView === 'profile' ? (
          <div style={{ flex: 1, overflow: 'auto' }}>
            <Profile onComplete={() => {
              setActiveView('workspace');
              setNeedsProfile(false);
            }} />
          </div>
        ) : (
          <div style={styles.workspace}>
            <aside style={styles.sidebar}>
              <div style={styles.sectorScroll}>
                {SECTORS.map(s => (
                  <button 
                    key={s.id} 
                    onClick={() => setActiveSector(s.id)}
                    style={{
                      ...styles.sectorTab,
                      color: activeSector === s.id ? '#ef4444' : '#475569',
                      borderBottom: activeSector === s.id ? '2px solid #ef4444' : 'none'
                    }}
                  >
                    <div style={{fontSize: '16px'}}>{s.icon}</div>
                    <div style={{fontSize: '8px', fontWeight: '900'}}>{s.name}</div>
                  </button>
                ))}
              </div>

              <div style={styles.curriculumHeader}>{activeSector.toUpperCase()} MODULES</div>
              <div style={styles.langList}>
                {filteredLanguages.map(lang => (
                  <button 
                    key={lang.id}
                    onClick={() => { setCurrentLanguage(lang); setCurrentLessonIndex(0); }}
                    style={{ 
                      ...styles.langBtn, 
                      color: lang.id === currentLanguage?.id ? '#22c55e' : '#94a3b8',
                      backgroundColor: lang.id === currentLanguage?.id ? 'rgba(34, 197, 94, 0.05)' : 'transparent'
                    }}
                  >
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
              <br />
              
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

        {/* MODALS */}
        {isPaystackOpen && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalCard}>
              <h2 style={{ color: '#fff', fontSize: '20px' }}>Unlock Student Pro</h2>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>Unlimited code runs & all certificates.</p>
              <div style={styles.paymentMethodBox}>
                  <span style={styles.methodLabel}>KENYA (M-PESA / CARD)</span>
                  <button onClick={() => window.open("https://paystack.shop/pay/zdrj1fu6qq", "_blank")} style={styles.paystackLink}>PAY KES 500</button>
                  <button onClick={handleActivatePro} style={styles.verifyBtn}>I HAVE PAID VIA M-PESA</button>
              </div>
              <div style={{ margin: '15px 0', color: '#475569', fontSize: '10px', fontWeight: 'bold' }}>OR</div>
              <div style={styles.paymentMethodBoxPayPal}>
                  <span style={{...styles.methodLabel, color: '#003087'}}>GLOBAL (PAYPAL / CARD)</span>
                  <PayPalButtons 
                    style={{ layout: 'vertical', shape: 'rect', height: 40 }}
                    createOrder={(data, actions) => actions.order.create({ purchase_units: [{ amount: { value: "4.00" } }] })}
                    onApprove={handleActivatePro}
                  />
              </div>
              <button onClick={() => setIsPaystackOpen(false)} style={styles.modalClose}>MAYBE LATER</button>
            </div>
          </div>
        )}

        {isLeaderboardOpen && (
          <div style={styles.modalOverlay} onClick={() => setIsLeaderboardOpen(false)}>
            <div style={styles.leaderboardModal} onClick={e => e.stopPropagation()}>
               <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                  <h2 style={{margin: 0, letterSpacing: '1px'}}>GLOBAL RANKINGS</h2>
                  <button onClick={() => setIsLeaderboardOpen(false)} style={styles.modalCloseX}>✕</button>
               </div>
               <div style={styles.tierGrid}>
                  <TierColumn title="DIAMOND" xp="801+" data={leaderboard.filter(u => u.xp >= 801).slice(0,20)} color="#3b82f6" />
                  <TierColumn title="GOLD" xp="601-800" data={leaderboard.filter(u => u.xp >= 601 && u.xp <= 800).slice(0,20)} color="#f59e0b" />
                  <TierColumn title="SILVER" xp="401-600" data={leaderboard.filter(u => u.xp >= 401 && u.xp <= 600).slice(0,20)} color="#94a3b8" />
                  <TierColumn title="BRONZE" xp="201-400" data={leaderboard.filter(u => u.xp >= 201 && u.xp <= 400).slice(0,20)} color="#b45309" />
                  <TierColumn title="IRON" xp="0-200" data={leaderboard.filter(u => (u.xp || 0) <= 200).slice(0,20)} color="#475569" />
               </div>
            </div>
          </div>
        )}
      </div>
      <style>{`.sh-logo { animation: spin 4s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </PayPalScriptProvider>
  );
}

const TierColumn = ({ title, xp, data, color }) => (
  <div style={styles.tierCol}>
    <div style={{...styles.tierHeader, borderBottom: `2px solid ${color}`}}>
      <div style={{fontSize: '10px', color: color, fontWeight: '900'}}>{title}</div>
      <div style={{fontSize: '9px', color: '#475569'}}>{xp} XP</div>
    </div>
    <div style={styles.tierList}>
      {data.map((ninja, i) => (
        <div key={i} style={styles.tierRow}>
          <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{i+1}. {ninja.username || "STUDENT"}</span>
          <span style={{color: color, fontWeight: 'bold'}}>{ninja.xp}</span>
        </div>
      ))}
      {data.length === 0 && <div style={{textAlign:'center', fontSize: '9px', marginTop: '20px', color: '#475569'}}>EMPTY TIER</div>}
    </div>
  </div>
);

const styles = {
  appContainer: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#020617', color: '#fff', overflow: 'hidden', fontFamily: 'monospace' },
  nav: { height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', backgroundColor: '#000', borderBottom: '1px solid #1e293b' },
  logo: { fontWeight: '900', fontStyle: 'italic', fontSize: '20px' },
  upgradeBtn: { marginLeft: '20px', backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '11px', fontWeight: '900', cursor: 'pointer' },
  proBadge: { marginLeft: '20px', color: '#22c55e', fontSize: '10px', fontWeight: '900', border: '1px solid #22c55e', padding: '4px 10px', borderRadius: '4px' },
  rankLink: { marginLeft: '20px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' },
  streakBadge: { marginLeft: '15px', color: '#fb923c', fontSize: '11px', fontWeight: '900' },
  navRight: { display: 'flex', alignItems: 'center', gap: '15px' },
  syncContainer: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#475569', fontWeight: 'bold' },
  syncDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px #22c55e' },
  runsText: { color: '#475569', fontSize: '11px', fontWeight: 'bold' },
  
  // NEW PROFILE BUTTON STYLES
  profileBtn: { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid #1e293b', padding: '4px 12px 4px 6px', borderRadius: '30px', cursor: 'pointer', transition: 'all 0.2s ease' },
  profileBtnActive: { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', padding: '4px 12px 4px 6px', borderRadius: '30px', cursor: 'pointer', transition: 'all 0.2s ease' },
  navAvatar: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0f172a', border: '1px solid #334155', objectFit: 'cover' },
  navUserInfo: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
  navUsername: { fontSize: '10px', fontWeight: '900', color: '#f8fafc', letterSpacing: '0.5px' },
  navXP: { fontSize: '9px', fontWeight: 'bold', color: '#22c55e' },
  notificationDot: { position: 'absolute', top: -2, right: -2, width: '10px', height: '10px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid #000' },
  
  logoutBtn: { background: 'none', border: 'none', color: '#475569', fontSize: '11px', cursor: 'pointer', paddingLeft: '10px', borderLeft: '1px solid #1e293b' },
  workspace: { display: 'flex', flex: 1, overflow: 'hidden' },
  sidebar: { width: '220px', backgroundColor: '#000', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column' },
  sectorScroll: { display: 'flex', overflowX: 'auto', backgroundColor: '#020617', borderBottom: '1px solid #1e293b', scrollbarWidth: 'none' },
  sectorTab: { flex: '0 0 73px', padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: '0.2s' },
  curriculumHeader: { padding: '24px 16px 12px', fontSize: '10px', fontWeight: '900', color: '#475569' },
  langList: { flex: 1, overflowY: 'auto' },
  langBtn: { width: '100%', textAlign: 'left', padding: '14px 20px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '800', transition: '0.2s' },
  lessonPanel: { flex: '1 1 42%', padding: '40px', overflowY: 'auto', borderRight: '1px solid #1e293b' },
  editorPanel: { flex: '1 1 58%', backgroundColor: '#000' },
  moduleTag: { color: '#22c55e', fontSize: '10px', fontWeight: '900' },
  lessonTitle: { fontSize: '28px', fontWeight: '900', margin: '10px 0 20px' },
  contentBox: { backgroundColor: 'rgba(255,255,255,0.03)', borderLeft: '4px solid #22c55e', padding: '24px', borderRadius: '8px', marginBottom: '20px' },
  lessonText: { color: '#94a3b8', lineHeight: '1.8', fontSize: '15px' },
  solutionSection: { marginBottom: '40px' },
  solLabel: { fontSize: '10px', color: '#475569', fontWeight: '900', marginBottom: '10px' },
  solCode: { display: 'block', padding: '15px', background: '#0a0f1d', borderRadius: '8px', color: '#64748b', fontSize: '12px', marginBottom: '20px', border: '1px solid #1e293b', whiteSpace: 'pre-wrap' },
  navBtns: { display: 'flex', gap: '15px' },
  btnPrev: { flex: 1, padding: '12px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
  btnNext: { flex: 1, padding: '12px', background: '#22c55e', color: '#000', border: 'none', fontWeight: '900', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalCard: { background: '#020617', border: '1px solid #1e293b', padding: '30px', borderRadius: '20px', width: '340px', textAlign: 'center' },
  modalClose: { background: 'none', border: 'none', color: '#475569', marginTop: '20px', cursor: 'pointer', fontSize: '11px' },
  paymentMethodBox: { padding: '15px', border: '1px solid #22c55e', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.05)', textAlign: 'left' },
  paymentMethodBoxPayPal: { padding: '15px', border: '1px solid #cbd5e1', borderRadius: '12px', background: '#fff', textAlign: 'left' },
  methodLabel: { fontSize: '9px', fontWeight: '900', color: '#22c55e', display: 'block', marginBottom: '10px' },
  paystackLink: { width: '100%', display: 'block', backgroundColor: '#22c55e', color: '#000', padding: '12px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', textAlign: 'center', marginBottom: '8px' },
  verifyBtn: { width: '100%', backgroundColor: 'transparent', color: '#22c55e', border: 'none', padding: '5px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' },
  leaderboardModal: { backgroundColor: '#000', width: '90%', maxWidth: '1200px', height: '80vh', borderRadius: '12px', border: '1px solid #1e293b', padding: '30px', display: 'flex', flexDirection: 'column' },
  modalCloseX: { background: 'none', border: 'none', color: '#475569', fontSize: '24px', cursor: 'pointer' },
  tierGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', flex: 1, minHeight: 0 },
  tierCol: { backgroundColor: '#0a0f1d', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #1e293b' },
  tierHeader: { padding: '12px', textAlign: 'center', backgroundColor: '#000' },
  tierList: { padding: '5px', overflowY: 'auto', flex: 1 },
  tierRow: { display: 'flex', justifyContent: 'space-between', fontSize: '10px', padding: '8px 6px', borderBottom: '1px solid #1e293b' },
  loading: { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#ef4444' }
};


