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

    // Real-time subscriber
    const unsubscribe = subscribeToUserData(auth.currentUser.uid, (data) => {
      if (data) {
        setProfile(data);
        setFormData({
          username: data.username || "",
          bio: data.bio || "",
          github: data.links?.github || "",
          linkedin: data.links?.linkedin || "",
          website: data.links?.website || "",
          photoURL: data.photoURL || `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${data.username}`
        });
      }
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
        photoURL: formData.photoURL,
        setupComplete: true // Marks onboarding as finished
      });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  if (loading) return <div style={styles.loader}>Loading Student Profile...</div>;

  return (
    <div style={styles.container}>
      {/* PROFILE HEADER */}
      <div style={styles.header}>
        <div style={styles.avatarContainer}>
          <img src={formData.photoURL} alt="Avatar" style={styles.avatar} />
          {isEditing && (
             <button 
               onClick={() => setFormData({...formData, photoURL: `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${Math.random()}`})}
               style={styles.diceBtn}
             >🎲 Change Avatar</button>
          )}
        </div>
        <div style={styles.info}>
          <h1 style={styles.name}>{profile?.username || "New Student"}</h1>
          <p style={styles.levelBadge}>
            LEVEL {Math.floor((profile?.xp || 0) / 100) + 1} • {profile?.xp || 0} TOTAL XP
          </p>
          <p style={styles.bioText}>{profile?.bio || "No bio provided. Update your profile to share your goals."}</p>
        </div>
        <button onClick={() => setIsEditing(!isEditing)} style={styles.editBtn}>
          {isEditing ? "CANCEL" : "EDIT PROFILE"}
        </button>
      </div>

      <div style={styles.grid}>
        {/* MASTERY PROGRESS */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>SKILL MASTERY</h3>
          <ProgressBar label="WEB DEVELOPMENT" progress={profile?.sectorProgress?.web || 0} color="#3b82f6" />
          <ProgressBar label="DATA SCIENCE" progress={profile?.sectorProgress?.data || 0} color="#f59e0b" />
          <ProgressBar label="ARTIFICIAL INTELLIGENCE" progress={profile?.sectorProgress?.ai || 0} color="#ef4444" />
        </div>

        {/* SOCIAL & SETTINGS */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>{isEditing ? "UPDATE DETAILS" : "CONNECTIONS"}</h3>
          {isEditing ? (
            <div style={styles.form}>
              <input style={styles.input} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="Username" />
              <textarea style={styles.textarea} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="Brief bio..." />
              <input style={styles.input} value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} placeholder="GitHub URL" />
              <input style={styles.input} value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} placeholder="LinkedIn URL" />
              <button onClick={handleSave} style={styles.saveBtn}>SAVE CHANGES</button>
            </div>
          ) : (
            <div style={styles.linkList}>
              <a href={profile?.links?.github || "#"} target="_blank" rel="noreferrer" style={styles.link}>External: GitHub</a>
              <a href={profile?.links?.linkedin || "#"} target="_blank" rel="noreferrer" style={styles.link}>External: LinkedIn</a>
              <a href={profile?.links?.website || "#"} target="_blank" rel="noreferrer" style={styles.link}>External: Portfolio</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ProgressBar = ({ label, progress, color }) => (
  <div style={{ marginBottom: '20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '8px', color: '#94a3b8' }}>
      <span>{label}</span>
      <span>{progress}%</span>
    </div>
    <div style={{ width: '100%', height: '8px', background: '#1e293b', borderRadius: '10px' }}>
      <div style={{ width: `${progress}%`, height: '100%', background: color, borderRadius: '10px', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }} />
    </div>
  </div>
);

const styles = {
  container: { padding: '40px', maxWidth: '1000px', margin: '0 auto', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' },
  loader: { padding: '100px', textAlign: 'center', color: '#94a3b8', letterSpacing: '2px' },
  header: { display: 'flex', alignItems: 'center', gap: '30px', background: '#0f172a', padding: '40px', borderRadius: '24px', border: '1px solid #1e293b', marginBottom: '30px' },
  avatar: { width: '120px', height: '120px', borderRadius: '24px', background: '#1e293b', objectFit: 'cover' },
  name: { fontSize: '32px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' },
  levelBadge: { color: '#22c55e', fontWeight: '700', fontSize: '12px', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '1px' },
  bioText: { color: '#94a3b8', fontSize: '15px', marginTop: '12px', lineHeight: '1.6' },
  editBtn: { background: '#1e293b', border: '1px solid #334155', color: '#fff', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', marginLeft: 'auto', transition: 'all 0.2s' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  card: { background: '#0f172a', border: '1px solid #1e293b', padding: '32px', borderRadius: '24px' },
  cardTitle: { fontSize: '12px', color: '#64748b', fontWeight: '800', marginBottom: '24px', letterSpacing: '1.5px', textTransform: 'uppercase' },
  input: { width: '100%', padding: '14px', background: '#020617', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff', marginBottom: '12px', fontSize: '14px' },
  textarea: { width: '100%', height: '100px', padding: '14px', background: '#020617', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff', marginBottom: '12px', fontSize: '14px', resize: 'none' },
  saveBtn: { background: '#fff', color: '#000', width: '100%', padding: '14px', borderRadius: '12px', fontWeight: '700', border: 'none', cursor: 'pointer', marginTop: '10px' },
  linkList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  link: { color: '#3b82f6', textDecoration: 'none', fontSize: '15px', fontWeight: '500' },
  diceBtn: { display: 'block', fontSize: '11px', marginTop: '12px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }
};

