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
        const profile = { username, email, xp: 0, dailyExecutions: 0, isPro: false };
        onLogin({ uid: user.uid, ...profile });
        createUserProfile(user.uid, profile).catch(e => console.error(e));
      } else {
        const user = await loginWithEmail(email, password);
        // Race strategy: 2 second timeout for slow Firestore
        const profilePromise = getUserProfile(user.uid);
        const timeout = new Promise((_, r) => setTimeout(() => r("timeout"), 2000));
        
        try {
          const profile = await Promise.race([profilePromise, timeout]);
          onLogin({ uid: user.uid, ...profile });
        } catch {
          onLogin({ uid: user.uid, username: "NINJA", xp: 0, dailyExecutions: 0 });
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
        <div style={{ animation: `spin ${isLoading ? '1s' : '5s'} linear infinite`, marginBottom: '20px' }}>
          <Sharingan width={80} height={80} />
        </div>
        <h1 style={{ fontSize: '28px', fontStyle: 'italic', marginBottom: '30px' }}>ZENIN<span style={{ color: '#ef4444' }}>LABS</span></h1>
        
        <form onSubmit={handleSubmit}>
          {isRegistering && <input placeholder="USERNAME" style={ui.input} onChange={e => setUsername(e.target.value)} required />}
          <input type="email" placeholder="EMAIL ADDRESS" style={ui.input} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="PASSWORD" style={ui.input} onChange={e => setPassword(e.target.value)} required />
          {error && <p style={{ color: '#ef4444', fontSize: '11px', fontWeight: 'bold' }}>{error}</p>}
          <button style={ui.primaryBtn}>{isLoading ? "SYNCING..." : (isRegistering ? "CREATE ACCOUNT" : "ENTER LAB")}</button>
          
          <div style={{ margin: '20px 0', fontSize: '10px', color: '#475569' }}>OR</div>
          <button type="button" onClick={loginWithApple} style={ui.appleBtn}>Sign in with Apple</button>
          <p onClick={() => setIsRegistering(!isRegistering)} style={ui.toggleText}>
            {isRegistering ? "BACK TO LOGIN" : "NEW SUBJECT? REGISTER"}
          </p>
        </form>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const ui = {
  screen: { height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#fff', fontFamily: 'monospace' },
  card: { width: '100%', maxWidth: '320px', textAlign: 'center' },
  input: { width: '100%', padding: '14px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#000', color: '#22c55e', outline: 'none' },
  primaryBtn: { width: '100%', padding: '14px', borderRadius: '8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', fontWeight: '900', cursor: 'pointer' },
  appleBtn: { width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#fff', color: '#000', border: 'none', fontWeight: '700', cursor: 'pointer' },
  toggleText: { marginTop: '25px', fontSize: '11px', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }
};


