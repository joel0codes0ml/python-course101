import React, { useEffect, useState } from "react";
import { auth, updateUserProfile, subscribeToUserData } from "../firebase";

export default function Profile({ onComplete }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State matching your new schema
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    photoURL: ""
  });

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = subscribeToUserData(auth.currentUser.uid, (data) => {
      if (data) {
        setProfile(data);
        setFormData({
          username: data.username || "",
          bio: data.bio || "",
          instagram: data.links?.instagram || "",
          linkedin: data.links?.linkedin || "",
          youtube: data.links?.youtube || "",
          photoURL: data.photoURL || `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${data.username || "ninja"}`
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!formData.username.trim()) {
      alert("A Ninja needs a name.");
      return;
    }

    try {
      await updateUserProfile(auth.currentUser.uid, {
        username: formData.username,
        bio: formData.bio,
        links: {
          instagram: formData.instagram,
          linkedin: formData.linkedin,
          youtube: formData.youtube
        },
        photoURL: formData.photoURL,
        setupComplete: true // Clears the onboarding flag
      });
      
      if (onComplete) onComplete(); 
    } catch (err) {
      console.error("Update Error:", err);
      alert("System Error: Could not save profile.");
    }
  };

  if (loading) return (
    <div style={{...ui.container, color: '#ef4444', fontWeight: 'bold'}}>
      INITIALIZING PROFILE...
    </div>
  );

  return (
    <div style={ui.container}>
      <div style={ui.card}>
        <div style={ui.header}>
            <img src={formData.photoURL} alt="Avatar" style={ui.avatar} />
            <div>
                <h2 style={{ margin: 0, letterSpacing: '2px', color: '#fff' }}>NINJA_PROFILE</h2>
                <p style={{ color: '#475569', fontSize: '11px', margin: '5px 0 0' }}>Configure your ZeninLabs identity.</p>
            </div>
        </div>
        
        <label style={ui.label}>USERNAME</label>
        <input style={ui.input} placeholder="e.g. CodeNinja99" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
        
        <label style={ui.label}>AVATAR URL (Optional)</label>
        <input style={ui.input} placeholder="https://..." value={formData.photoURL} onChange={e => setFormData({...formData, photoURL: e.target.value})} />
        
        <label style={ui.label}>BIO</label>
        <textarea style={ui.textarea} placeholder="What are you building?" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
        
        <label style={ui.label}>SOCIAL LINKS</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <input style={ui.input} placeholder="Instagram URL" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
            <input style={ui.input} placeholder="LinkedIn URL" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
        </div>
        <input style={ui.input} placeholder="YouTube Channel URL" value={formData.youtube} onChange={e => setFormData({...formData, youtube: e.target.value})} />

        <button onClick={handleSave} style={ui.saveBtn}>SAVE & ENTER LABS</button>
      </div>
    </div>
  );
}

const ui = {
  container: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', fontFamily: 'monospace' },
  card: { background: '#000', border: '1px solid #1e293b', padding: '40px', borderRadius: '12px', width: '450px', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
  avatar: { width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#1e293b', border: '2px solid #22c55e' },
  label: { fontSize: '10px', fontWeight: '900', color: '#64748b', marginBottom: '8px', marginTop: '15px' },
  input: { backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '12px', borderRadius: '6px', color: '#fff', fontSize: '12px', outline: 'none', fontFamily: 'monospace' },
  textarea: { backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '12px', borderRadius: '6px', color: '#fff', fontSize: '12px', height: '80px', resize: 'none', outline: 'none', fontFamily: 'monospace' },
  saveBtn: { backgroundColor: '#22c55e', color: '#000', padding: '15px', borderRadius: '6px', fontWeight: '900', border: 'none', cursor: 'pointer', marginTop: '30px', transition: '0.2s' }
};

