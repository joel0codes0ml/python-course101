import { useEffect, useState } from "react";
import { subscribeLeaderboard, auth } from "../firebase";

const TIERS = [
  { name: "DIAMOND", min: 801, color: "#3b82f6", icon: "💎" },
  { name: "GOLD", min: 601, color: "#f59e0b", icon: "🥇" },
  { name: "SILVER", min: 401, color: "#94a3b8", icon: "🥈" },
  { name: "BRONZE", min: 201, color: "#b45309", icon: "🥉" },
  { name: "IRON", min: 0, color: "#475569", icon: "💀" },
];

export default function Leaderboard({ compact = false }) {
  const [users, setUsers] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    // Real-time listener: whenever someone gains XP, the list re-orders instantly.
    const unsub = subscribeLeaderboard((data) => {
      setUsers(data);
    });
    return () => unsub();
  }, []);

  // Helper to find which tier a user belongs to
  const getTier = (xp) => TIERS.find(t => xp >= t.min) || TIERS[4];

  return (
    <div style={compact ? styles.compactContainer : styles.fullContainer}>
      {!compact && <h2 style={styles.title}>GLOBAL RANKINGS</h2>}
      
      <div style={styles.list}>
        {users.map((u, index) => {
          const userTier = getTier(u.xp || 0);
          const isMe = u.uid === currentUser?.uid;

          return (
            <div 
              key={u.uid} 
              style={{
                ...styles.userRow,
                backgroundColor: isMe ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                borderLeft: isMe ? '4px solid #22c55e' : `4px solid ${userTier.color}`
              }}
            >
              <div style={styles.rankSection}>
                <span style={styles.rankNumber}>#{index + 1}</span>
                <img 
                  src={u.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`} 
                  alt="avatar" 
                  style={styles.avatar} 
                />
              </div>

              <div style={styles.infoSection}>
                <div style={styles.nameRow}>
                  <span style={isMe ? styles.myName : styles.userName}>
                    {u.username?.toUpperCase() || "NINJA"}
                  </span>
                  {u.isPro && <span style={styles.proTag}>PRO</span>}
                </div>
                <span style={{ ...styles.tierName, color: userTier.color }}>
                  {userTier.icon} {userTier.name}
                </span>
              </div>

              <div style={styles.xpSection}>
                <span style={styles.xpText}>{u.xp || 0}</span>
                <span style={styles.xpLabel}>XP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  fullContainer: { padding: '20px', backgroundColor: '#020617', height: '100%', overflowY: 'auto' },
  compactContainer: { padding: '10px', backgroundColor: 'transparent' },
  title: { fontSize: '18px', fontWeight: '900', color: '#fff', marginBottom: '20px', letterSpacing: '2px' },
  list: { display: 'flex', flexDirection: 'column', gap: '8px' },
  userRow: { 
    display: 'flex', 
    alignItems: 'center', 
    padding: '12px 16px', 
    borderRadius: '12px', 
    background: '#0f172a', 
    transition: 'transform 0.2s'
  },
  rankSection: { display: 'flex', alignItems: 'center', gap: '15px', minWidth: '80px' },
  rankNumber: { fontSize: '12px', fontWeight: '900', color: '#475569', width: '30px' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', background: '#1e293b' },
  infoSection: { flex: 1, display: 'flex', flexDirection: 'column' },
  nameRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  userName: { fontSize: '14px', fontWeight: 'bold', color: '#cbd5e1' },
  myName: { fontSize: '14px', fontWeight: 'bold', color: '#22c55e' },
  proTag: { fontSize: '8px', padding: '2px 6px', background: '#f59e0b', color: '#000', borderRadius: '4px', fontWeight: '900' },
  tierName: { fontSize: '10px', fontWeight: '900', marginTop: '2px' },
  xpSection: { textAlign: 'right' },
  xpText: { display: 'block', fontSize: '16px', fontWeight: '900', color: '#fff' },
  xpLabel: { fontSize: '9px', color: '#475569', fontWeight: 'bold' }
};

