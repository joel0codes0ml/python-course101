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
  }, [starterCode, language]);

  // CODDY-STYLE SYNTAX HIGHLIGHTING
  const highlightCode = (input) => {
    if (!input) return "";
    return input
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\b(def|return|if|else|for|while|import|from|class|try|except|let|const|var|function)\b/g, '<span style="color: #ff79c6;">$1</span>')
      .replace(/\b(print|console|log|len|range|str|int|float|bool|input)\b/g, '<span style="color: #50fa7b;">$1</span>')
      .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span style="color: #f1fa8c;">$&</span>')
      .replace(/\b(True|False|None|true|false|null)\b/g, '<span style="color: #bd93f9;">$1</span>')
      .replace(/\b\d+\b/g, '<span style="color: #bd93f9;">$&</span>')
      .replace(/#.*$/gm, '<span style="color: #6272a4;">$&</span>');
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

    // Map language for engine
    const langMap = { 'sqlite3': 'sql', 'python': 'python', 'c': 'c', 'cpp': 'cpp', 'go': 'go' };
    const engineLang = langMap[language] || language;

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: engineLang,
          version: "*",
          files: [{ content: code }],
        }),
      });

      const data = await response.json();
      const run = data.run;
      const nextRuns = currentRuns + 1;

      // 1. INSTANT LOCAL UPDATE
      setUser(prev => ({ ...prev, dailyExecutions: nextRuns }));

      // 2. BACKGROUND FIREBASE SYNC (Fast!)
      updateUserProfile(user.uid, { dailyExecutions: nextRuns }).catch(e => console.error(e));

      // 3. LOGIC CHECK FLOW
      if (run.stderr) {
        // SCENARIO: Logic/Syntax Error
        setError(run.stderr);
        setOutput("");
      } else {
        const userResult = run.output.trim();
        const goal = expectedOutput ? expectedOutput.trim() : "";

        if (goal && userResult === goal) {
          // SCENARIO: Success Match
          setOutput(`✅ SUCCESS! +20 XP\n\n${userResult}`);
          
          // Bonus XP Sync
          const newXP = (user?.xp || 0) + 20;
          setUser(prev => ({ ...prev, xp: newXP }));
          updateUserProfile(user.uid, { xp: newXP });
        } else {
          // SCENARIO: Valid code, but doesn't match goal
          setOutput(userResult || "Program executed successfully (no output).");
        }
      }
    } catch (err) {
      setError("❌ Engine Connection Failed.");
    } finally {
      setIsRunning(false);
    }
  };

  const isLimitHit = !user?.isPro && (user?.dailyExecutions || 0) >= 12;

  return (
    <div style={editorStyles.container}>
      <div style={editorStyles.editorArea}>
        {/* Background Highlight Layer */}
        <div 
          style={editorStyles.highlighter} 
          dangerouslySetInnerHTML={{ __html: highlightCode(code) + "\n" }} 
        />
        {/* Transparent Interactive Layer */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onScroll={(e) => {
             const h = e.target.parentElement.firstChild;
             h.scrollTop = e.target.scrollTop;
          }}
          style={editorStyles.textarea}
          spellCheck="false"
        />
      </div>
      
      <div style={editorStyles.footer}>
        <button 
          onClick={isLimitHit ? () => setIsPaystackOpen(true) : execute} 
          disabled={isRunning}
          style={isLimitHit ? editorStyles.upgradeBtn : editorStyles.runBtn}
        >
          {isRunning ? "RUNNING..." : isLimitHit ? "🚀 UNLOCK PRO" : "RUN CODE"}
        </button>
      </div>

      <div style={editorStyles.outputBox}>
        <div style={{fontSize: '9px', color: '#475569', fontWeight: 'bold', marginBottom: '8px'}}>DASHBOARD_CONSOLE</div>
        {error ? (
          <pre style={{color: '#f87171', whiteSpace: 'pre-wrap', margin: 0}}>⚠️ ERROR:{"\n"}{error}</pre>
        ) : (
          <pre style={{whiteSpace: 'pre-wrap', color: '#22d3ee', margin: 0}}>{output}</pre>
        )}
      </div>
    </div>
  );
};

const editorStyles = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#000' },
  editorArea: { flex: 1, position: 'relative', overflow: 'hidden' },
  highlighter: { 
    position: 'absolute', inset: 0, padding: '20px', color: '#f8f8f2', 
    fontFamily: 'monospace', fontSize: '14px', whiteSpace: 'pre-wrap', 
    pointerEvents: 'none', lineHeight: '1.5' 
  },
  textarea: { 
    width: '100%', height: '100%', backgroundColor: 'transparent', color: 'transparent', 
    padding: '20px', border: 'none', fontFamily: 'monospace', resize: 'none', 
    outline: 'none', fontSize: '14px', lineHeight: '1.5', caretColor: '#fff', 
    position: 'relative', zIndex: 1 
  },
  footer: { padding: '10px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#000' },
  runBtn: { backgroundColor: '#22c55e', color: '#000', border: 'none', padding: '8px 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  upgradeBtn: { backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '8px 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  outputBox: { height: '150px', backgroundColor: '#020617', borderTop: '2px solid #1e293b', padding: '15px', overflowY: 'auto', fontFamily: 'monospace' }
};

export default CodeEditor;
