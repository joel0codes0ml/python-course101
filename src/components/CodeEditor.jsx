import React, { useState, useEffect } from 'react';
import { updateUserProfile } from "../firebase";

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language, starterCode, expectedOutput }) => {
  const [code, setCode] = useState(starterCode || "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  // Clear terminal and update code when lesson changes
  useEffect(() => {
    setCode(starterCode || "");
    setOutput("");
    setError("");
  }, [starterCode, language]);

  const playSuccessSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play blocked"));
  };

  const execute = async () => {
    // 1. Run limit check
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          language: language === "sqlite3" ? "sql" : language, 
          version: "*", 
          files: [{ content: code }] 
        }),
      });

      const data = await response.json();
      const result = data.run.output || "";
      
      let xpBonus = 0;
      let isSuccess = false;

      // 2. Success Check
      if (expectedOutput && result.trim() === expectedOutput.trim()) {
        xpBonus = 20;
        isSuccess = true;
        playSuccessSound();
      }

      // 3. Update Logic (Functional State Update)
      // We use (prev) to ensure we are getting the latest XP from the state
      setUser(prev => {
        const nextXp = (prev.xp || 0) + xpBonus;
        const nextRuns = (prev.dailyExecutions || 0) + 1;

        // Push to Firebase immediately using the values we just calculated
        updateUserProfile(prev.uid, { 
          xp: nextXp, 
          dailyExecutions: nextRuns 
        }).catch(err => console.error("Firebase Sync Error:", err));

        return { ...prev, xp: nextXp, dailyExecutions: nextRuns };
      });

      if (data.run.stderr) {
        setError(data.run.stderr);
      } else {
        setOutput(isSuccess ? `${result}\n\n✨ SUCCESS! +20 XP` : result);
      }
    } catch (err) {
      setError("Execution failed. Check internet.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={ui.container}>
      <div style={ui.header}>
        <span>{language.toUpperCase()} ENGINE</span>
        <span style={{color: '#22c55e', fontSize: '9px'}}>{isRunning ? "● PROCESSING" : "● READY"}</span>
      </div>
      <textarea 
        value={code} 
        onChange={(e) => setCode(e.target.value)} 
        style={ui.textarea} 
        spellCheck="false" 
      />
      <div style={ui.footer}>
        <button onClick={execute} disabled={isRunning} style={ui.runBtn}>
          {isRunning ? "RUNNING..." : "RUN CODE"}
        </button>
      </div>
      <div style={ui.outputBox}>
        <div style={{fontSize: '9px', color: '#475569', marginBottom: '8px', fontWeight: 'bold'}}>TERMINAL OUTPUT</div>
        <pre style={{ color: error ? '#ef4444' : '#22c55e', margin: 0, whiteSpace: 'pre-wrap' }}>
          {error || output || "Awaiting execution..."}
        </pre>
      </div>
    </div>
  );
};

const ui = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#000' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '12px 20px', backgroundColor: '#020617', color: '#475569', fontSize: '11px', fontWeight: 'bold', borderBottom: '1px solid #1e293b' },
  textarea: { flex: 1, backgroundColor: '#000', color: '#fff', padding: '25px', border: 'none', fontFamily: '"Fira Code", monospace', outline: 'none', fontSize: '14px', resize: 'none', lineHeight: '1.6' },
  footer: { padding: '12px 20px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#020617' },
  runBtn: { backgroundColor: '#22c55e', color: '#000', border: 'none', padding: '10px 35px', borderRadius: '4px', fontWeight: '900', cursor: 'pointer', transition: '0.2s' },
  outputBox: { height: '180px', backgroundColor: '#000', padding: '20px', overflowY: 'auto', borderTop: '1px solid #1e293b', fontFamily: 'monospace', fontSize: '13px' }
};

export default CodeEditor;

