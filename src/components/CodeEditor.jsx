import React, { useState, useEffect } from 'react';
import { updateUserProfile } from "../firebase";

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language, starterCode, expectedOutput }) => {
  const [code, setCode] = useState(starterCode || "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCode(starterCode || "");
    setOutput("");
    setError("");
  }, [starterCode]);

  const playSuccessSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3'); 
    audio.play().catch(() => {}); 
  };

  const execute = async () => {
    const currentRuns = user?.dailyExecutions || 0;
    if (!user?.isPro && currentRuns >= 12) {
      setIsPaystackOpen(true);
      return; 
    }

    setIsRunning(true);
    setOutput("SYSTEM: Executing...");
    setError("");

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        body: JSON.stringify({ language: language, version: "*", files: [{ content: code }] }),
      });

      const data = await response.json();
      const result = data.run.output || "";
      
      let xpBonus = 0;
      let solved = false;

      // SUCCESS CHECK (20 XP REWARD)
      if (expectedOutput && result.trim() === expectedOutput.trim()) {
        xpBonus = 20;
        solved = true;
        playSuccessSound();
      }

      // INSTANT UI UPDATE
      const nextRuns = currentRuns + 1;
      const nextXp = (user?.xp || 0) + xpBonus;
      setUser(prev => ({ ...prev, dailyExecutions: nextRuns, xp: nextXp }));

      // BACKGROUND SYNC
      updateUserProfile(user.uid, { dailyExecutions: nextRuns, xp: nextXp }).catch(e => console.error(e));

      if (data.run.stderr) {
        setError(data.run.stderr);
      } else {
        setOutput(solved ? `${result}\n\n✅ CHALLENGE PASSED! +20 XP` : result);
      }
    } catch (err) {
      setError("Execution failed.");
    } finally { setIsRunning(false); }
  };

  const isLimitHit = !user?.isPro && (user?.dailyExecutions || 0) >= 12;

  return (
    <div style={editorStyles.container}>
      <div style={editorStyles.header}>
        <span style={editorStyles.langLabel}>{language.toUpperCase()} EDITOR</span>
      </div>
      <textarea value={code} onChange={(e) => setCode(e.target.value)} style={editorStyles.textarea} spellCheck="false" />
      <div style={editorStyles.footer}>
        <button onClick={isLimitHit ? () => setIsPaystackOpen(true) : execute} disabled={isRunning} style={isLimitHit ? editorStyles.upgradeBtn : editorStyles.runBtn}>
          {isRunning ? "..." : isLimitHit ? "🚀 UNLOCK PRO" : "RUN CODE"}
        </button>
      </div>
      <div style={editorStyles.outputBox}>
        <div style={{fontSize: '10px', color: '#475569', marginBottom: '5px'}}>TERMINAL</div>
        <pre style={{color: error ? '#ef4444' : '#cbd5e1', whiteSpace: 'pre-wrap'}}>{error || output}</pre>
      </div>
    </div>
  );
};

const editorStyles = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#000' },
  header: { padding: '8px 15px', backgroundColor: '#020617', borderBottom: '1px solid #1e293b' },
  langLabel: { fontSize: '10px', color: '#22c55e', fontWeight: 'bold' },
  textarea: { flex: 1, backgroundColor: '#000', color: '#22c55e', padding: '20px', border: 'none', fontFamily: 'monospace', outline: 'none', fontSize: '14px', lineHeight: '1.5', resize: 'none' },
  footer: { padding: '10px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'flex-end' },
  runBtn: { backgroundColor: '#22c55e', color: '#000', border: 'none', padding: '8px 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  upgradeBtn: { backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '8px 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  outputBox: { height: '160px', backgroundColor: '#020617', padding: '15px', overflowY: 'auto', borderTop: '1px solid #1e293b', fontFamily: 'monospace', fontSize: '12px' }
};

export default CodeEditor;

