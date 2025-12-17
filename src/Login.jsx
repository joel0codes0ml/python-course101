import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [user, setUser] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Only allow login if username is 3+ characters
    if (user.length > 2) {
      onLogin(user);
    } else {
      alert("System access denied: Username too short.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* SHARINGAN TECH ICON */}
        <div style={styles.iconContainer}>
          <div style={styles.eyeOuter}>
            <div style={styles.eyeInner} />
          </div>
        </div>

        <h2 style={styles.title}>
          ZENIN<span style={{ color: "#ef4444" }}>LABS</span>
        </h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            required
            style={styles.input}
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Access Key" 
            style={styles.input} 
          />
          <button type="submit" style={styles.button}>
            INITIALIZE SYSTEM
          </button>
        </form>
        
        <p style={{ color: "#475569", fontSize: "10px", marginTop: "20px", letterSpacing: "1px" }}>
          PROTOCOL: UCHIHA_v2.0
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
  },
  card: {
    background: "#1e293b",
    padding: "40px",
    borderRadius: "15px",
    border: "2px solid #ef4444",
    textAlign: "center",
    width: "320px",
    boxShadow: "0 0 30px rgba(239, 68, 68, 0.1)",
  },
  iconContainer: {
    width: "80px",
    height: "80px",
    background: "#ef4444",
    borderRadius: "50%",
    margin: "0 auto 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "4px solid #000",
  },
  eyeOuter: {
    width: "40px",
    height: "40px",
    border: "6px solid #000",
    borderRadius: "50%",
    position: "relative",
  },
  eyeInner: {
    width: "10px",
    height: "10px",
    background: "#000",
    borderRadius: "50%",
    position: "absolute",
    top: "5px",
    left: "12px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    background: "#0f172a",
    border: "1px solid #334155",
    color: "#fff",
    borderRadius: "5px",
    boxSizing: "border-box",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
  title: {
    color: "#fff",
    letterSpacing: "3px",
    fontFamily: "monospace",
    marginBottom: "25px",
  },
};
