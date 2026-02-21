import { useState } from "react";
import Sharingan from "./components/Sharingan.jsx";
import { signUpWithEmail, loginWithEmail, createUserProfile, getUserProfile, loginWithApple } from "./firebase";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setError("");
    setIsLoading(true);

    try {
      if (isRegistering) {
        const user = await signUpWithEmail(email, password, username);
        // ADDED setupComplete: false to trigger onboarding gate
        const profile = { 
          username, 
          email, 
          xp: 0, 
          dailyExecutions: 0, 
          isPro: false,
          setupComplete: false 
        };
        onLogin({ uid: user.uid, ...profile });
        createUserProfile(user.uid, profile).catch(e => console.error(e));
      } else {
        const user = await loginWithEmail(email, password);
        const profilePromise = getUserProfile(user.uid);
        const timeout = new Promise((_, r) => setTimeout(() => r("timeout"), 2000));
        
        try {
          const profile = await Promise.race([profilePromise, timeout]);
          onLogin({ uid: user.uid, ...profile });
        } catch {
          onLogin({ uid: user.uid, username: "NEW_USER", xp: 0, dailyExecutions: 0 });
        }
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message.replace("Firebase: ", "").replace("auth/", ""));
    }
  };

  return (
    <div style={ui.screen}>
      <div style={ui.card}>
        <div style={ui.headerSection}>
          <div style={{ 
            animation: `spin ${isLoading ? '1s' : '5s'} linear infinite`,
            display: 'inline-block' 
          }}>
            <Sharingan width={80} height={80} />
          </div>
          <h1 style={ui.logoText}>
            ZENIN<span style={{ color: '#ef4444' }}>LABS</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} style={ui.form}>
          {isRegistering && (
            <input 
              placeholder="USERNAME" 
              style={ui.input} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          )}
          <input 
            type="email" 
            placeholder="EMAIL ADDRESS" 
            style={ui.input} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="PASSWORD" 
            style={ui.input} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          
          {error && <p style={ui.errorText}>{error}</p>}
          
          <button type="submit" style={ui.primaryBtn} disabled={isLoading}>
            {isLoading ? "SYNCING..." : (isRegistering ? "CREATE ACCOUNT" : "ENTER LAB")}
          </button>
          
          <div style={ui.divider}>OR</div>
          
          <button type="button" onClick={loginWithApple} style={ui.appleBtn}>
            Sign in with Apple
          </button>
          
          <p onClick={() => { setIsRegistering(!isRegistering); setError(""); }} style={ui.toggleText}>
            {/* UPDATED: Changed "NEW SUBJECT" to "NEW USER" */}
            {isRegistering ? "BACK TO LOGIN" : "NEW USER? REGISTER"}
          </p>
        </form>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ... Styles (ui object) stay exactly as you had them ...
const ui = {
  screen: { height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#fff', fontFamily: 'monospace', overflow: 'hidden' },
  card: { width: '100%', maxWidth: '320px', textAlign: 'center', padding: '20px' },
  headerSection: { marginBottom: '40px' },
  logoText: { fontSize: '28px', fontStyle: 'italic', marginTop: '15px', fontWeight: '900', letterSpacing: '-1px' },
  form: { display: 'flex', flexDirection: 'column' },
  input: { width: '100%', padding: '14px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#000', color: '#22c55e', outline: 'none', boxSizing: 'border-box' },
  primaryBtn: { width: '100%', padding: '14px', borderRadius: '8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', fontWeight: '900', cursor: 'pointer', marginTop: '10px' },
  appleBtn: { width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#fff', color: '#000', border: 'none', fontWeight: '700', cursor: 'pointer' },
  divider: { margin: '20px 0', fontSize: '10px', color: '#475569', fontWeight: 'bold' },
  errorText: { color: '#ef4444', fontSize: '11px', fontWeight: 'bold', marginBottom: '10px' },
  toggleText: { marginTop: '25px', fontSize: '11px', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }
};
