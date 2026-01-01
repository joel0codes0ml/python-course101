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
      setError("Incomplete data. Access denied.");
      return;
    }

    const userData = {
      uid: "ninja_" + Math.random().toString(36).substr(2, 9),
      username: username || email.split('@')[0],
      email: email,
      xp: 0
    };

    localStorage.setItem("zn_user", JSON.stringify(userData));
    onLogin(userData);
  };

  const ui = {
    screen: {
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#020617', 
      color: '#fff',
      fontFamily: 'monospace',
      margin: 0,
      overflow: 'hidden'
    },
    card: {
      width: '100%',
      maxWidth: '350px',
      textAlign: 'center',
      zIndex: 10
    },
    input: {
      width: '100%',
      padding: '14px',
      marginBottom: '10px',
      borderRadius: '8px',
      border: '1px solid #1e293b',
      backgroundColor: '#000',
      color: '#22c55e',
      outline: 'none',
      fontSize: '13px',
      boxSizing: 'border-box'
    },
    primaryBtn: {
      width: '100%',
      padding: '14px',
      borderRadius: '8px',
      backgroundColor: '#ef4444', 
      color: '#fff',
      border: 'none',
      fontWeight: '900',
      fontSize: '12px',
      cursor: 'pointer',
      marginTop: '10px',
      letterSpacing: '1px'
    },
    socialBtn: (isApple) => ({
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      backgroundColor: isApple ? '#fff' : 'transparent',
      color: isApple ? '#000' : '#fff',
      border: isApple ? 'none' : '1px solid #1e293b',
      fontWeight: '700',
      fontSize: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '10px'
    })
  };

  return (
    <div style={ui.screen}>
      <div style={ui.card}>
        
        {/* SHARINGAN LOGO */}
        <div style={{ marginBottom: '20px' }}>
          <Sharingan width={70} height={70} />
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '30px', fontStyle: 'italic' }}>
          ZENIN<span style={{ color: '#ef4444' }}>LABS</span>
        </h1>

        <form onSubmit={handleSubmit}>
          {/* USERNAME */}
          {isRegistering && (
            <input 
              placeholder="USERNAME" 
              style={ui.input} 
              onChange={e => setUsername(e.target.value)} 
            />
          )}

          {/* EMAIL */}
          <input 
            type="email" 
            placeholder="EMAIL ADDRESS" 
            style={ui.input} 
            onChange={e => setEmail(e.target.value)} 
          />

          {/* PASSWORD */}
          <input 
            type="password" 
            placeholder="PASSWORD" 
            style={ui.input} 
            onChange={e => setPassword(e.target.value)} 
          />

          {error && <p style={{ color: '#ef4444', fontSize: '10px', marginBottom: '10px' }}>{error}</p>}

          <button type="submit" style={ui.primaryBtn}>
            {isRegistering ? "INITIALIZE ACCOUNT" : "AUTHENTICATE"}
          </button>

          <div style={{ margin: '20px 0', fontSize: '10px', color: '#475569', fontWeight: 'bold' }}>OR</div>

          {/* APPLE */}
          <button type="button" style={ui.socialBtn(true)}>
            <span style={{ fontSize: '16px' }}></span> Sign in with Apple
          </button>

          {/* GOOGLE */}
          <button type="button" style={ui.socialBtn(false)}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" width="14" alt="Google" />
            Sign in with Google
          </button>

          <p 
            onClick={() => setIsRegistering(!isRegistering)} 
            style={{ marginTop: '25px', fontSize: '10px', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isRegistering ? "ALREADY REGISTERED? LOGIN" : "NEW SUBJECT? REGISTER"}
          </p>
        </form>
      </div>
    </div>
  );
}


