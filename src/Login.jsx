import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [user, setUser] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.length > 2) onLogin(user);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* SHARINGAN ICON */}
        <div style={styles.iconContainer}>
           <img 
             src="https://i.pinimg.com/1200x/a7/21/d5/a721d5d3b9294833c32f9c5f8db71b43.jpg" 
             alt="Sharingan" 
             style={{ width: '100%', height: '100%', borderRadius: '50%' }} 
           />
        </div>
        <h2 style={styles.title}>ZENIN<span style={{ color: "#ef4444" }}>LABS</span></h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" placeholder="Username" required
            style={styles.input} onChange={(e) => setUser(e.target.value)} 
          />
          <input type="password" placeholder="Access Key" style={styles.input} />
          <button type="submit" style={styles.button}>INITIALIZE SYSTEM</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#0f172a" },
  card: { background: "#1e293b", padding: "40px", borderRadius: "15px", border: "2px solid #ef4444", textAlign: "center", width: "320px" },
  iconContainer: { width: "80px", height: "80px", margin: "0 auto 20px", display: "flex", justifyContent: "center", alignItems: "center", border: "4px solid #000", borderRadius: "50%", overflow: 'hidden' },
  input: { width: "100%", padding: "12px", marginBottom: "15px", background: "#0f172a", border: "1px solid #334155", color: "#fff", borderRadius: "5px", boxSizing: "border-box" },
  button: { width: "100%", padding: "12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" },
  title: { color: "#fff", letterSpacing: "3px", fontFamily: "monospace" }
};
