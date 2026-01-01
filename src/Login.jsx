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
      setError("Please fill in all fields.");
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

  // RAW CSS OBJECTS (This replaces Tailwind)
  const ui = {
    screen: {
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#020617', // The Deep Lab Blue
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      margin: 0,
      overflow: 'hidden'
    },
    box: {
      width: '100%',
      maxWidth: '360px',
      padding: '20px',
      textAlign: 'center',
      zIndex: 2
    },
    input: (borderColor) => ({
      width: '100%',
      padding: '14px 16px',
      marginBottom: '12px',
      borderRadius: '12px',
      border: `1px solid ${borderColor}`,
      backgroundColor: '#000000',
      color: borderColor === '#ef4444' ? '#ef4444' : '#22c55e',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'all 0.2s'
    }),
    actionBtn: {
      width: '100%',
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: '#ef4444',
      color: '#fff',
      border: 'none',
      fontWeight: '800',
      fontSize: '12px',
      cursor: 'pointer',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      marginTop: '10px'
    },
    socialBtn: (bgColor, textColor) => ({
      width: '100%',
      padding: '12px',
      borderRadius: '12px',
      backgroundColor: bgColor,
      color: textColor,
      border: bgColor === 'transparent' ? '1px solid #1e293b' : 'none',
      fontWeight: '600',
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
      {/* Visual background accents */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)', zIndex: 1 }} />
      
      <div style={ui.box}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <Sharingan width={70} height={70} />
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: '900', fontStyle: 'italic', margin: '0 0 4px 0', letterSpacing: '-1px' }}>
          ZENIN<span style={{ color: '#ef4444' }}>LABS</span>
        </h1>
        <p style={{ fontSize: '10px', color: '#475569', fontWeight: '800', letterSpacing: '3px', marginBottom: '30px' }}>AUTHENTICATE</p>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <input 
               placeholder="Username" 
               style={ui.input('#1e293b')} 
               onChange={e => setUsername(e.target.value)} 
            />
          )}
          
          <input 
            type="email" 
            placeholder="Email Address" 
            style={ui.input('#1e293b')} 
            onChange={e => setEmail(e.target.value)} 
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            style={ui.input('#1e293b')} 
            onFocus={(e) => e.target.style.borderColor = '#ef4444'}
            onBlur={(e) => e.target.style.borderColor = '#1e293b'}
            onChange={e => setPassword(e.target.value)} 
          />

          {error && <p style={{ color: '#ef4444', fontSize: '11px', margin: '10px 0' }}>{error}</p>}

          <button type="submit" style={ui.actionBtn}>
            {isRegistering ? "Create Account" : "Enter the Lab"}
          </button>

          <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <div style={{ flex: 1, height: '1px', backgroundColor: '#1e293b' }} />
             <span style={{ fontSize: '10px', color: '#475569', fontWeight: 'bold' }}>OR</span>
             <div style={{ flex: 1, height: '1px', backgroundColor: '#1e293b' }} />
          </div>

          <button type="button" style={ui.socialBtn('#ffffff', '#000000')}>
            <span style={{ fontSize: '18px' }}></span> Sign in with Apple
          </button>

          <button type="button" style={ui.socialBtn('transparent', '#ffffff')}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" width="16" />
            Sign in with Google
          </button>

          <p 
            onClick={() => setIsRegistering(!isRegistering)} 
            style={{ marginTop: '20px', fontSize: '11px', color: '#64748b', cursor: 'pointer' }}
          >
            {isRegistering ? "Return to Login" : "New Ninja? Register Here"}
          </p>
        </form>
      </div>
    </div>
  );
}


