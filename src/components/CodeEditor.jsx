import React, { useState, useEffect } from 'react';
import { updateUserProfile } from "../firebase";
import { increment } from "firebase/firestore";

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language, starterCode, expectedOutput }) => {
  const [code, setCode] = useState(""); 
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCode(starterCode || ""); 
    setOutput("");
    setError("");
  }, [starterCode, language]);

  const handleKeyDown = (e) => {
    const { selectionStart, selectionEnd, value } = e.target;
    if (e.key === 'Tab') {
      e.preventDefault();
      const newCode = value.substring(0, selectionStart) + "    " + value.substring(selectionEnd);
      setCode(newCode);
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = selectionStart + 4; }, 0);
    }
    if (e.key === 'Enter') {
      const lines = value.substring(0, selectionStart).split('\n');
      const currentLine = lines[lines.length - 1];
      const indentMatch = currentLine.match(/^\s*/);
      const currentIndentation = indentMatch ? indentMatch[0] : "";
      let extraIndent = "";
      if (currentLine.trim().endsWith(':') || currentLine.trim().endsWith('{')) { extraIndent = "    "; }
      e.preventDefault();
      const newCode = value.substring(0, selectionStart) + "\n" + currentIndentation + extraIndent + value.substring(selectionEnd);
      setCode(newCode);
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = selectionStart + 1 + currentIndentation.length + extraIndent.length; }, 0);
    }
    const pairs = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" };
    if (pairs[e.key]) {
      e.preventDefault();
      const newCode = value.substring(0, selectionStart) + e.key + pairs[e.key] + value.substring(selectionEnd);
      setCode(newCode);
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = selectionStart + 1; }, 0);
    }
  };

  const execute = async () => {
    if (!code.trim()) {
        setError("⚠️ Editor is empty!");
        return;
    }

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
      const result = data.run.output || "";
      const nextRuns = currentRuns + 1;

      // Update Daily Runs
      setUser(prev => ({ ...prev, dailyExecutions: nextRuns }));
      updateUserProfile(user.uid, { dailyExecutions: nextRuns });

      if (data.run.stderr) {
        setError(data.run.stderr);
      } else {
        // PASS/FAIL LOGIC
        const isCorrect = expectedOutput && result.trim() === expectedOutput.trim();
        
        if (isCorrect) {
            setOutput(`${result}\n\n✨ SUCCESS! +25 XP GAINED`);
            // Optimistic UI Update
            setUser(prev => ({ ...prev, xp: (prev.xp || 0) + 25 }));
            // Background DB Update
            updateUserProfile(user.uid, { xp: increment(25) }).catch(console.error);
        } else {
            setOutput(result || "Done (No output).");
        }
      }
    } catch (err) {
      setError("Connection error. Check Piston API.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={ui.container}>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="// Solution goes here..."
        style={ui.textarea}
        spellCheck="false"
      />
      <div style={ui.footer}>
        <button 
          onClick={!user?.isPro && (user?.dailyExecutions >= 12) ? () => setIsPaystackOpen(true) : execute} 
          disabled={isRunning}
          style={!user?.isPro && (user?.dailyExecutions >= 12) ? ui.upgradeBtn : ui.runBtn}
        >
          {isRunning ? "..." : !user?.isPro && (user?.dailyExecutions >= 12) ? "🚀 UNLOCK PRO" : "RUN CODE"}
        </button>
      </div>
      <div style={ui.outputBox}>
        <pre style={{color: error ? '#ef4444' : '#22c55e', whiteSpace: 'pre-wrap', margin: 0}}>
          {error || output || "Terminal Ready"}
        </pre>
      </div>
    </div>
  );
};

const ui = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#000' },
  textarea: { flex: 1, backgroundColor: '#000', color: '#cbd5e1', padding: '25px', border: 'none', fontFamily: '"Fira Code", monospace', resize: 'none', outline: 'none', fontSize: '15px', lineHeight: '1.6' },
  footer: { padding: '12px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'flex-end' },
  runBtn: { backgroundColor: '#22c55e', color: '#000', border: 'none', padding: '10px 30px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  upgradeBtn: { backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '10px 30px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  outputBox: { height: '160px', backgroundColor: '#020617', borderTop: '1px solid #1e293b', padding: '20px', overflowY: 'auto', fontSize: '13px' }
};

export default CodeEditor;



