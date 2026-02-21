import React, { useState, useEffect } from 'react';
import { updateUserProfile } from "../firebase";
import { increment } from "firebase/firestore";

// For Syntax Highlighting
import Editor from 'react-simple-code-editor';
import { highlight, languages as prismLangs } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css'; 

const SECTOR_MAP = {
  python: 'data',
  r: 'data',
  sqlite3: 'data',
  html: 'web',
  css: 'web',
  c: 'sys', // Changed from 'ai' to 'sys' to match your App.jsx SECTORS
  cpp: 'sys',
  go: 'sys'
};

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language, starterCode, expectedOutput }) => {
  const [code, setCode] = useState(""); 
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  const successSound = new Audio("https://www.soundjay.com/misc/sounds/magic-chime-01.mp3");

  useEffect(() => {
    // FIX: Truly blank if no starter code, avoids the "// Start coding" check issues
    setCode(starterCode || "");
    setOutput("");
    setError("");
  }, [starterCode, language]);

  const execute = async () => {
    // Check if truly empty
    if (!code.trim()) {
        setError("⚠️ Editor is empty! Please type the solution.");
        return;
    }

    if (!user?.isPro && (user?.dailyExecutions || 0) >= 12) {
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
      const nextRuns = (user?.dailyExecutions || 0) + 1;

      if (data.run.stderr) {
        setError(data.run.stderr);
        updateUserProfile(user.uid, { dailyExecutions: nextRuns });
      } else {
        const cleanResult = result.trim(); 
        const cleanExpected = expectedOutput ? expectedOutput.trim() : "";

        // VALIDATION LOGIC
        if (cleanExpected && cleanResult === cleanExpected) {
            successSound.volume = 0.4;
            successSound.play().catch(e => console.log("Audio block", e));

            setOutput(`${result}\n\n✨ CORRECT! +25 XP`);
            
            const sector = SECTOR_MAP[language] || 'web';
            const currentProgress = user?.sectorProgress?.[sector] || 0;
            const newProgress = Math.min(100, currentProgress + 5);

            const updates = {
                dailyExecutions: nextRuns,
                xp: increment(25),
                [`sectorProgress.${sector}`]: newProgress
            };

            setUser(prev => ({ 
                ...prev, 
                dailyExecutions: nextRuns,
                xp: (prev.xp || 0) + 25,
                sectorProgress: { ...prev.sectorProgress, [sector]: newProgress }
            }));

            updateUserProfile(user.uid, updates);
            
        } else {
            setOutput(result);
            updateUserProfile(user.uid, { dailyExecutions: nextRuns });
        }
      }
    } catch (err) {
      setError("API Connection error. Check Piston status.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={ui.container}>
      <div style={ui.editorHeader}>
        <span style={ui.langTag}>{language.toUpperCase()} EDITOR</span>
      </div>

      <div style={ui.scrollArea}>
        <Editor
          value={code}
          onValueChange={code => setCode(code)}
          highlight={code => highlight(code, prismLangs[language === 'sqlite3' ? 'sql' : language] || prismLangs.js)}
          padding={25}
          style={ui.editorFont}
        />
      </div>

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
        <div style={ui.terminalLabel}>TERMINAL OUTPUT</div>
        <pre style={{color: error ? '#ef4444' : '#22c55e', whiteSpace: 'pre-wrap', margin: 0}}>
          {error || output || "> Ready for input..."}
        </pre>
      </div>
    </div>
  );
};

// ... keep your ui styles exactly as they are ...
const ui = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#000', borderLeft: '1px solid #1e293b' },
  editorHeader: { padding: '10px 20px', backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b' },
  langTag: { fontSize: '10px', fontWeight: '900', color: '#475569', letterSpacing: '1px' },
  scrollArea: { flex: 1, overflowY: 'auto' },
  editorFont: { fontFamily: '"Fira Code", monospace', fontSize: 15, minHeight: '100%' },
  footer: { padding: '12px 20px', borderTop: '1px solid #1e293b', backgroundColor: '#000', display: 'flex', justifyContent: 'flex-end' },
  runBtn: { backgroundColor: '#22c55e', color: '#000', border: 'none', padding: '10px 25px', borderRadius: '8px', fontWeight: '900', cursor: 'pointer', fontSize: '12px' },
  upgradeBtn: { backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '10px 25px', borderRadius: '8px', fontWeight: '900', cursor: 'pointer', fontSize: '12px' },
  outputBox: { height: '180px', backgroundColor: '#020617', borderTop: '1px solid #1e293b', padding: '20px', overflowY: 'auto' },
  terminalLabel: { fontSize: '9px', fontWeight: '900', color: '#475569', marginBottom: '10px' }
};

export default CodeEditor;



