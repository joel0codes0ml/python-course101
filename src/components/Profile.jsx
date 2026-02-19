import { useEffect, useState } from "react";
import { auth, updateUserProfile, subscribeToUserData } from "../firebase";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    github: "",
    linkedin: "",
    website: "",
    photoURL: ""
  });

  useEffect(() => {
    if (!auth.currentUser) return;

    // Use the real-time subscriber we built in firebase.js
    const unsubscribe = subscribeToUserData(auth.currentUser.uid, (data) => {
      setProfile(data);
      setFormData({
        username: data.username || "",
        bio: data.bio || "",
        github: data.links?.github || "",
        linkedin: data.links?.linkedin || "",
        website: data.links?.website || "",
        photoURL: data.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${data.username}`
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    try {
      await updateUserProfile(auth.currentUser.uid, {
        username: formData.username,
        bio: formData.bio,
        links: {
          github: formData.github,
          linkedin: formData.linkedin,
          website: formData.website
        },
        photoURL: formData.photoURL
      });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">LOADING_DATA...</div>;

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div style={styles.avatarContainer}>
          <img src={formData.photoURL} alt="Avatar" style={styles.avatar} />
          {isEditing && (
             <button 
               onClick={() => setFormData({...formData, photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random()}`})}
               style={styles.diceBtn}
             >🎲 Randomize</button>
          )}
        </div>
        <div style={styles.info}>
          <h1 style={styles.name}>{profile.username || "Anonymous Ninja"}</h1>
          <p style={styles.levelBadge}>LEVEL {Math.floor(profile.xp / 100) + 1} | {profile.xp} XP</p>
          <p style={styles.bioText}>{profile.bio || "No bio yet. Start coding to build your legacy."}</p>
        </div>
        <button onClick={() => setIsEditing(!isEditing)} style={styles.editBtn}>
          {isEditing ? "CANCEL" : "EDIT PROFILE"}
        </button>
      </div>

      <div style={styles.grid}>
        {/* LEFT COLUMN: STATS & PROGRESS */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>MASTERY SECTORS</h3>
          <ProgressBar label="WEB DEVELOPMENT" progress={profile.sectorProgress?.web || 0} color="#3b82f6" />
          <ProgressBar label="DATA SCIENCE" progress={profile.sectorProgress?.data || 0} color="#f59e0b" />
          <ProgressBar label="AI & MACHINE LEARNING" progress={profile.sectorProgress?.ai || 0} color="#ef4444" />
        </div>

        {/* RIGHT COLUMN: LINKS & SETTINGS */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>{isEditing ? "EDIT DETAILS" : "SOCIAL LINKS"}</h3>
          {isEditing ? (
            <div style={styles.form}>
              <input style={styles.input} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="Username" />
              <textarea style={styles.textarea} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="Tell us about yourself..." />
              <input style={styles.input} value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} placeholder="GitHub URL" />
              <input style={styles.input} value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} placeholder="LinkedIn URL" />
              <button onClick={handleSave} style={styles.saveBtn}>SAVE SETTINGS</button>
            </div>
          ) : (
            <div style={styles.linkList}>
              <a href={profile.links?.github} target="_blank" style={styles.link}>🐙 GitHub</a>
              <a href={profile.links?.linkedin} target="_blank" style={styles.link}>💼 LinkedIn</a>
              <a href={profile.links?.website} target="_blank" style={styles.link}>🌐 Website</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ProgressBar = ({ label, progress, color }) => (
  <div style={{ marginBottom: '15px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '5px' }}>
      <span>{label}</span>
      <span>{progress}%</span>
    </div>
    <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '10px' }}>
      <div style={{ width: `${progress}%`, height: '100%', background: color, borderRadius: '10px', transition: 'width 1s' }} />
    </div>
  </div>
);

const styles = {
  container: { padding: '40px', maxWidth: '1000px', margin: '0 auto', color: '#fff' },
  header: { display: 'flex', alignItems: 'center', gap: '30px', background: '#0f172a', padding: '30px', borderRadius: '24px', border: '1px solid #1e293b', marginBottom: '30px' },
  avatar: { width: '100px', height: '100px', borderRadius: '50%', background: '#1e293b' },
  name: { fontSize: '32px', fontWeight: '900', margin: 0 },
  levelBadge: { color: '#22c55e', fontWeight: 'bold', fontSize: '12px', marginTop: '5px' },
  bioText: { color: '#94a3b8', fontSize: '14px', marginTop: '10px' },
  editBtn: { background: 'transparent', border: '1px solid #475569', color: '#94a3b8', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', marginLeft: 'auto' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  card: { background: '#0f172a', border: '1px solid #1e293b', padding: '24px', borderRadius: '24px' },
  cardTitle: { fontSize: '12px', color: '#475569', fontWeight: '900', marginBottom: '20px', letterSpacing: '1px' },
  input: { width: '100%', padding: '12px', background: '#020617', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff', marginBottom: '10px' },
  textarea: { width: '100%', height: '80px', padding: '12px', background: '#020617', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff', marginBottom: '10px' },
  saveBtn: { background: '#22c55e', color: '#000', width: '100%', padding: '12px', borderRadius: '8px', fontWeight: '900', border: 'none', cursor: 'pointer' },
  linkList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  link: { color: '#3b82f6', textDecoration: 'none', fontSize: '14px' },
  diceBtn: { display: 'block', fontSize: '10px', marginTop: '10px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }
};

