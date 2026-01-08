import React, { useState } from 'react';
import { updateUserProfile } from "../firebase";

const CodeEditor = ({ user, setUser, language, starterCode, expectedOutput }) => {
  const [code, setCode] = useState(starterCode || "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  const execute = async () => {
    // 1. THE GATEKEEPER CHECK
    const currentRuns = user?.dailyExecutions || 0;
    
    if (!user?.isPro && currentRuns >= 12) {
      setError("⛔ LIMIT REACHED: 12/12 runs used.");
      // You can also trigger the modal automatically here if you pass down the toggle function
      alert("Please upgrade to Zenin Pro to continue running code!");
      return; // STOPS THE FUNCTION HERE
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

      // 2. INCREMENT THE RUN COUNT IN FIREBASE
      const nextRuns = currentRuns + 1;
      await updateUserProfile(user.uid, { dailyExecutions: nextRuns });
      
      // 3. UPDATE LOCAL STATE (This updates the 'Runs Left' in the Nav)
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

  return (
    <div style={editorStyles.container}>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={editorStyles.textarea}
      />
      
      <div style={editorStyles.footer}>
        <button 
          onClick={execute} 
          disabled={isRunning}
          style={user?.isPro || (user?.dailyExecutions || 0) < 12 ? editorStyles.runBtn : editorStyles.disabledBtn}
        >
          {isRunning ? "RUNNING..." : "RUN CODE"}
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
  disabledBtn: { backgroundColor: '#1e293b', color: '#475569', border: 'none', padding: '8px 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'not-allowed' },
  outputBox: { height: '150px', backgroundColor: '#020617', borderTop: '1px solid #1e293b', padding: '15px', overflowY: 'auto', fontSize: '13px' }
};

export default CodeEditor;

