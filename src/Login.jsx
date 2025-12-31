import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [user, setUser] = useState("");
  const [source, setSource] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.length > 2 && source !== "") {
        // We save the source to local storage for your data collection
        localStorage.setItem("zenin_referral", source);
        onLogin(user);
    } else {
        alert("Please enter a username and select how you found us!");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
           <img src="https://i.pinimg.com/1200x/a7/21/d5/a721d5d3b9294833c32f9c5f8db71b43.jpg" alt="Sharingan" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
        </div>
        <h2 style={styles.title}>ZENIN<span style={{ color: "#ef4444" }}>LABS</span></h2>
        
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" required style={styles.input} onChange={(e) => setUser(e.target.value)} />
          <input type="password" placeholder="Access Key" style={styles.input} />
          
          <select style={styles.input} onChange={(e) => setSource(e.target.value)} required>
            <option value="">How did you find us?</option>
            <option value="Tiktok">Tiktok</option>
            <option value="Instagram">Instagram</option>
            <option value="Friend">A Friend</option>
            <option value="Search">Google Search</option>
          </select>

          <button type="submit" style={styles.button}>INITIALIZE SYSTEM</button>
        </form>
      </div>
    </div>
  );
}
// ... (styles remain the same as your previous Login.jsx)
