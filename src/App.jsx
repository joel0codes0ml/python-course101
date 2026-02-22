import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Mascot from "./components/Mascot.jsx";
import Login from "./Login.jsx";
import Profile from "./components/Profile.jsx";
import CodeEditor from "./components/CodeEditor.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import {
  onAuthChange,
  updateUserProfile,
  logout,
  subscribeLeaderboard,
  subscribeToUserData
} from "./firebase";

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
  { id: "web", name: "WEB DEV", icon: "🌐" },
  { id: "data", name: "DATA SCIENCE", icon: "📊" },
  { id: "ai", name: "AI & ML", icon: "🧠" },
  { id: "sys", name: "SYSTEMS", icon: "⚙️" }
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
  const [currentLanguage, setCurrentLanguage] = useState(
    languages.find((l) => l.sector === "web")
  );
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPaystackOpen, setIsPaystackOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const RUN_LIMIT = 25;

  useEffect(() => {
    let unsubscribeUser;
    let unsubscribeLeader;

    const unsubscribeAuth = onAuthChange((firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setInitializing(false);
        return;
      }

      // 🚀 Render instantly
      setUser({
        uid: firebaseUser.uid,
        username: firebaseUser.displayName || "STUDENT",
        xp: 0,
        dailyExecutions: 0,
        streak: 1
      });

      setInitializing(false);

      // 🔥 Real-time profile (instant cache hit)
      unsubscribeUser = subscribeToUserData(
        firebaseUser.uid,
        async (profile) => {
          if (!profile) return;

          setUser((prev) => ({ ...prev, ...profile }));

          if (!profile.setupComplete) setNeedsProfile(true);

          // Non-blocking streak logic
          const today = new Date().toDateString();
          const lastSeen = profile.lastLoginDate || "";
          let streak = profile.streak || 1;

          if (lastSeen !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            streak =
              lastSeen === yesterday.toDateString()
                ? streak + 1
                : 1;

            updateUserProfile(firebaseUser.uid, {
              lastLoginDate: today,
              streak
            });
          }
        }
      );

      unsubscribeLeader = subscribeLeaderboard((data) =>
        setLeaderboard(data)
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) unsubscribeUser();
      if (unsubscribeLeader) unsubscribeLeader();
    };
  }, []);

  const handleActivatePro = async () => {
    await updateUserProfile(user.uid, { isPro: true });
    setIsPaystackOpen(false);
  };

  if (initializing)
    return (
      <div style={styles.loading}>
        <div className="sh-logo" style={{ fontSize: "50px" }}>🌀</div>
        <h2 style={{ marginTop: "20px" }}>RESUMING_SESSION...</h2>
      </div>
    );

  if (!user) return <Login onLogin={setUser} />;

  const filteredLanguages = languages.filter(
    (l) => l.sector === activeSector
  );
  const lessons = currentLanguage?.lessons || [];
  const current =
    lessons[currentLessonIndex] || {
      title: "Course Locked",
      content: "Module calibrating..."
    };

  const runsLeft = Math.max(
    0,
    RUN_LIMIT - (user?.dailyExecutions || 0)
  );

  return (
    <PayPalScriptProvider options={{ "client-id": "test", currency: "USD" }}>
      <div style={styles.appContainer}>
        {/* NAV */}
        <nav style={styles.nav}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Mascot />
            <span style={styles.logo}>ZENIN<span style={{ color: "#ef4444" }}>LABS</span></span>

            {!user?.isPro ? (
              <button
                onClick={() => setIsPaystackOpen(true)}
                style={styles.upgradeBtn}
              >
                ⚡ GO PRO
              </button>
            ) : (
              <span style={styles.proBadge}>👑 PRO MEMBER</span>
            )}

            <button
              onClick={() => setIsLeaderboardOpen(true)}
              style={styles.rankLink}
            >
              🏆 RANKINGS
            </button>

            <div style={styles.streakBadge}>
              🔥 {user?.streak || 1} DAY STREAK
            </div>
          </div>

          <div style={styles.navRight}>
            <div style={styles.syncContainer}>
              <div style={styles.syncDot} />
              <span>SYNCED</span>
            </div>

            {!user?.isPro && (
              <span style={styles.runsText}>
                {runsLeft}/{RUN_LIMIT} RUNS LEFT
              </span>
            )}

            <button
              onClick={() =>
                setActiveView(
                  activeView === "profile"
                    ? "workspace"
                    : "profile"
                )
              }
              style={
                activeView === "profile"
                  ? styles.profileBtnActive
                  : styles.profileBtn
              }
            >
              <img
                src={
                  user?.photoURL ||
                  `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${user?.username}`
                }
                style={styles.navAvatar}
                alt="Profile"
              />
              <div style={styles.navUserInfo}>
                <span style={styles.navUsername}>
                  {user?.username?.toUpperCase() || "NINJA"}
                </span>
                <span style={styles.navXP}>
                  {user?.xp || 0} XP
                </span>
              </div>
            </button>

            <button
              onClick={() => logout()}
              style={styles.logoutBtn}
            >
              LOGOUT
            </button>
          </div>
        </nav>

        {/* WORKSPACE */}
        <div style={styles.workspace}>
          <aside style={styles.sidebar}>
            <div style={styles.sectorScroll}>
              {SECTORS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSector(s.id)}
                  style={{
                    ...styles.sectorTab,
                    color:
                      activeSector === s.id
                        ? "#ef4444"
                        : "#475569"
                  }}
                >
                  {s.icon}
                  <div style={{ fontSize: "8px" }}>
                    {s.name}
                  </div>
                </button>
              ))}
            </div>

            <div style={styles.curriculumHeader}>
              {activeSector.toUpperCase()} MODULES
            </div>

            {filteredLanguages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  setCurrentLanguage(lang);
                  setCurrentLessonIndex(0);
                }}
                style={styles.langBtn}
              >
                {lang.name.toUpperCase()}
              </button>
            ))}
          </aside>

          <main style={styles.lessonPanel}>
            <h1 style={styles.lessonTitle}>
              {current.title}
            </h1>
            <p style={styles.lessonText}>
              {current.content}
            </p>
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
      </div>
    </PayPalScriptProvider>
  );
}


