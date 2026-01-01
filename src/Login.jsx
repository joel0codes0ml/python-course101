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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; 
    
    setError("");
    setIsLoading(true);

    try {
      if (isRegistering) {
        // 1. Create Auth Account (Fastest part)
        const user = await signUpWithEmail(email, password, username);
        const profileData = { username, email, xp: 0 };
        
        // 2. IMMEDIATE REDIRECT: Move user to the site now
        onLogin({ uid: user.uid, ...profileData });

        // 3. BACKGROUND SYNC: Save to Firestore without 'await'
        // This prevents the user from hanging if the DB is slow
        createUserProfile(user.uid, profileData).catch(err => {
          console.error("Delayed Profile Sync:", err);
        });

      } else {
        // LOGIN PATH
        const user = await loginWithEmail(email, password);
        
        // Fetch profile but provide a fallback so it doesn't hang
        try {
          const profile = await getUserProfile(user.uid);
          onLogin({ uid: user.uid, ...profile });
        } catch (dbErr) {
          // If DB is slow/fails, still let them in with basic info
          onLogin({ uid: user.uid, username: "User", xp: 0 });
        }
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false); // Only stop loading if we actually fail
      if (err.message.includes("unavailable")) {
        setError("LAB_CONNECTION_ERROR: Check your internet.");
      } else {
        setError(err.message.replace("Firebase: ", "").replace("auth/", ""));
      }
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
            <input 
              placeholder="USERNAME" 
              style={ui.input} 
              onChange={e => setUsername(e.target.value)} 
              disabled={isLoading} 
              required
            />
          )}
          <input 
            type="email" 
            placeholder="EMAIL ADDRESS" 
            style={ui.input} 
            onChange={e => setEmail(e.target.value)} 
            disabled={isLoading} 
            required
          />
          <input 
            type="password" 
            placeholder="PASSWORD" 
            style={ui.input} 
            onFocus={() => setIsTypingPassword(true)}
            onBlur={() => setIsTypingPassword(false)}
            onChange={e => setPassword(e.target.value)} 
            disabled={isLoading}
            required
          />

          {error && <p style={{ color: '#ef4444', fontSize: '11px', marginBottom: '10px', fontWeight: 'bold' }}>{error}</p>}

          <button type="submit" style={{...ui.primaryBtn, opacity: isLoading ? 0.5 : 1}} disabled={isLoading}>
            {isLoading ? "SYNCING_BIOMETRICS..." : (isRegistering ? "CREATE ACCOUNT" : "ENTER LAB")}
          </button>

          {!isLoading && (
            <>
              <div style={{ margin: '20px 0', fontSize: '10px', color: '#475569', fontWeight: 'bold' }}>OR</div>
              <button type="button" onClick={loginWithApple} style={ui.socialBtn(true)}>Sign in with Apple</button>
              <button type="button" style={ui.socialBtn(false)}>Sign in with Google</button>
              <p 
                onClick={() => { setIsRegistering(!isRegistering); setError(""); }} 
                style={{ marginTop: '25px', fontSize: '11px', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {isRegistering ? "BACK TO LOGIN" : "NEW SUBJECT? REGISTER"}
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
}


