import { useState } from "react";
import Sharingan from "./components/Sharingan.jsx";
import { 
  signUpWithEmail, 
  loginWithEmail, 
  createUserProfile, 
  getUserProfile,
  loginWithApple 
} from "./firebase";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // NEW: To handle slow connections
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent double clicks
    
    setError("");
    setIsLoading(true);

    try {
      if (isRegistering) {
        // 1. Create User
        const user = await signUpWithEmail(email, password, username);
        
        // 2. FORCE AWAIT Database entry
        const profileData = { username, email, xp: 0 };
        await createUserProfile(user.uid, profileData);
        
        // 3. Move to App
        onLogin({ uid: user.uid, ...profileData });
      } else {
        // LOGIN PATH
        const user = await loginWithEmail(email, password);
        const profile = await getUserProfile(user.uid);
        onLogin({ uid: user.uid, ...profile });
      }
    } catch (err) {
      console.error(err);
      if (err.message.includes("unavailable")) {
        setError("LAB_CONNECTION_ERROR: Retrying...");
      } else {
        setError(err.message.replace("Firebase: ", "").replace("auth/", ""));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const ui = {
    screen: {
      height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617',
      color: '#fff', fontFamily: 'monospace', margin: 0, overflow: 'hidden'
    },
    card: { width: '100%', maxWidth: '350px', textAlign: 'center', zIndex: 10 },
    input: {
      width: '100%', padding: '14px', marginBottom: '10px', borderRadius: '8px',
      border: '1px solid #1e293b', backgroundColor: '#000', color: '#22c55e',
      outline: 'none', fontSize: '13px', boxSizing: 'border-box'
    },
    primaryBtn: {
      width: '100%', padding: '14px', borderRadius: '8px', backgroundColor: '#ef4444',
      color: '#fff', border: 'none', fontWeight: '900', fontSize: '12px',
      cursor: 'pointer', marginTop: '10px', letterSpacing: '1px'
    },
    socialBtn: (isApple) => ({
      width: '100%', padding: '12px', borderRadius: '8px',
      backgroundColor: isApple ? '#fff' : 'transparent', color: isApple ? '#000' : '#fff',
      border: isApple ? 'none' : '1px solid #1e293b', fontWeight: '700', fontSize: '12px',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '10px', marginTop: '10px'
    })
  };

  return (
    <div style={ui.screen}>
      <style>
        {`
          @keyframes sharingan-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .sh-logo {
            animation: sharingan-spin ${isTypingPassword || isLoading ? '0.5s' : '4s'} linear infinite;
          }
        `}
      </style>

      <div style={ui.card}>
        <div className="sh-logo" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <Sharingan width={80} height={80} />
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '30px', fontStyle: 'italic' }}>
          ZENIN<span style={{ color: '#ef4444' }}>LABS</span>
        </h1>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <input placeholder="USERNAME" style={ui.input} onChange={e => setUsername(e.target.value)} disabled={isLoading} />
          )}
          <input type="email" placeholder="EMAIL ADDRESS" style={ui.input} onChange={e => setEmail(e.target.value)} disabled={isLoading} />
          <input 
            type="password" placeholder="PASSWORD" style={ui.input} 
            onFocus={() => setIsTypingPassword(true)}
            onBlur={() => setIsTypingPassword(false)}
            onChange={e => setPassword(e.target.value)} 
            disabled={isLoading}
          />

          {error && <p style={{ color: '#ef4444', fontSize: '10px', marginBottom: '10px' }}>{error}</p>}

          <button type="submit" style={{...ui.primaryBtn, opacity: isLoading ? 0.5 : 1}} disabled={isLoading}>
            {isLoading ? "ESTABLISHING_LINK..." : (isRegistering ? "INITIALIZE ACCOUNT" : "LOGIN TO LAB")}
          </button>

          {!isLoading && (
            <>
              <div style={{ margin: '20px 0', fontSize: '10px', color: '#475569', fontWeight: 'bold' }}>OR</div>
              <button type="button" onClick={loginWithApple} style={ui.socialBtn(true)}>Sign in with Apple</button>
              <button type="button" style={ui.socialBtn(false)}>Sign in with Google</button>
              <p onClick={() => setIsRegistering(!isRegistering)} style={{ marginTop: '25px', fontSize: '10px', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}>
                {isRegistering ? "ALREADY A NINJA? LOGIN" : "NEW SUBJECT? REGISTER"}
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
}


