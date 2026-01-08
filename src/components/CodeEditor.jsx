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

  const isOutOfRuns = !user?.isPro && (user?.dailyExecutions || 0) >= 12;

  const playIphoneChime = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  const execute = async () => {
    if (isOutOfRuns) {
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

      if (expectedOutput && result.trim() === expectedOutput.trim()) {
        xpBonus = 20;
        playIphoneChime();
      }

      const updates = { 
        xp: (user?.xp || 0) + xpBonus, 
        dailyExecutions: (user?.dailyExecutions || 0) + 1,
        lastExecutionDate: new Date().toDateString() 
      };

      setUser(prev => ({ ...prev, ...updates }));
      await updateUserProfile(user.uid, updates);

      if (data.run.stderr) {
        setError(data.run.stderr);
      } else {
        setOutput(xpBonus > 0 ? `${result}\n\n✨ SUCCESS! +20 XP` : result);
      }
    } catch (err) {
      setError("Execution failed.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={ui.container}>
      <div style={ui.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ ...ui.statusDot, backgroundColor: isRunning ? '#f59e0b' : (isOutOfRuns ? '#ef4444' : '#22c55e') }} />
          <span>{language.toUpperCase()} ENGINE V.2026.1</span>
        </div>
      </div>

      <div style={ui.editorWrapper}>
        <div style={ui.editorLabel}>CODING_ZONE</div>
        {/* THE "ATTRACTIVE" TEXTAREA */}
        <textarea 
          value={code} 
          onChange={(e) => setCode(e.target.value)} 
          placeholder={`// Type your ${language} solution...`}
          style={ui.textarea} 
          spellCheck="false" 
          disabled={isOutOfRuns}
        />
      </div>

      <div style={ui.footer}>
        {isOutOfRuns ? (
          <div style={ui.limitContainer}>
            <span style={ui.resetMsg}>RESETS TOMORROW AT MIDNIGHT</span>
            <button onClick={() => setIsPaystackOpen(true)} style={ui.proBtnLarge}>
              ⚡ GO PRO NOW
            </button>
          </div>
        ) : (
          <button onClick={execute} disabled={isRunning} style={ui.runBtn}>
            {isRunning ? "COMPILING..." : "RUN CODE"}
          </button>
        )}
      </div>

      <div style={ui.outputBox}>
        <div style={ui.terminalHeader}>CONSOLE_OUTPUT</div>
        <pre style={{ ...ui.pre, color: error ? '#f87171' : (isOutOfRuns ? '#fb923c' : '#22d3ee') }}>
          {error || output || (isOutOfRuns ? "⚠️ Daily limit reached. Resets tomorrow." : "Waiting for code execution...")}
        </pre>
      </div>
    </div>
  );
};

// PRESET STYLES (No external libraries needed)
const ui = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#020617' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '12px 20px', backgroundColor: '#000', color: '#475569', fontSize: '10px', fontWeight: 'bold', borderBottom: '1px solid #1e293b' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%', boxShadow: '0 0 10px currentColor' },
  editorWrapper: { flex: 1, position: 'relative', display: 'flex', backgroundColor: '#020617' },
  editorLabel: { position: 'absolute', top: '15px', right: '25px', fontSize: '10px', fontWeight: 'bold', color: '#1e293b', letterSpacing: '2px' },
  textarea: { 
    flex: 1, 
    backgroundColor: 'transparent', 
    color: '#e2e8f0', // Clean off-white/silver primary text
    padding: '35px 25px', 
    border: 'none', 
    fontFamily: '"Fira Code", "JetBrains Mono", monospace', 
    outline: 'none', 
    fontSize: '15px', 
    resize: 'none', 
    lineHeight: '1.8',
    caretColor: '#22d3ee', // Cyan glowing cursor
    // This creates the "Attractive" effect:
    textShadow: '0 0 1px rgba(34, 211, 238, 0.1)', 
    backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.03) 1px, transparent 1px)',
    backgroundSize: '100% 1.8em',
  },
  footer: { padding: '15px 20px', borderTop: '1px solid #1e293b', backgroundColor: '#000' },
  runBtn: { width: '100%', backgroundColor: '#22c55e', color: '#064e3b', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: '900', cursor: 'pointer', fontSize: '12px', boxShadow: '0 4px 15px rgba(34, 197, 94, 0.2)' },
  limitContainer: { display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' },
  resetMsg: { fontSize: '9px', color: '#ef4444', fontWeight: 'bold', letterSpacing: '1px' },
  proBtnLarge: { width: '100%', backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: '900', cursor: 'pointer', fontSize: '12px' },
  outputBox: { height: '180px', backgroundColor: '#000', padding: '20px', borderTop: '1px solid #1e293b', overflowY: 'auto' },
  terminalHeader: { fontSize: '9px', color: '#334155', fontWeight: 'bold', marginBottom: '10px' },
  pre: { margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }
};

export default CodeEditor;
