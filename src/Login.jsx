import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [name, setName] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0f172a", color: "#fff" }}>
      <h1>Login to ZeninLabs</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: "10px", borderRadius: "5px", marginBottom: "10px", border: "1px solid #334155" }}
      />
      <button onClick={() => onLogin(name)} style={{ padding: "10px 20px", borderRadius: "5px", background: "#ef4444", color: "#fff", border: "none", cursor: "pointer" }}>
        Login
      </button>
    </div>
  );
}

