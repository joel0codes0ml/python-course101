import React, { useState, useEffect } from 'react';
import { updateUserProfile } from "../firebase";

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language, starterCode, expectedOutput }) => {
  const [code, setCode] = useState(starterCode || "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  // CHAPTER CLOSER: This ensures the textarea clears/resets when the lesson changes
  useEffect(() => {
    setCode(starterCode || "");
    setOutput("");
    setError("");
  }, [starterCode, language]);

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

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: language === "sqlite3" ? "sql" : language,
          version: "*",
          files: [{ content: code }],
        }),
      });

      const data = await response.json();
      const nextRuns = currentRuns + 1;

      setUser(prev => ({ ...prev, dailyExecutions: nextRuns }));

      updateUserProfile(user.uid, { dailyExecutions: nextRuns }).catch(e => {
        console.error("Silent Sync Failed:", e);
      });

      if (data.run.stderr) {
        setError(data.run.stderr);
      } else {
        const result = data.run.output || "Program executed successfully.";
        // Optional: Check if the output matches expectedOutput here if you want to show Success
        setOutput(result);
      }
    } catch (err) {
      setError("Execution failed. Check your connection.");
    } finally {
      setIsRunning(false);
    }
  };

  const isLimitHit = !user?.isPro && (user?.dailyExecutions || 0) >= 12;

  return (
    <div style={editorStyles.container}>
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
  textarea: { flex: 1, backgroundColor: '#000', color: '#22c55e', padding: '20px', border: 'none', fontFamily: 'monospace', resize: 'none', outline: 'none', fontSize: '14px', lineHeight: '1.5' },
  footer: { padding: '10px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#000' },
  runBtn: { backgroundColor: '#22c55e', color: '#000', border: 'none', padding: '8px 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' },
  upgradeBtn: { backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '8px 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  outputBox: { height: '150px', backgroundColor: '#020617', borderTop: '1px solid #1e293b', padding: '15px', overflowY: 'auto', fontSize: '13px', fontFamily: 'monospace' }
};

export default CodeEditor;



