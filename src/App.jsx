import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"; // Restored Buttons
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Mascot from "./components/Mascot.jsx";
import Login from "./Login.jsx";
import CodeEditor from "./components/CodeEditor.jsx";
@@ -39,39 +39,35 @@ export default function App() {

  useEffect(() => {
    let unsubscribeLeader;
    const recoveryTimeout = setTimeout(() => {
      if (initializing) setInitializing(false);
    }, 3000);

    const unsubscribeAuth = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setUser({ 
            uid: firebaseUser.uid, 
            xp: 0, 
            dailyExecutions: 0,
            streak: 1,
            ...profile 
          });
          setUser({ uid: firebaseUser.uid, xp: 0, dailyExecutions: 0, streak: 1, ...profile });
          unsubscribeLeader = subscribeLeaderboard((data) => setLeaderboard(data));
        } catch (err) {
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

  // YOUR WORKING PAYMENT HANDLER
  const handleActivatePro = async () => {
    await updateUserProfile(user.uid, { isPro: true });
    setUser(prev => ({ ...prev, isPro: true }));
    setIsPaystackOpen(false);
    alert("Welcome to Zenin Pro! Access is now UNLIMITED.");
  };

  if (initializing) return (
    <div style={styles.loading}>
      <div className="sh-logo" style={{fontSize: '50px'}}>🌀</div>
@@ -82,23 +78,22 @@ export default function App() {
  if (!user) return <Login onLogin={setUser} />;

  const lessons = currentLanguage.lessons || [];
  const current = lessons[currentLessonIndex] || { title: "End of Path", content: "Path Complete!" };
  const current = lessons[currentLessonIndex] || { title: "End of Path", content: "Select a lesson." };
  const runsLeft = Math.max(0, RUN_LIMIT - (user?.dailyExecutions || 0));

  return (
    <PayPalScriptProvider options={{ "client-id": "test", currency: "USD" }}>
      <div style={styles.appContainer}>
        {/* NAVBAR AREA */}
        {/* NAVBAR */}
        <nav style={styles.nav}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Mascot />
            <span style={styles.logo}>ZENIN<span style={{ color: '#ef4444' }}>LABS</span></span>

            {/* GO PRO: ALWAYS VISIBLE PER REQUEST */}
            {!user?.isPro && (
              <button onClick={() => setIsPaystackOpen(true)} style={styles.upgradeBtn}>
                ⚡ GO PRO
              </button>
            {!user?.isPro ? (
              <button onClick={() => setIsPaystackOpen(true)} style={styles.upgradeBtn}>⚡ GO PRO</button>
            ) : (
              <span style={styles.proBadge}>👑 PRO MEMBER</span>
            )}

            <button onClick={() => setIsLeaderboardOpen(true)} style={styles.rankLink}>🏆 RANKINGS</button>
@@ -107,13 +102,14 @@ export default function App() {

          <div style={styles.navRight}>
            <div style={styles.syncContainer}><div style={styles.syncDot} /><span>SYNCED</span></div>
            {!user?.isPro && <span style={styles.runsText}>{runsLeft}/{RUN_LIMIT} RUNS</span>}
            <span style={styles.userBadge}>| XP {user?.xp || 0}</span>
            {!user?.isPro && <span style={styles.runsText}>{runsLeft}/{RUN_LIMIT} RUNS LEFT</span>}
            <span style={styles.userBadge}>{user?.username?.toUpperCase()} | XP {user?.xp || 0}</span>
            <button onClick={() => logout()} style={styles.logoutBtn}>LOGOUT</button>
          </div>
        </nav>

        <div style={styles.workspace}>
          {/* SIDEBAR */}
          <aside style={styles.sidebar}>
            <div style={styles.curriculumHeader}>CURRICULUM</div>
            <div style={styles.langList}>
@@ -123,7 +119,7 @@ export default function App() {
                  onClick={() => { setCurrentLanguage(lang); setCurrentLessonIndex(0); }}
                  style={{ ...styles.langBtn, color: lang.id === currentLanguage.id ? '#ef4444' : '#94a3b8' }}
                >
                  {lang.name}
                  {lang.name} {lang.id === currentLanguage.id && "•"}
                </button>
              ))}
            </div>
@@ -133,26 +129,31 @@ export default function App() {
            </div>
          </aside>

          {/* LESSON */}
          <main style={styles.lessonPanel}>
            <div style={styles.moduleTag}>MODULE {currentLessonIndex + 1}</div>
            <h1 style={styles.lessonTitle}>{current.title}</h1>
            <p style={styles.lessonText}>{current.content}</p>
            <div style={styles.contentBox}>
              <p style={styles.lessonText}>{current.content}</p>
            </div>
            
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

          {/* EDITOR */}
          <section style={styles.editorPanel}>
            <CodeEditor 
              user={user} 
              setUser={setUser} 
              user={user} setUser={setUser} 
              language={currentLanguage.id}
              starterCode={current.starterCode}
              expectedOutput={current.expectedOutput}
@@ -161,36 +162,37 @@ export default function App() {
          </section>
        </div>

        {/* PAYMENT MODAL (PAYPAL & DEBIT) */}
        {/* YOUR PREFERRED PAYMENT MODAL */}
        {isPaystackOpen && (
          <div style={styles.modalOverlay} onClick={() => setIsPaystackOpen(false)}>
            <div style={styles.payModal} onClick={e => e.stopPropagation()}>
               <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
                  <h3 style={{margin: 0}}>🚀 UPGRADE TO PRO</h3>
                  <button onClick={() => setIsPaystackOpen(false)} style={styles.modalCloseX}>✕</button>
               </div>
               <p style={{fontSize: '13px', color: '#94a3b8', marginBottom: '20px'}}>
                 Unlock unlimited code executions, high-tier rankings, and premium course content.
               </p>
               
               <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                 <PayPalButtons 
                    style={{ layout: "vertical", shape: "rect" }}
          <div style={styles.modalOverlay}>
            <div style={styles.modalCard}>
              <h2 style={{ color: '#fff', fontSize: '20px' }}>Unlock Zenin Pro</h2>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>M-Pesa or Global Card</p>

              <div style={styles.paymentMethodBox}>
                  <span style={styles.methodLabel}>KENYA (M-PESA / CARD)</span>
                  <button 
                    onClick={() => window.open("https://paystack.shop/pay/zdrj1fu6qq", "_blank")}
                    style={styles.paystackLink}
                  >
                    PAY KES 500
                  </button>
                  <button onClick={handleActivatePro} style={styles.verifyBtn}>I HAVE PAID VIA M-PESA</button>
              </div>

              <div style={{ margin: '15px 0', color: '#475569', fontSize: '10px', fontWeight: 'bold' }}>OR</div>

              <div style={styles.paymentMethodBoxPayPal}>
                  <span style={{...styles.methodLabel, color: '#003087'}}>GLOBAL (PAYPAL / CARD)</span>
                  <PayPalButtons 
                    style={{ layout: 'vertical', shape: 'rect', height: 40 }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [{ amount: { value: "9.99" } }],
                      });
                      return actions.order.create({ purchase_units: [{ amount: { value: "4.00" } }] });
                    }}
                    onApprove={async (data, actions) => {
                      const details = await actions.order.capture();
                      const updates = { isPro: true };
                      setUser(prev => ({ ...prev, ...updates }));
                      await updateUserProfile(user.uid, updates);
                      setIsPaystackOpen(false);
                      alert(`Welcome to Pro, ${details.payer.name.given_name}!`);
                    }}
                 />
               </div>
                    onApprove={handleActivatePro}
                  />
              </div>
              <button onClick={() => setIsPaystackOpen(false)} style={styles.modalClose}>MAYBE LATER</button>
            </div>
          </div>
        )}
@@ -219,6 +221,7 @@ export default function App() {
  );
}

// TIER HELPER
const TierColumn = ({ title, xp, data, color }) => (
  <div style={styles.tierCol}>
    <div style={{...styles.tierHeader, borderBottom: `2px solid ${color}`}}>
@@ -228,9 +231,7 @@ const TierColumn = ({ title, xp, data, color }) => (
    <div style={styles.tierList}>
      {data.map((ninja, i) => (
        <div key={i} style={styles.tierRow}>
          <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
            {i+1}. {ninja.username || "NINJA"}
          </span>
          <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{i+1}. {ninja.username || "NINJA"}</span>
          <span style={{color: color, fontWeight: 'bold'}}>{ninja.xp}</span>
        </div>
      ))}
@@ -241,42 +242,48 @@ const TierColumn = ({ title, xp, data, color }) => (
const styles = {
  appContainer: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#020617', color: '#fff', overflow: 'hidden', fontFamily: 'Inter, sans-serif' },
  nav: { height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', backgroundColor: '#000', borderBottom: '1px solid #1e293b' },
  logo: { marginLeft: '12px', fontWeight: '900', fontStyle: 'italic', fontSize: '18px', letterSpacing: '1px' },
  logo: { fontWeight: '900', fontStyle: 'italic', fontSize: '20px' },
  upgradeBtn: { marginLeft: '20px', backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '11px', fontWeight: '900', cursor: 'pointer' },
  proBadge: { marginLeft: '20px', color: '#22c55e', fontSize: '10px', fontWeight: '900', border: '1px solid #22c55e', padding: '4px 10px', borderRadius: '4px' },
  rankLink: { marginLeft: '20px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' },
  streakBadge: { marginLeft: '15px', color: '#fb923c', fontSize: '11px', fontWeight: '900' },
  navRight: { display: 'flex', alignItems: 'center', gap: '15px' },
  syncContainer: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#475569', fontWeight: 'bold' },
  syncDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px #22c55e' },
  runsText: { color: '#475569', fontSize: '11px', fontWeight: 'bold' },
  userBadge: { color: '#22c55e', fontSize: '12px', fontWeight: 'bold' },
  userBadge: { color: '#22c55e', fontSize: '12px', fontWeight: 'bold', background: 'rgba(34, 197, 94, 0.1)', padding: '4px 12px', borderRadius: '20px' },
  logoutBtn: { background: 'none', border: 'none', color: '#475569', fontSize: '11px', cursor: 'pointer' },
  workspace: { display: 'flex', flex: 1, overflow: 'hidden' },
  sidebar: { width: '220px', backgroundColor: '#000', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column' },
  curriculumHeader: { padding: '24px 16px 12px', fontSize: '10px', fontWeight: '900', color: '#475569' },
  langList: { flex: 1, overflowY: 'auto' },
  langBtn: { width: '100%', textAlign: 'left', padding: '14px 20px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '800' },
  lessonPanel: { flex: '1 1 45%', padding: '40px', overflowY: 'auto', borderRight: '1px solid #1e293b', backgroundColor: '#020617' },
  lessonPanel: { flex: '1 1 45%', padding: '40px', overflowY: 'auto', borderRight: '1px solid #1e293b' },
  editorPanel: { flex: '1 1 55%', backgroundColor: '#000' },
  moduleTag: { color: '#22c55e', fontSize: '10px', fontWeight: '900' },
  lessonTitle: { fontSize: '32px', fontWeight: '900', margin: '10px 0 20px' },
  contentBox: { backgroundColor: 'rgba(255,255,255,0.03)', borderLeft: '4px solid #22c55e', padding: '24px', borderRadius: '8px', marginBottom: '20px' },
  lessonText: { color: '#94a3b8', lineHeight: '1.8', fontSize: '15px' },
  solutionSection: { marginTop: '40px', paddingTop: '20px' },
  solutionSection: { marginBottom: '40px' },
  solLabel: { fontSize: '10px', color: '#475569', fontWeight: '900', marginBottom: '10px' },
  solCode: { display: 'block', padding: '20px', background: '#0a0f1d', borderRadius: '8px', color: '#64748b', fontSize: '13px', marginBottom: '25px', fontFamily: 'monospace', border: '1px solid #1e293b' },
  navBtns: { display: 'flex', gap: '15px', marginTop: '40px' },
  btnPrev: { flex: 1, padding: '14px', background: '#1e293b', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer' },
  btnNext: { flex: 1, padding: '14px', background: '#22c55e', border: 'none', color: '#000', fontWeight: '900', borderRadius: '6px', cursor: 'pointer' },
  loading: { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#ef4444' },
  
  // MODALS
  solCode: { display: 'block', padding: '20px', background: '#0a0f1d', borderRadius: '8px', color: '#64748b', fontSize: '13px', marginBottom: '20px', border: '1px solid #1e293b' },
  navBtns: { display: 'flex', gap: '15px' },
  btnPrev: { flex: 1, padding: '14px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  btnNext: { flex: 1, padding: '14px', background: '#22c55e', color: '#000', border: 'none', fontWeight: '900', borderRadius: '6px', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalCard: { background: '#020617', border: '1px solid #1e293b', padding: '30px', borderRadius: '20px', width: '360px', textAlign: 'center' },
  modalClose: { background: 'none', border: 'none', color: '#475569', marginTop: '20px', cursor: 'pointer', fontSize: '11px' },
  paymentMethodBox: { padding: '15px', border: '1px solid #22c55e', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.05)', textAlign: 'left' },
  paymentMethodBoxPayPal: { padding: '15px', border: '1px solid #cbd5e1', borderRadius: '12px', background: '#fff', textAlign: 'left' },
  methodLabel: { fontSize: '9px', fontWeight: '900', color: '#22c55e', display: 'block', marginBottom: '10px' },
  paystackLink: { width: '100%', display: 'block', backgroundColor: '#22c55e', color: '#000', padding: '12px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', textAlign: 'center' },
  verifyBtn: { width: '100%', backgroundColor: 'transparent', color: '#22c55e', border: 'none', padding: '5px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' },
  leaderboardModal: { backgroundColor: '#000', width: '95%', maxWidth: '1300px', height: '85vh', borderRadius: '12px', border: '1px solid #1e293b', padding: '30px', display: 'flex', flexDirection: 'column' },
  payModal: { backgroundColor: '#0a0f1d', width: '100%', maxWidth: '450px', borderRadius: '12px', border: '1px solid #1e293b', padding: '30px' },
  modalCloseX: { background: 'none', border: 'none', color: '#475569', fontSize: '24px', cursor: 'pointer' },
  tierGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', flex: 1, minHeight: 0 },
  tierCol: { backgroundColor: '#0a0f1d', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #1e293b' },
  tierHeader: { padding: '15px', textAlign: 'center', backgroundColor: '#000' },
  tierList: { padding: '8px', overflowY: 'auto', flex: 1 },
  tierRow: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '10px 8px', borderBottom: '1px solid #1e293b' }
  tierRow: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '10px 8px', borderBottom: '1px solid #1e293b' },
  loading: { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#ef4444' }
};
