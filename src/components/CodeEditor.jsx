import React, { useState, useEffect } from 'react';
import { updateUserProfile } from "../firebase";

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language, starterCode, expectedOutput }) => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  // Reset editor for every new lesson
  useEffect(() => {
    setCode(""); 
    setOutput("");
    setError("");
  }, [starterCode, language]);

  const playIphoneChime = () => {
    // Official high-quality iPhone success/notification ping
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => console.log("Sound muted: Interact with UI first"));
  };

  const execute = async () => {
    // 1. Pro Limit Check
    if (!user?.isPro && (user?.dailyExecutions || 0) >= 12) {
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

      // 2. Success Validation (Matches Expected Output)
      if (expectedOutput && result.trim() === expectedOutput.trim()) {
        xpBonus = 20;
        isSuccess = true;
        playIphoneChime(); // Play the "Ding!"
      }

      // 3. Instant XP & Streak Sync
      const today = new Date().toDateString();
      const nextXp = (user?.xp || 0) + xpBonus;
      const nextRuns = (user?.dailyExecutions || 0) + 1;
      
      let nextStreak = user?.streak || 0;
      if (!user?.lastExecutionDate) {
        nextStreak = 1;
      } else if (user.lastExecutionDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        nextStreak = (user.lastExecutionDate === yesterday.toDateString()) ? nextStreak + 1 : 1;
      }

      const updates = { 
        xp: nextXp, 
        dailyExecutions: nextRuns, 
        streak: nextStreak, 
        lastExecutionDate: today 
      };

      // 4. Force state and DB to sync immediately
      setUser(prev => ({ ...prev, ...updates }));
      await updateUserProfile(user.uid, updates);

      if (data.run.stderr) {
        setError(data.run.stderr);
      } else {
        setOutput(isSuccess ? `${result}\n\n✨ SUCCESS! +20 XP earned.` : result);
      }
    } catch (err) {
      setError("Execution failed. Check internet.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={ui.container}>
      {/* HEADER */}
      <div style={ui.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ ...ui.statusDot, backgroundColor: isRunning ? '#f59e0b' : '#22c55e' }} />
          <span>{language.toUpperCase()} COMPILER</span>
        </div>
        <div style={{ color: '#334155', fontSize: '9px' }}>STREAK: {user?.streak || 0} 🔥</div>
      </div>

      {/* COLORFUL EDITOR */}
      <div style={ui.editorWrapper}>
        <div style={ui.editorLabel}>WRITE CODE HERE</div>
        <textarea 
          value={code} 
          onChange={(e) => setCode(e.target.value)} 
          placeholder={`// Solution goes here...`}
          style={ui.textarea} 
          spellCheck="false" 
        />
      </div>

      {/* FOOTER */}
      <div style={ui.footer}>
        <button onClick={execute} disabled={isRunning} style={ui.runBtn}>
          {isRunning ? "COMPILING..." : "RUN CODE"}
        </button>
      </div>

      {/* TERMINAL */}
      <div style={ui.outputBox}>
        <div style={ui.terminalHeader}>CONSOLE</div>
        <pre style={{ ...ui.pre, color: error ? '#f87171' : '#a7f3d0' }}>
          {error || output || "Terminal ready for output..."}
        </pre>
      </div>
    </div>
  );
};

// CODDY TECH STYLES
const ui = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#020617' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '12px 20px', backgroundColor: '#000', color: '#64748b', fontSize: '10px', fontWeight: 'bold', borderBottom: '1px solid #1e293b' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%', boxShadow: '0 0 10px currentColor' },
  editorWrapper: { flex: 1, position: 'relative', display: 'flex', backgroundColor: '#020617' },
  editorLabel: { position: 'absolute', top: '15px', right: '25px', fontSize: '10px', fontWeight: '900', color: '#1e293b', zIndex: 1, letterSpacing: '1px' },
  textarea: { 
    flex: 1, 
    backgroundColor: 'transparent', 
    // CoddyTech Colorful Vibes:
    color: '#38bdf8', // Neon Blue for main text
    padding: '35px 25px', 
    border: 'none', 
    fontFamily: '"JetBrains Mono", "Fira Code", monospace', 
    outline: 'none', 
    fontSize: '15px', 
    resize: 'none', 
    lineHeight: '1.8',
    caretColor: '#facc15', // Yellow glowing cursor
    textShadow: '0 0 2px rgba(56, 189, 248, 0.2)',
  },
  footer: { padding: '12px 20px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#000' },
  runBtn: { 
    backgroundColor: '#22c55e', 
    color: '#064e3b', 
    border: 'none', 
    padding: '10px 35px', 
    borderRadius: '8px', 
    fontWeight: '900', 
    cursor: 'pointer', 
    fontSize: '12px',
    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
    transition: '0.2s'
  },
  outputBox: { height: '180px', backgroundColor: '#000', padding: '20px', borderTop: '1px solid #1e293b', overflowY: 'auto' },
  terminalHeader: { fontSize: '9px', color: '#334155', fontWeight: 'bold', marginBottom: '10px' },
  pre: { margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }
};

export default CodeEditor;
