import React, { useState, useEffect } from 'react';
import { updateUserProfile } from "../firebase";
import { increment } from "firebase/firestore";

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language, starterCode, expectedOutput }) => {
  const [code, setCode] = useState(""); 
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  // ADDED: Sound effect
  const successSound = new Audio("https://www.soundjay.com/misc/sounds/magic-chime-01.mp3");

  useEffect(() => {
    // CHANGED: Instead of starterCode, we give a blank prompt so they must type it.
    setCode("// Type your code here...\n"); 
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
    // CHANGED: Check if they just left the default comment
    if (!code.trim() || code.includes("// Type your code")) {
        setError("⚠️ Editor is empty! Please type the solution.");
        return;
    }

    const currentRuns = user?.dailyExecutions || 0;
    // Check limits if not Pro
    if (!user?.isPro && currentRuns >= 12) {
      setError("⛔ LIMIT REACHED: 12/12 runs used today.");
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

      if (data.run.stderr) {
        setError(data.run.stderr);
        // Even if error, we count the run (optional, depends on your preference)
        setUser(prev => ({ ...prev, dailyExecutions: nextRuns }));
        updateUserProfile(user.uid, { dailyExecutions: nextRuns });
      } else {
        // --- XP LOGIC STARTS HERE ---
        
        // 1. Clean the strings (remove extra spaces/newlines) to compare fairly
        const cleanResult = result.trim(); 
        const cleanExpected = expectedOutput ? expectedOutput.trim() : "";

        // 2. Check match (KEPT STRICT: ===)
        if (cleanExpected && cleanResult === cleanExpected) {
            
            // ADDED: Play Sound
            successSound.volume = 0.5;
            successSound.play().catch(e => console.log("Audio error", e));

            setOutput(`${result}\n\n✨ CORRECT! +25 XP`);
            
            // Add XP locally (Visual)
            setUser(prev => ({ 
                ...prev, 
                dailyExecutions: nextRuns,
                xp: (prev.xp || 0) + 25 
            }));

            // Add XP to Database
            updateUserProfile(user.uid, { 
                dailyExecutions: nextRuns,
                xp: increment(25) 
            });
            
        } else {
            // Wrong answer
            setOutput(result);
            setUser(prev => ({ ...prev, dailyExecutions: nextRuns }));
            updateUserProfile(user.uid, { dailyExecutions: nextRuns });
        }
        // --- XP LOGIC ENDS HERE ---
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
        placeholder="// Write your code here..."
        style={ui.textarea} // This now has the green color
        spellCheck="false"
      />
      <div style={ui.footer}>
        <button 
          onClick={!user?.isPro && (user?.dailyExecutions >= 12) ? () => setIsPaystackOpen(true) : execute} 
          disabled={isRunning}
          style={!user?.isPro && (user?.dailyExecutions >= 12) ? ui.upgradeBtn : ui.runBtn}
        >
          {isRunning ? "Running..." : !user?.isPro && (user?.dailyExecutions >= 12) ? "🚀 UNLOCK PRO" : "RUN CODE"}
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
  // REVERTED COLOR TO GREEN HERE:
  textarea: { flex: 1, backgroundColor: '#000', color: '#22c55e', padding: '25px', border: 'none', fontFamily: '"Fira Code", monospace', resize: 'none', outline: 'none', fontSize: '15px', lineHeight: '1.6' },
  footer: { padding: '12px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'flex-end' },
  runBtn: { backgroundColor: '#22c55e', color: '#000', border: 'none', padding: '10px 30px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  upgradeBtn: { backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '10px 30px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  outputBox: { height: '160px', backgroundColor: '#020617', borderTop: '1px solid #1e293b', padding: '20px', overflowY: 'auto', fontSize: '13px' }
};

export default CodeEditor;



