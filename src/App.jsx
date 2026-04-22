import { useState, useEffect, useRef } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Mascot from "./components/Mascot.jsx";
import Login from "./Login.jsx";
import Profile from "./components/Profile.jsx";
import CodeEditor from "./components/CodeEditor.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import { onAuthChange, getUserProfile, updateUserProfile, logout, subscribeLeaderboard } from "./firebase";

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
  const [lessonVisible, setLessonVisible] = useState(true);
  const [sectorAnimating, setSectorAnimating] = useState(false);
  const [xpPopups, setXpPopups] = useState([]);
  const [showStreakPop, setShowStreakPop] = useState(false);
  const xpIdRef = useRef(0);

  const RUN_LIMIT = 25;

  const triggerXpPop = (amount) => {
    const id = xpIdRef.current++;
    setXpPopups(prev => [...prev, { id, amount }]);
    setTimeout(() => setXpPopups(prev => prev.filter(p => p.id !== id)), 1200);
  };

  useEffect(() => {
    let unsubscribeLeader;
    const unsubscribeAuth = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Show workspace immediately
        setUser({ uid: firebaseUser.uid, username: "STUDENT", xp: 0, dailyExecutions: 0, streak: 1 });
        setInitializing(false);

        try {
          const profile = await getUserProfile(firebaseUser.uid);
          if (!profile || !profile.setupComplete) setNeedsProfile(true);
          else setNeedsProfile(false);

          const today = new Date().toDateString();
          const lastSeen = profile?.lastLoginDate || "";
          let streak = profile?.streak || 1;

          if (lastSeen !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            streak = (lastSeen === yesterday.toDateString()) ? streak + 1 : 1;
            updateUserProfile(firebaseUser.uid, { lastLoginDate: today, streak });
            if (streak > 1) setShowStreakPop(true);
          }

          setUser({ uid: firebaseUser.uid, xp: 0, dailyExecutions: 0, ...profile, streak });
          unsubscribeLeader = subscribeLeaderboard(data => setLeaderboard(data));
        } catch (err) {
          console.error("Auth Error:", err);
        }
      } else {
        setUser(null);
        setNeedsProfile(false);
        setInitializing(false);
      }
    });
    return () => { unsubscribeAuth(); if (unsubscribeLeader) unsubscribeLeader(); };
  }, []);

  const handleActivatePro = async () => {
    await updateUserProfile(user.uid, { isPro: true });
    setUser(prev => ({ ...prev, isPro: true }));
    setIsPaystackOpen(false);
    alert("PRO ACTIVATED: Unlimited runs unlocked!");
  };

  const switchLesson = (newIndex) => {
    setLessonVisible(false);
    setTimeout(() => { setCurrentLessonIndex(newIndex); setLessonVisible(true); }, 180);
  };

  const switchSector = (sectorId) => {
    setSectorAnimating(true);
    setTimeout(() => { setActiveSector(sectorId); setSectorAnimating(false); }, 150);
  };

  const switchLanguage = (lang) => {
    setLessonVisible(false);
    setTimeout(() => { setCurrentLanguage(lang); setCurrentLessonIndex(0); setLessonVisible(true); }, 180);
  };

  const handleXpEarned = (amount) => {
    triggerXpPop(amount);
  };

  if (initializing) return (
    <div style={styles.loading}>
      <div className="sh-logo" style={{ fontSize: '50px' }}>🌀</div>
      <h2 style={{ marginTop: '20px', letterSpacing: '2px' }}>RESUMING_SESSION...</h2>
    </div>
  );

  if (!user) return <Login onLogin={setUser} />;

  const filteredLanguages = languages.filter(l => l.sector === activeSector);
  const lessons = currentLanguage?.lessons || [];
  const current = lessons[currentLessonIndex] || { title: "Course Locked", content: "This module is being calibrated." };
  const runsLeft = Math.max(0, RUN_LIMIT - (user?.dailyExecutions || 0));
  const progress = lessons.length > 0 ? ((currentLessonIndex + 1) / lessons.length) * 100 : 0;

  return (
    <PayPalScriptProvider options={{ "client-id": "test", currency: "USD" }}>
      <div style={styles.appContainer}>

        {/* XP POPUPS */}
        <div style={{ position: 'fixed', bottom: '80px', right: '30px', zIndex: 9999, pointerEvents: 'none' }}>
          {xpPopups.map(p => (
            <div key={p.id} className="xp-pop">+{p.amount} XP ⚡</div>
          ))}
        </div>

        {/* STREAK POPUP */}
        {showStreakPop && (
          <div style={styles.streakPopOverlay} onClick={() => setShowStreakPop(false)}>
            <div className="modal-slide" style={styles.streakPopCard}>
              <div style={{ fontSize: '50px' }}>🔥</div>
              <h2 style={{ color: '#fb923c', margin: '10px 0 5px' }}>{user?.streak} DAY STREAK!</h2>
              <p style={{ color: '#94a3b8', fontSize: '13px' }}>Keep it up — you're on fire!</p>
              <button onClick={() => setShowStreakPop(false)} style={styles.btnNext} className="btn-hover">LET'S GO</button>
            </div>
          </div>
        )}

        {/* NAV */}
        <nav style={styles.nav} className="mobile-nav">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Mascot />
            <span style={styles.logo}>ZENIN<span style={{ color: '#ef4444' }}>LABS</span></span>
            {!user?.isPro ? (
              <button onClick={() => setIsPaystackOpen(true)} style={styles.upgradeBtn} className="btn-hover pulse-glow">⚡ GO PRO</button>
            ) : (
              <span style={styles.proBadge}>👑 PRO MEMBER</span>
            )}
            <button onClick={() => setIsLeaderboardOpen(true)} style={styles.rankLink} className="btn-hover">🏆 RANKINGS</button>
            <div style={styles.streakBadge} className="streak-wiggle">🔥 {user?.streak || 1} DAY STREAK</div>
          </div>
          <div style={styles.navRight} className="mobile-nav-right">
            <div style={styles.syncContainer}><div style={styles.syncDot} /><span>SYNCED</span></div>
            {!user?.isPro && <span style={styles.runsText}>{runsLeft}/{RUN_LIMIT} RUNS LEFT</span>}
            <button
              onClick={() => setActiveView(activeView === 'profile' ? 'workspace' : 'profile')}
              style={activeView === 'profile' ? styles.profileBtnActive : styles.profileBtn}
              className="btn-hover"
            >
              <div style={{ position: 'relative' }}>
                <img src={user?.photoURL || `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${user?.username}`} style={styles.navAvatar} alt="Profile" />
                {needsProfile && <div style={styles.notificationDot} />}
              </div>
              <div style={styles.navUserInfo}>
                <span style={styles.navUsername}>{user?.username?.toUpperCase() || "NINJA"}</span>
                <span style={styles.navXP}>{user?.xp || 0} XP</span>
              </div>
            </button>
            <button onClick={() => logout()} style={styles.logoutBtn} className="btn-hover">LOGOUT</button>
          </div>
        </nav>

        {activeView === 'profile' ? (
          <div style={{ flex: 1, overflow: 'auto' }}>
            <Profile onComplete={() => { setActiveView('workspace'); setNeedsProfile(false); }} />
          </div>
        ) : (
          <div style={styles.workspace} className="mobile-workspace">

            {/* SIDEBAR */}
            <aside style={styles.sidebar} className="mobile-sidebar">
              <div style={styles.sectorScroll}>
                {SECTORS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => switchSector(s.id)}
                    className="sector-tab"
                    style={{
                      ...styles.sectorTab,
                      color: activeSector === s.id ? '#ef4444' : '#475569',
                      borderBottom: activeSector === s.id ? '2px solid #ef4444' : 'none',
                      background: activeSector === s.id ? 'rgba(239,68,68,0.05)' : 'none'
                    }}
                  >
                    <div style={{ fontSize: '16px' }}>{s.icon}</div>
                    <div style={{ fontSize: '8px', fontWeight: '900' }}>{s.name}</div>
                  </button>
                ))}
              </div>

              <div style={styles.curriculumHeader}>{activeSector.toUpperCase()} MODULES</div>
              <div style={{ ...styles.langList, opacity: sectorAnimating ? 0 : 1, transition: 'opacity 0.15s ease' }}>
                {filteredLanguages.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => switchLanguage(lang)}
                    className="lang-btn"
                    style={{
                      ...styles.langBtn,
                      color: lang.id === currentLanguage?.id ? '#22c55e' : '#94a3b8',
                      backgroundColor: lang.id === currentLanguage?.id ? 'rgba(34,197,94,0.08)' : 'transparent',
                      borderLeft: lang.id === currentLanguage?.id ? '3px solid #22c55e' : '3px solid transparent'
                    }}
                  >
                    {lang.name.toUpperCase()} {lang.id === currentLanguage?.id && "•"}
                  </button>
                ))}
              </div>

              {/* PROGRESS BAR */}
              <div style={{ padding: '12px 16px', borderTop: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#475569', marginBottom: '6px' }}>
                  <span>PROGRESS</span>
                  <span>{currentLessonIndex + 1}/{lessons.length}</span>
                </div>
                <div style={{ background: '#1e293b', borderRadius: '99px', height: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #22c55e, #16a34a)', borderRadius: '99px', transition: 'width 0.4s ease' }} />
                </div>
              </div>

              <div style={{ borderTop: '1px solid #1e293b', padding: '15px' }}>
                <div style={{ fontSize: '9px', color: '#475569', fontWeight: 'bold', marginBottom: '10px' }}>PEER ACTIVITY</div>
                <Leaderboard data={leaderboard.slice(0, 3)} compact={true} />
              </div>
            </aside>

            {/* LESSON PANEL */}
            <main
              style={{
                ...styles.lessonPanel,
                opacity: lessonVisible ? 1 : 0,
                transform: lessonVisible ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.2s ease, transform 0.2s ease'
              }}
              className="mobile-lesson"
            >
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
                <button onClick={() => switchLesson(Math.max(0, currentLessonIndex - 1))} style={styles.btnPrev} className="btn-hover">PREVIOUS</button>
                <button onClick={() => switchLesson(Math.min(lessons.length - 1, currentLessonIndex + 1))} style={styles.btnNext} className="btn-hover">NEXT LESSON →</button>
              </div>
            </main>

            {/* EDITOR */}
            <section style={styles.editorPanel} className="mobile-editor">
              <CodeEditor
                user={user}
                setUser={setUser}
                language={currentLanguage?.id || "python"}
                starterCode={current.starterCode}
                expectedOutput={current.expectedOutput}
                setIsPaystackOpen={setIsPaystackOpen}
                onXpEarned={handleXpEarned}
              />
            </section>
          </div>
        )}

        {/* PRO MODAL */}
        {isPaystackOpen && (
          <div style={styles.modalOverlay} className="modal-fade">
            <div style={styles.modalCard} className="modal-slide">
              <h2 style={{ color: '#fff', fontSize: '20px' }}>Unlock Student Pro</h2>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>Unlimited code runs & all certificates.</p>
              <div style={styles.paymentMethodBox}>
                <span style={styles.methodLabel}>KENYA (M-PESA / CARD)</span>
                <button onClick={() => window.open("https://paystack.shop/pay/zdrj1fu6qq", "_blank")} style={styles.paystackLink} className="btn-hover">PAY KES 500</button>
                <button onClick={handleActivatePro} style={styles.verifyBtn} className="btn-hover">I HAVE PAID VIA M-PESA</button>
              </div>
              <div style={{ margin: '15px 0', color: '#475569', fontSize: '10px', fontWeight: 'bold' }}>OR</div>
              <div style={styles.paymentMethodBoxPayPal}>
                <span style={{ ...styles.methodLabel, color: '#003087' }}>GLOBAL (PAYPAL / CARD)</span>
                <PayPalButtons
                  style={{ layout: 'vertical', shape: 'rect', height: 40 }}
                  createOrder={(data, actions) => actions.order.create({ purchase_units: [{ amount: { value: "4.00" } }] })}
                  onApprove={handleActivatePro}
                />
              </div>
              <button onClick={() => setIsPaystackOpen(false)} style={styles.modalClose} className="btn-hover">MAYBE LATER</button>
            </div>
          </div>
        )}

        {/* LEADERBOARD MODAL */}
        {isLeaderboardOpen && (
          <div style={styles.modalOverlay} className="modal-fade" onClick={() => setIsLeaderboardOpen(false)}>
            <div style={styles.leaderboardModal} className="modal-slide" onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, letterSpacing: '1px' }}>GLOBAL RANKINGS</h2>
                <button onClick={() => setIsLeaderboardOpen(false)} style={styles.modalCloseX} className="btn-hover">✕</button>
              </div>
              <div style={styles.tierGrid}>
                <TierColumn title="DIAMOND" xp="801+" data={leaderboard.filter(u => u.xp >= 801).slice(0, 20)} color="#3b82f6" />
                <TierColumn title="GOLD" xp="601-800" data={leaderboard.filter(u => u.xp >= 601 && u.xp <= 800).slice(0, 20)} color="#f59e0b" />
                <TierColumn title="SILVER" xp="401-600" data={leaderboard.filter(u => u.xp >= 401 && u.xp <= 600).slice(0, 20)} color="#94a3b8" />
                <TierColumn title="BRONZE" xp="201-400" data={leaderboard.filter(u => u.xp >= 201 && u.xp <= 400).slice(0, 20)} color="#b45309" />
                <TierColumn title="IRON" xp="0-200" data={leaderboard.filter(u => (u.xp || 0) <= 200).slice(0, 20)} color="#475569" />
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .sh-logo { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* XP POP */
        .xp-pop {
          color: #22c55e; font-weight: 900; font-size: 16px; font-family: monospace;
          animation: xpFloat 1.2s ease forwards;
          margin-bottom: 6px;
          text-shadow: 0 0 10px #22c55e;
        }
        @keyframes xpFloat {
          0%   { opacity: 0; transform: translateY(0px) scale(0.8); }
          20%  { opacity: 1; transform: translateY(-10px) scale(1.1); }
          80%  { opacity: 1; transform: translateY(-30px) scale(1); }
          100% { opacity: 0; transform: translateY(-50px) scale(0.9); }
        }

        /* STREAK WIGGLE */
        .streak-wiggle { animation: wiggle 3s ease-in-out infinite; }
        @keyframes wiggle {
          0%, 90%, 100% { transform: rotate(0deg); }
          93% { transform: rotate(-8deg); }
          96% { transform: rotate(8deg); }
        }

        /* PULSE GLOW on GO PRO */
        .pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0px #f59e0b; }
          50% { box-shadow: 0 0 12px #f59e0b88; }
        }

        /* BUTTON EFFECTS */
        .btn-hover { transition: opacity 0.15s ease, transform 0.15s ease !important; }
        .btn-hover:hover { opacity: 0.85; transform: translateY(-1px); }
        .btn-hover:active { transform: scale(0.96) !important; opacity: 1; }

        /* SIDEBAR LANG BUTTONS */
        .lang-btn { transition: background 0.2s ease, color 0.2s ease, padding-left 0.2s ease, border-left 0.2s ease !important; }
        .lang-btn:hover { padding-left: 26px !important; color: #e2e8f0 !important; }

        /* SECTOR TABS */
        .sector-tab { transition: color 0.2s ease, background 0.2s ease, transform 0.15s ease !important; }
        .sector-tab:hover { transform: translateY(-2px); }

        /* MODAL ANIMATIONS */
        .modal-fade { animation: fadeIn 0.2s ease; }
        .modal-slide { animation: slideUp 0.25s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* MOBILE */
        @media (max-width: 768px) {
          .mobile-workspace { flex-direction: column !important; overflow-y: auto !important; overflow-x: hidden !important; }
          .mobile-sidebar { width: 100% !important; flex-shrink: 0; }
          .mobile-lesson { flex: none !important; width: 100% !important; padding: 20px !important; border-right: none !important; border-bottom: 1px solid #1e293b; box-sizing: border-box; }
          .mobile-editor { flex: none !important; width: 100% !important; height: 85vh; }
          .mobile-nav { height: auto !important; flex-wrap: wrap; gap: 8px; padding: 8px 12px !important; }
          .mobile-nav-right { gap: 8px !important; flex-wrap: wrap; }
        }
      `}</style>
    </PayPalScriptProvider>
  );
}

const TierColumn = ({ title, xp, data, color }) => (
  <div style={styles.tierCol}>
    <div style={{ ...styles.tierHeader, borderBottom: `2px solid ${color}` }}>
      <div style={{ fontSize: '10px', color, fontWeight: '900' }}>{title}</div>
      <div style={{ fontSize: '9px', color: '#475569' }}>{xp} XP</div>
    </div>
    <div style={styles.tierList}>
      {data.map((ninja, i) => (
        <div key={i} style={styles.tierRow}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i + 1}. {ninja.username || "STUDENT"}</span>
          <span style={{ color, fontWeight: 'bold' }}>{ninja.xp}</span>
        </div>
      ))}
      {data.length === 0 && <div style={{ textAlign: 'center', fontSize: '9px', marginTop: '20px', color: '#475569' }}>EMPTY TIER</div>}
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
  streakBadge: { marginLeft: '15px', color: '#fb923c', fontSize: '11px', fontWeight: '900', cursor: 'default' },
  navRight: { display: 'flex', alignItems: 'center', gap: '15px' },
  syncContainer: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#475569', fontWeight: 'bold' },
  syncDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px #22c55e' },
  runsText: { color: '#475569', fontSize: '11px', fontWeight: 'bold' },
  profileBtn: { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid #1e293b', padding: '4px 12px 4px 6px', borderRadius: '30px', cursor: 'pointer' },
  profileBtnActive: { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', padding: '4px 12px 4px 6px', borderRadius: '30px', cursor: 'pointer' },
  navAvatar: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0f172a', border: '1px solid #334155', objectFit: 'cover' },
  navUserInfo: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
  navUsername: { fontSize: '10px', fontWeight: '900', color: '#f8fafc', letterSpacing: '0.5px' },
  navXP: { fontSize: '9px', fontWeight: 'bold', color: '#22c55e' },
  notificationDot: { position: 'absolute', top: -2, right: -2, width: '10px', height: '10px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid #000' },
  logoutBtn: { background: 'none', border: 'none', color: '#475569', fontSize: '11px', cursor: 'pointer', paddingLeft: '10px', borderLeft: '1px solid #1e293b' },
  workspace: { display: 'flex', flex: 1, overflow: 'hidden' },
  sidebar: { width: '220px', backgroundColor: '#000', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column' },
  sectorScroll: { display: 'flex', overflowX: 'auto', backgroundColor: '#020617', borderBottom: '1px solid #1e293b', scrollbarWidth: 'none' },
  sectorTab: { flex: '0 0 73px', padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  curriculumHeader: { padding: '24px 16px 12px', fontSize: '10px', fontWeight: '900', color: '#475569' },
  langList: { flex: 1, overflowY: 'auto' },
  langBtn: { width: '100%', textAlign: 'left', padding: '14px 20px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '800' },
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
  paymentMethodBox: { padding: '15px', border: '1px solid #22c55e', borderRadius: '12px', background: 'rgba(34,197,94,0.05)', textAlign: 'left' },
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
  loading: { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#ef4444' },
  streakPopOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
  streakPopCard: { background: '#020617', border: '1px solid #fb923c', padding: '40px', borderRadius: '20px', textAlign: 'center', width: '300px' },
};
