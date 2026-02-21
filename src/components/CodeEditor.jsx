import React, { useState, useEffect, useRef } from 'react';
import { updateUserProfile } from "../firebase";
import { increment } from "firebase/firestore";

import Editor from 'react-simple-code-editor';
import { highlight, languages as prismLangs } from 'prismjs/components/prism-core';
// Import all 8 language syntaxes
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-r';
import 'prismjs/components/prism-markup'; // For HTML/CSS

import 'prismjs/themes/prism-tomorrow.css'; 

const SECTOR_MAP = {
  python: 'data', r: 'data', sqlite3: 'data',
  html: 'web', css: 'web', javascript: 'web',
  c: 'sys', cpp: 'sys', go: 'sys'
};

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language, starterCode }) => {
  const [code, setCode] = useState(""); 
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const [pyodide, setPyodide] = useState(window.pyodideInstance || null);
  const [engineStatus, setEngineStatus] = useState("CONNECTED");

  const successSound = useRef(new Audio("https://www.soundjay.com/misc/sounds/magic-chime-01.mp3"));

  useEffect(() => {
    // Only boot Pyodide if the user actually switches to Python
    const loadPython = async () => {
      if (language === 'python' && !pyodide) {
        setEngineStatus("BOOTING_PYTHON...");
        if (!window.loadPyodide) {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
          document.head.appendChild(script);
          await new Promise(r => script.onload = r);
        }
        const py = await window.loadPyodide();
        window.pyodideInstance = py;
        setPyodide(py);
        setEngineStatus("PYTHON_READY");
      } else {
        setEngineStatus("REMOTE_ENGINE_ACTIVE");
      }
    };
    loadPython();
  }, [language]);

  useEffect(() => {
    setCode(starterCode || ""); 
    setOutput("");
    setError("");
  }, [starterCode, language]);

  const execute = async () => {
    if (!code.trim()) return;
    if (!user?.isPro && (user?.dailyExecutions >= 25)) {
      setIsPaystackOpen(true);
      return; 
    }

    setIsRunning(true);
    setOutput("SYSTEM: Executing...");
    setError("");

    try {
      let result = "";

      // 1. LOCAL PYTHON EXECUTION
      if (language === "python" && pyodide) {
        await pyodide.runPythonAsync(`import sys, io\nsys.stdout = io.StringIO()`);
        await pyodide.runPythonAsync(code);
        result = pyodide.runPython("sys.stdout.getvalue()");
      } 
      // 2. WEB LANGUAGES (No execution needed, just a success simulation)
      else if (language === "html" || language === "css") {
        result = "DOM_RENDER_SUCCESSFUL: Visual output updated.";
      }
      // 3. REMOTE EXECUTION (C, CPP, GO, R, SQL)
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

      // UI/XP Updates
      successSound.current.play().catch(() => {});
      const sector = SECTOR_MAP[language] || 'web';
      const nextRuns = (user?.dailyExecutions || 0) + 1;
      
      setUser(prev => ({ 
        ...prev, dailyExecutions: nextRuns, xp: (prev.xp || 0) + 25 
      }));

      setOutput(`${result}\n\n✨ EXECUTION COMPLETE (+25 XP)`);

      updateUserProfile(user.uid, {
        dailyExecutions: nextRuns,
        xp: increment(25),
        [`sectorProgress.${sector}`]: increment(5)
      });

    } catch (err) {
      setError(err.message.includes("fetch") ? "❌ API TIMEOUT: Try again." : `❌ ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={ui.container}>
      <div style={ui.editorHeader}>
        <span style={ui.langTag}>{language.toUpperCase()} // {engineStatus}</span>
      </div>

      <div style={ui.scrollArea}>
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={code => highlight(code, 
            prismLangs[language === 'sqlite3' ? 'sql' : language === 'html' ? 'markup' : language] || prismLangs.js
          )}
          padding={25}
          style={ui.editorFont}
        />
      </div>

      <div style={ui.footer}>
        <button onClick={execute} disabled={isRunning} style={ui.runBtn}>
          {isRunning ? "PROCESSING..." : "RUN_CODE"}
        </button>
      </div>

      <div style={ui.outputBox}>
        <div style={ui.terminalLabel}>CONSOLE_OUTPUT</div>
        <pre style={{...ui.pre, color: error ? '#ef4444' : '#22c55e'}}>
          {error || output || "> ready_"}
        </pre>
      </div>
    </div>
  );
};

// ... keep your UI styles the same ...



