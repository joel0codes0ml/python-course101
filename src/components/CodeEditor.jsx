import React, { useState, useEffect } from 'react';
import { updateUserProfile } from "../firebase";

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language, starterCode, expectedOutput }) => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCode(""); 
    setOutput("");
    setError("");
  }, [starterCode, language]);

  const playSuccessSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  const execute = async () => {
    const currentRuns = user?.dailyExecutions || 0;
    if (!user?.isPro && currentRuns >= 12) {
      setIsPaystackOpen(true);
      return;
    }

    setIsRunning(true);
    setOutput("SYSTEM: Initializing...");
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

      if (expectedOutput && result.trim() === expectedOutput.trim()) {
        xpBonus = 20;
        isSuccess = true;
        playSuccessSound();
      }

      setUser(prev => {
        const nextXp = (prev.xp || 0) + xpBonus;
        const nextRuns = (prev.dailyExecutions || 0) + 1;
        const today = new Date().toDateString();
        let nextStreak = prev.streak || 0;

        if (!prev.lastExecutionDate) {
          nextStreak = 1;
        } else if (prev.lastExecutionDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          nextStreak = (prev.lastExecutionDate === yesterday.toDateString()) ? nextStreak + 1 : 1;
        }

        const updatedData = { xp: nextXp, dailyExecutions: nextRuns, streak: nextStreak, lastExecutionDate: today };
        updateUserProfile(prev.uid, updatedData).catch(err => console.error("Sync Error:", err));
        return { ...prev, ...updatedData };
      });

      if (data.run.stderr) {
        setError(data.run.stderr);
      } else {
        setOutput(isSuccess ? `${result}\n\n✨ CHALLENGE COMPLETE! +20 XP` : result);
      }
    } catch (err) {
      setError("Execution failed. Check your internet.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={ui.container}>
      {/* HEADER SECTION */}
      <div style={ui.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isRunning ? '#f59e0b' : '#22c55e' }} />
          <span>{language.toUpperCase()} COMPILER</span>
        </div>
        <div style={ui.headerRight}>V.2026.1</div>
      </div>

      {/* EDITOR AREA */}
      <div style={ui.editorWrapper}>
        <div style={ui.editorLabel}>WRITE CODE HERE</div>
        <textarea 
          value={code} 
          onChange={(e) => setCode(e.target.value)} 
          placeholder={`# Enter your ${language} solution...`}
          style={ui.textarea} 
          spellCheck="false" 
        />
      </div>

      {/* ACTION BAR */}
      <div style={ui.footer}>
        <button onClick={execute} disabled={isRunning} style={ui.runBtn}>
          {isRunning ? "COMPILING..." : "RUN CODE"}
        </button>
      </div>

      {/* TERMINAL AREA */}
      <div style={ui.outputBox}>
        <div style={ui.terminalHeader}>CONSOLE</div>
        <pre style={{ ...ui.pre, color: error ? '#f87171' : '#a7f3d0' }}>
          {error || output || "Waiting for code execution..."}
        </pre>
      </div>
    </div>
  );
};

const ui = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0f172a', borderLeft: '1px solid #1e293b' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '10px 18px', backgroundColor: '#020617', color: '#64748b', fontSize: '10px', fontWeight: 'bold', borderBottom: '1px solid #1e293b', letterSpacing: '0.5px' },
  headerRight: { color: '#334155' },
  editorWrapper: { flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' },
  editorLabel: { position: 'absolute', top: '10px', right: '20px', fontSize: '9px', fontWeight: 'bold', color: '#1e293b', pointerEvents: 'none', zIndex: 1 },
  textarea: { 
    flex: 1, 
    backgroundColor: '#020617', 
    color: '#e2e8f0', 
    padding: '30px 25px', 
    border: 'none', 
    fontFamily: '"JetBrains Mono", "Fira Code", monospace', 
    outline: 'none', 
    fontSize: '14px', 
    resize: 'none', 
    lineHeight: '1.6',
    caretColor: '#22c55e'
  },
  footer: { padding: '10px 18px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#020617' },
  runBtn: { 
    backgroundColor: '#22c55e', 
    color: '#064e3b', 
    border: 'none', 
    padding: '8px 24px', 
    borderRadius: '4px', 
    fontWeight: '800', 
    cursor: 'pointer', 
    fontSize: '11px',
    boxShadow: '0 0 15px rgba(34, 197, 94, 0.2)' 
  },
  outputBox: { height: '200px', backgroundColor: '#000', padding: '18px', borderTop: '1px solid #1e293b', overflowY: 'auto' },
  terminalHeader: { fontSize: '9px', color: '#334155', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '1px' },
  pre: { margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.5' }
};

export default CodeEditor;
