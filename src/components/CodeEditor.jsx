import React, { useState, useEffect } from 'react';
import { updateUserProfile } from "../firebase";

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language, starterCode, expectedOutput }) => {
  const [code, setCode] = useState(starterCode || "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  // FIX: Clear terminal when lesson changes
  useEffect(() => {
    setCode(starterCode || "");
    setOutput("");
    setError("");
  }, [starterCode]);

  const playSuccessSound = () => {
    // High-quality Apple-style success chime
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play blocked by browser"));
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
        body: JSON.stringify({ language, version: "*", files: [{ content: code }] }),
      });

      const data = await response.json();
      const result = data.run.output || "";
      
      let xpBonus = 0;
      let isSuccess = false;

      // SUCCESS CHECK
      if (expectedOutput && result.trim() === expectedOutput.trim()) {
        xpBonus = 20;
        isSuccess = true;
        playSuccessSound();
      }

      const nextXp = (user.xp || 0) + xpBonus;
      const nextRuns = currentRuns + 1;

      // UPDATE UI AND FIREBASE
      setUser(prev => ({ ...prev, xp: nextXp, dailyExecutions: nextRuns }));
      updateUserProfile(user.uid, { xp: nextXp, dailyExecutions: nextRuns });

      if (data.run.stderr) {
        setError(data.run.stderr);
      } else {
        setOutput(isSuccess ? `${result}\n\n✨ SUCCESS! +20 XP` : result);
      }
    } catch (err) {
      setError("Execution failed.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={ui.container}>
      <div style={ui.header}>{language.toUpperCase()} ENGINE</div>
      <textarea value={code} onChange={(e) => setCode(e.target.value)} style={ui.textarea} spellCheck="false" />
      <div style={ui.footer}>
        <button onClick={execute} disabled={isRunning} style={ui.runBtn}>
          {isRunning ? "RUNNING..." : "RUN CODE"}
        </button>
      </div>
      <div style={ui.outputBox}>
        <pre style={{ color: error ? '#ef4444' : '#22c55e', margin: 0 }}>{error || output || "Terminal ready..."}</pre>
      </div>
    </div>
  );
};

const ui = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#000' },
  header: { padding: '10px 20px', backgroundColor: '#020617', color: '#475569', fontSize: '11px', fontWeight: 'bold', borderBottom: '1px solid #1e293b' },
  textarea: { flex: 1, backgroundColor: '#000', color: '#fff', padding: '20px', border: 'none', fontFamily: 'monospace', outline: 'none', fontSize: '14px', resize: 'none' },
  footer: { padding: '10px 20px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'flex-end' },
  runBtn: { backgroundColor: '#22c55e', color: '#000', border: 'none', padding: '10px 30px', borderRadius: '4px', fontWeight: '900', cursor: 'pointer' },
  outputBox: { height: '150px', backgroundColor: '#020617', padding: '20px', overflowY: 'auto', borderTop: '1px solid #1e293b', fontFamily: 'monospace', fontSize: '13px' }
};

export default CodeEditor;

