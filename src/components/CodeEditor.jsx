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

  const handleKeyDown = (e) => {
    const { selectionStart, selectionEnd, value } = e.target;

    // 1. HANDLE TAB
    if (e.key === 'Tab') {
      e.preventDefault();
      const newCode = value.substring(0, selectionStart) + "    " + value.substring(selectionEnd);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 4;
      }, 0);
    }

    // 2. HANDLE AUTO-INDENT & CARRIAGE RETURN
    if (e.key === 'Enter') {
      const lines = value.substring(0, selectionStart).split('\n');
      const currentLine = lines[lines.length - 1];
      const indentMatch = currentLine.match(/^\s*/);
      const currentIndentation = indentMatch ? indentMatch[0] : "";
      
      // Add extra indent if line ends in colon or brace
      let extraIndent = "";
      if (currentLine.trim().endsWith(':') || currentLine.trim().endsWith('{')) {
        extraIndent = "    ";
      }

      e.preventDefault();
      const newCode = value.substring(0, selectionStart) + "\n" + currentIndentation + extraIndent + value.substring(selectionEnd);
      setCode(newCode);

      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 1 + currentIndentation.length + extraIndent.length;
      }, 0);
    }

    // 3. HANDLE BRACKET PAIRING
    const pairs = { '(': ')', '[': ']', '{': '{', '"': '"', "'": "'" };
    if (pairs[e.key]) {
      e.preventDefault();
      const newCode = value.substring(0, selectionStart) + e.key + pairs[e.key] + value.substring(selectionEnd);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 1;
      }, 0);
    }
  };

  const execute = async () => {
    if (!code.trim()) {
        setError("⚠️ Editor is empty! Write some code first.");
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
      const nextRuns = currentRuns + 1;
      
      setUser(prev => ({ ...prev, dailyExecutions: nextRuns }));
      updateUserProfile(user.uid, { dailyExecutions: nextRuns }).catch(() => {});

      if (data.run.stderr) {
        setError(data.run.stderr);
      } else {
        const result = data.run.output || "Done (No output).";
        if (expectedOutput && result.trim() === expectedOutput.trim()) {
           setOutput(`${result}\n\n✨ SUCCESS! +20 XP`);
        } else {
           setOutput(result);
        }
      }
    } catch (err) {
      setError("Connection error. Is the Piston API up?");
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
  textarea: { 
    flex: 1, backgroundColor: '#000', color: '#22c55e', padding: '25px', 
    border: 'none', fontFamily: '"Fira Code", monospace', resize: 'none', 
    outline: 'none', fontSize: '15px', lineHeight: '1.6' 
  },
  footer: { padding: '12px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'flex-end' },
  runBtn: { backgroundColor: '#22c55e', color: '#000', border: 'none', padding: '10px 30px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  upgradeBtn: { backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '10px 30px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  outputBox: { height: '160px', backgroundColor: '#020617', borderTop: '1px solid #1e293b', padding: '20px', overflowY: 'auto', fontSize: '13px' }
};

export default CodeEditor;



