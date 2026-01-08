import React, { useState } from 'react';
import { updateUserProfile } from "../firebase";

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language, starterCode, expectedOutput }) => {
  const [code, setCode] = useState(starterCode || "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  const execute = async () => {
    const currentRuns = user?.dailyExecutions || 0;
    
    // HARD LIMIT CHECK
    if (!user?.isPro && currentRuns >= 12) {
      setError("⛔ LIMIT REACHED: 12/12 runs used.");
      setIsPaystackOpen(true); // Automatically open the payment window
      return; 
    }

    setIsRunning(true);
    setOutput("SYSTEM: Compiling...");
    setError("");

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

      // Update Firebase
      await updateUserProfile(user.uid, { dailyExecutions: nextRuns });
      
      // Update local state instantly
      setUser(prev => ({ ...prev, dailyExecutions: nextRuns }));

      if (data.run.stderr) {
        setError(data.run.stderr);
      } else {
        setOutput(data.run.output);
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
        {error ? <pre style={{color: '#ef4444'}}>{error}</pre> : <pre>{output}</pre>}
      </div>
    </div>
  );
};

const editorStyles = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#000' },
  textarea: { flex: 1, backgroundColor: '#000', color: '#22c55e', padding: '20px', border: 'none', fontFamily: 'monospace', resize: 'none', outline: 'none' },
  footer: { padding: '10px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'flex-end' },
  runBtn: { backgroundColor: '#22c55e', color: '#000', border: 'none', padding: '8px 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  upgradeBtn: { backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '8px 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  outputBox: { height: '150px', backgroundColor: '#020617', borderTop: '1px solid #1e293b', padding: '15px', overflowY: 'auto', fontSize: '13px' }
};

export default CodeEditor;

