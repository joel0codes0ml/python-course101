import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onLogin(name.trim());
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0f172a", color: "#fff" }}>
      <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
        <h1>Login to ZeninLabs</h1>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", width: "200px", marginBottom: "10px", border: "1px solid #334155" }}
        />
        <br />
        <button style={{ padding: "10px 20px", borderRadius: "5px", border: "none", background: "#ef4444", color: "#fff", cursor: "pointer" }}>
          LOGIN
        </button>
      </form>
    </div>
  );
}
