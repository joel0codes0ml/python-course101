import React, { useState, useEffect, useRef } from 'react';
import { updateUserProfile } from "../firebase";
import { increment } from "firebase/firestore";

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
  c: 'sys', 
  cpp: 'sys',
  go: 'sys'
};

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language, starterCode }) => {
  const [code, setCode] = useState(""); 
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const [pyodide, setPyodide] = useState(null);
  
  const successSound = new Audio("https://www.soundjay.com/misc/sounds/magic-chime-01.mp3");

  // Load Pyodide Engine on mount
  useEffect(() => {
    async function initPy() {
      if (window.loadPyodide && !pyodide) {
        try {
          const instance = await window.loadPyodide();
          setPyodide(instance);
        } catch (e) {
          console.error("Pyodide Load Failed", e);
        }
      }
    }
    initPy();
  }, []);

  useEffect(() => {
    setCode(starterCode || ""); 
    setOutput("");
    setError("");
  }, [starterCode, language]);

  const execute = async () => {
    if (!code.trim()) {
        setError("⚠️ SYSTEM: Editor is empty. Type your solution.");
        return;
    }

    if (!user?.isPro && (user?.dailyExecutions || 0) >= 25) {
      setError("⛔ LIMIT REACHED: 25/25 runs used today.");
      setIsPaystackOpen(true);
      return; 
    }

    setIsRunning(true);
    setOutput("SYSTEM: Initializing Python Engine...");
    setError("");

    try {
      let result = "";

      // IF PYTHON: Run locally (INSTANT)
      if (language === "python") {
        if (!pyodide) {
          throw new Error("Engine warming up. Wait 3 seconds and try again.");
        }
        
        // Redirect stdout to capture print statements
        pyodide.runPython(`
          import sys
          import io
          sys.stdout = io.StringIO()
        `);
        
        await pyodide.runPythonAsync(code);
        result = pyodide.runPython("sys.stdout.getvalue()");
      } 
      // IF OTHER: Fallback to Piston (or add more local runners)
      else {
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
        if (data.run.stderr) throw new Error(data.run.stderr);
        result = data.run.output;
      }

      // SUCCESS LOGIC
      successSound.volume = 0.4;
      successSound.play().catch(e => console.log("Audio block", e));

      setOutput(`${result}\n\n✨ EXECUTION SUCCESSFUL! +25 XP`);
      
      const nextRuns = (user?.dailyExecutions || 0) + 1;
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

    } catch (err) {
      setError(err.message.includes("fetch") ? "❌ API Connection error." : `❌ ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={ui.container}>
      <div style={ui.editorHeader}>
        <span style={ui.langTag}>{language.toUpperCase()} ENGINE ACTIVE</span>
        {!pyodide && language === 'python' && <span style={ui.loadingEngine}> (WARMING UP...)</span>}
      </div>

      <div style={ui.scrollArea}>
        <Editor
          value={code}
          onValueChange={code => setCode(code)}
          highlight={code => highlight(code, prismLangs[language === 'sqlite3' ? 'sql' : language] || prismLangs.python || prismLangs.js)}
          padding={25}
          style={ui.editorFont}
        />
      </div>

      <div style={ui.footer}>
        <button 
          onClick={!user?.isPro && (user?.dailyExecutions >= 25) ? () => setIsPaystackOpen(true) : execute} 
          disabled={isRunning || (language === 'python' && !pyodide)}
          style={!user?.isPro && (user?.dailyExecutions >= 25) ? ui.upgradeBtn : ui.runBtn}
        >
          {isRunning ? "PROCESSING..." : !user?.isPro && (user?.dailyExecutions >= 25) ? "🚀 UNLOCK PRO" : "EXECUTE CODE"}
        </button>
      </div>

      <div style={ui.outputBox}>
        <div style={ui.terminalLabel}>TERMINAL</div>
        <pre style={{color: error ? '#ef4444' : '#22c55e', whiteSpace: 'pre-wrap', margin: 0, fontSize: '13px'}}>
          {error || output || "> Ready for input..."}
        </pre>
      </div>
    </div>
  );
};

const ui = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#000', borderLeft: '1px solid #1e293b' },
  editorHeader: { padding: '12px 20px', backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b' },
  langTag: { fontSize: '10px', fontWeight: '900', color: '#64748b', letterSpacing: '2px' },
  loadingEngine: { fontSize: '9px', color: '#f59e0b', fontWeight: 'bold' },
  scrollArea: { flex: 1, overflowY: 'auto', backgroundColor: '#000' },
  editorFont: { fontFamily: '"Fira Code", "Courier New", monospace', fontSize: 15, minHeight: '100%', color: '#fff' },
  footer: { padding: '15px 20px', borderTop: '1px solid #1e293b', backgroundColor: '#000', display: 'flex', justifyContent: 'flex-end' },
  runBtn: { backgroundColor: '#22c55e', color: '#000', border: 'none', padding: '10px 25px', borderRadius: '6px', fontWeight: '900', cursor: 'pointer', fontSize: '12px', transition: '0.2s' },
  upgradeBtn: { backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '10px 25px', borderRadius: '6px', fontWeight: '900', cursor: 'pointer', fontSize: '12px' },
  outputBox: { height: '200px', backgroundColor: '#020617', borderTop: '1px solid #1e293b', padding: '20px', overflowY: 'auto' },
  terminalLabel: { fontSize: '9px', fontWeight: '900', color: '#475569', marginBottom: '10px', letterSpacing: '1px' }
};

export default CodeEditor;



