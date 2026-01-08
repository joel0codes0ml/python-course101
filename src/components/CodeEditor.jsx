import React, { useState, useEffect } from 'react';
import { updateUserProfile } from "../firebase";

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language, starterCode, expectedOutput }) => {
  // code state starts with starterCode, but useEffect will handle updates
  const [code, setCode] = useState(starterCode || "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  // FIX: This triggers every time you click a new lesson in the sidebar
  useEffect(() => {
    setCode(starterCode || "");
    setOutput("");
    setError("");
  }, [starterCode]);

  const execute = async () => {
    const currentRuns = user?.dailyExecutions || 0;
    
    if (!user?.isPro && currentRuns >= 12) {
      setError("⛔ LIMIT REACHED: 12/12 runs used.");
      setIsPaystackOpen(true);
      return; 
    }

    setIsRunning(true);
    setOutput("SYSTEM: Executing...");
    setError("");

    // SPECIAL HANDLING FOR WEB (HTML/CSS)
    if (language === 'html' || language === 'css') {
      setTimeout(() => {
        setIsRunning(false);
        setOutput("WEB_PREVIEW_RENDERED: Look at the preview window.");
        // Logic for a preview iframe would go here
      }, 500);
      return;
    }

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        body: JSON.stringify({
          language: language,
          version: "*",
          files: [{ content: code }],
        }),
      });

      const data = await response.json();
      const nextRuns = currentRuns + 1;

      // INSTANT UI UPDATE
      setUser(prev => ({ ...prev, dailyExecutions: nextRuns }));

      // BACKGROUND SYNC (Fast!)
      updateUserProfile(user.uid, { dailyExecutions: nextRuns }).catch(e => console.error(e));

      if (data.run.stderr) {
        setError(data.run.stderr);
      } else {
        const result = data.run.output || "Done (no output).";
        setOutput(result);
        
        // CODDY-STYLE VALIDATION
        if (expectedOutput && result.trim() === expectedOutput.trim()) {
           setOutput(prev => prev + "\n\n✅ CHALLENGE COMPLETE! +10 XP");
           // You can add logic here to update user XP in Firebase too!
        }
      }
    } catch (err) {
      setError("Execution failed. Check connection.");
    } finally {
      setIsRunning(false);
    }
  };

  const isLimitHit = !user?.isPro && (user?.dailyExecutions || 0) >= 12;

  return (
    <div style={editorStyles.container}>
      <div style={editorStyles.header}>
        <span style={editorStyles.langLabel}>{language.toUpperCase()} EDITOR</span>
      </div>
      
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={editorStyles.textarea}
        spellCheck="false"
      />
      
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
        <div style={{fontSize: '10px', color: '#475569', marginBottom: '5px'}}>TERMINAL OUTPUT</div>
        {error ? (
          <pre style={{color: '#ef4444', whiteSpace: 'pre-wrap'}}>{error}</pre>
        ) : (
          <pre style={{whiteSpace: 'pre-wrap', color: '#cbd5e1'}}>{output}</pre>
        )}
      </div>
    </div>
  );
};

const editorStyles = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#000' },
  header: { padding: '5px 15px', backgroundColor: '#020617', borderBottom: '1px solid #1e293b' },
  langLabel: { fontSize: '10px', color: '#22c55e', fontWeight: 'bold', letterSpacing: '1px' },
  textarea: { flex: 1, backgroundColor: '#000', color: '#22c55e', padding: '20px', border: 'none', fontFamily: 'monospace', resize: 'none', outline: 'none', fontSize: '14px', lineHeight: '1.5' },
  footer: { padding: '10px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#000' },
  runBtn: { backgroundColor: '#22c55e', color: '#000', border: 'none', padding: '8px 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  upgradeBtn: { backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '8px 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  outputBox: { height: '180px', backgroundColor: '#020617', borderTop: '1px solid #1e293b', padding: '15px', overflowY: 'auto', fontSize: '13px', fontFamily: 'monospace' }
};

export default CodeEditor;

