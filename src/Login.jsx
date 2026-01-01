import { useState } from "react";
import Sharingan from "./components/Sharingan.jsx";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || (isRegistering && !username)) {
      setError("Field requirements not met.");
      return;
    }

    const userData = {
      uid: "user_" + Math.random().toString(36).substr(2, 9),
      username: username || email.split('@')[0],
      email: email,
      xp: 0
    };

    localStorage.setItem("zn_user", JSON.stringify(userData));
    onLogin(userData);
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#fff', fontFamily: 'sans-serif', margin: 0, overflow: 'hidden' }}>
      
      {/* BACKGROUND DECOR (Subtle Glows) */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'rgba(239, 68, 68, 0.05)', filter: 'blur(100px)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'rgba(34, 197, 94, 0.05)', filter: 'blur(100px)', borderRadius: '50%' }} />

      <div style={{ width: '100%', maxWidth: '380px', textAlign: 'center', zIndex: 10 }}>
        
        {/* 1. SHARINGAN LOGO */}
        <div style={{ marginBottom: '24px' }}>
          <Sharingan width={80} height={80} />
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: '900', fontStyle: 'italic', marginBottom: '32px', letterSpacing: '-1px' }}>
          ZENIN<span style={{ color: '#ef4444' }}>LABS</span>
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* 2. USERNAME (Only for Register) */}
          {isRegistering && (
            <input 
              type="text" placeholder="Username" 
              style={{ padding: '16px', borderRadius: '12px', border: '1px solid #1e293b', backgroundColor: '#000', color: '#22c55e', outline: 'none', fontSize: '14px' }}
              onChange={e => setUsername(e.target.value)}
            />
          )}

          {/* 3. EMAIL */}
          <input 
            type="email" placeholder="Email Address" 
            style={{ padding: '16px', borderRadius: '12px', border: '1px solid #1e293b', backgroundColor: '#000', color: '#22c55e', outline: 'none', fontSize: '14px' }}
            onChange={e => setEmail(e.target.value)}
          />

          {/* 4. PASSWORD */}
          <input 
            type="password" placeholder="Password" 
            style={{ padding: '16px', borderRadius: '12px', border: '1px solid #1e293b', backgroundColor: '#000', color: '#ef4444', outline: 'none', fontSize: '14px' }}
            onChange={e => setPassword(e.target.value)}
          />

          {error && <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>{error}</p>}

          <button type="submit" style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#22c55e', color: '#000', border: 'none', fontWeight: '900', fontSize: '12px', cursor: 'pointer', marginTop: '12px', letterSpacing: '1px' }}>
            {isRegistering ? "CREATE ACCOUNT" : "LOGIN"}
          </button>

          <div style={{ margin: '16px 0', fontSize: '10px', color: '#475569', fontWeight: 'bold' }}>OR CONTINUE WITH</div>

          {/* 5. APPLE LOGIN */}
          <button type="button" style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#fff', color: '#000', border: 'none', fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
             Sign in with Apple
          </button>

          {/* 6. GOOGLE LOGIN */}
          <button type="button" style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'transparent', color: '#fff', border: '1px solid #1e293b', fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" width="16" alt="Google" />
            Sign in with Google
          </button>

          <button 
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}
          >
            {isRegistering ? "ALREADY HAVE AN ACCOUNT? LOG IN" : "NEW NINJA? REGISTER HERE"}
          </button>
        </form>
      </div>
    </div>
  );
}


