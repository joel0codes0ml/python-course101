import React, { useState, useEffect } from "react";
import { updateUserProfile } from "../firebase";
import { increment } from "firebase/firestore";
import Editor from "react-simple-code-editor";
import { highlight, languages as prismLangs } from "prismjs/components/prism-core";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-java";
import "prismjs/components/prism-r";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism-tomorrow.css";

const ALL_LANGUAGES = [
  { label: "Python",     id: "python",     prism: "python" },
  { label: "JavaScript", id: "javascript", prism: "javascript" },
  { label: "HTML",       id: "html",       prism: "markup" },
  { label: "CSS",        id: "css",        prism: "css" },
  { label: "C",          id: "c",          prism: "c" },
  { label: "C++",        id: "cpp",        prism: "cpp" },
  { label: "Go",         id: "go",         prism: "go" },
  { label: "SQL",        id: "sqlite3",    prism: "sql" },
  { label: "R",          id: "r",          prism: "r" },
  { label: "Java",       id: "java",       prism: "java" },
];

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language, onXpEarned }) => {
  const [activeLang, setActiveLang] = useState(
    ALL_LANGUAGES.find(l => l.id === language) || ALL_LANGUAGES[0]
  );
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [pyodide, setPyodide] = useState(window.pyodideInstance || null);
  const [runSuccess, setRunSuccess] = useState(false);

  const isWebDev = activeLang.id === "html" || activeLang.id === "css";

  // Sync with sidebar language changes
  useEffect(() => {
    const matched = ALL_LANGUAGES.find(l => l.id === language);
    if (matched) setActiveLang(matched);
  }, [language]);

  // Wipe editor on language switch
  useEffect(() => {
    setCode("");
    setOutput("");
    setError("");
    setPreviewContent("");
    setRunSuccess(false);
  }, [activeLang]);

  // Non-blocking Python loader
  useEffect(() => {
    if (activeLang.id === "python" && !pyodide) {
      const loadPy = async () => {
        if (!window.loadPyodide) {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
          s.async = true;
          s.defer = true;
          document.head.appendChild(s);
          await new Promise(r => s.onload = r);
        }
        const py = await window.loadPyodide();
        window.pyodideInstance = py;
        setPyodide(py);
      };
      setTimeout(() => loadPy(), 500);
    }
  }, [activeLang, pyodide]);

  const execute = async () => {
    if (!code.trim() || isRunning) return;
    setIsRunning(true);
    setOutput("Processing...");
    setError("");
    setRunSuccess(false);

    try {
      if (isWebDev) {
        setPreviewContent(activeLang.id === "css" ? `<style>${code}</style>` : code);
        setOutput("Browser updated.");
        setRunSuccess(true);
      } else if (activeLang.id === "python") {
        if (!pyodide) throw new Error("Python is still booting up. Try again in 2 seconds.");
        await pyodide.runPythonAsync(`import sys, io\nsys.stdout = io.StringIO()\nsys.stderr = io.StringIO()`);
        await pyodide.runPythonAsync(code);
        const stdout = pyodide.runPython("sys.stdout.getvalue()");
        const stderr = pyodide.runPython("sys.stderr.getvalue()");
        if (stderr) setError(stderr);
        else { setOutput(stdout || "Finished (no output)."); setRunSuccess(true); }
      } else {
        const langMap = {
          "cpp": "cpp", "sqlite3": "sql", "javascript": "javascript",
          "r": "r", "c": "c", "go": "go", "java": "java"
        };
        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: langMap[activeLang.id] || activeLang.id,
            version: "*",
            files: [{ content: code }]
          })
        });
        const data = await response.json();
        if (data?.run) {
          if (data.run.stderr) setError(data.run.stderr);
          else { setOutput(data.run.output || data.run.stdout || "Execution complete (no output)."); setRunSuccess(true); }
        } else {
          setError(data.message || "Server Busy. Try again in 2 seconds.");
        }
      }

      if (user?.uid) {
        updateUserProfile(user.uid, { dailyExecutions: increment(1), xp: increment(25) });
        setUser(prev => ({ ...prev, dailyExecutions: (prev.dailyExecutions || 0) + 1, xp: (prev.xp || 0) + 25 }));
        if (onXpEarned) onXpEarned(25);
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={ui.container}>

      {/* LANGUAGE PICKER */}
      <div style={ui.header}>
        <div style={ui.langRow}>
          {ALL_LANGUAGES.map(lang => (
            <button
              key={lang.id}
              onClick={() => setActiveLang(lang)}
              style={{
                ...ui.langPill,
                background: activeLang.id === lang.id ? '#22c55e' : '#0f172a',
                color: activeLang.id === lang.id ? '#000' : '#475569',
                border: activeLang.id === lang.id ? '1px solid #22c55e' : '1px solid #1e293b',
                fontWeight: activeLang.id === lang.id ? '900' : '600',
                transform: activeLang.id === lang.id ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* EDITOR */}
      <div style={ui.scrollArea}>
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={c => highlight(c, prismLangs[activeLang.prism] || prismLangs.javascript)}
          padding={15}
          style={ui.editorFont}
          placeholder={`// Write your ${activeLang.label} code here...`}
        />
      </div>

      {/* RUN BUTTON */}
      <div style={ui.footer}>
        <button
          onClick={execute}
          disabled={isRunning}
          style={{
            ...ui.runBtn,
            background: isRunning ? '#166534' : runSuccess ? '#15803d' : '#22c55e',
            transition: 'all 0.15s ease',
            transform: isRunning ? 'scale(0.97)' : 'scale(1)',
          }}
        >
          {isRunning ? "⏳ RUNNING..." : runSuccess ? "✅ RUN AGAIN" : "▶ RUN CODE"}
        </button>
      </div>

      {/* OUTPUT / PREVIEW */}
      <div style={ui.terminal}>
        <div style={ui.terminalLabel}>{isWebDev ? "LIVE PREVIEW" : "TERMINAL"}</div>
        {isWebDev ? (
          <iframe srcDoc={previewContent} style={ui.iframe} title="preview" />
        ) : (
          <pre style={{ ...ui.terminalText, color: error ? "#ef4444" : "#22c55e" }}>
            {error ? `❌ ERROR:\n${error}` : output || "> ready_"}
          </pre>
        )}
      </div>
    </div>
  );
};

const ui = {
  container: {
    display: "flex", flexDirection: "column", height: "100%",
    minHeight: "60vh", backgroundColor: "#000", width: "100%", overflow: "hidden"
  },
  header: {
    padding: "10px 12px", background: "#0f172a",
    borderBottom: "1px solid #1e293b", overflowX: "auto"
  },
  langRow: {
    display: "flex", gap: "6px", flexWrap: "wrap"
  },
  langPill: {
    padding: "4px 10px", borderRadius: "20px", fontSize: "9px",
    cursor: "pointer", transition: "all 0.15s ease", whiteSpace: "nowrap",
    fontFamily: "monospace"
  },
  scrollArea: {
    flex: 1, overflowY: "auto", overflowX: "hidden", minHeight: "35vh"
  },
  editorFont: {
    fontFamily: "monospace", fontSize: "14px", color: "#fff", minHeight: "100%"
  },
  footer: {
    padding: "10px 15px", borderTop: "1px solid #1e293b",
    textAlign: "right", background: "#000"
  },
  runBtn: {
    background: "#22c55e", color: "#000", padding: "12px 24px",
    borderRadius: "4px", fontWeight: "900", border: "none", cursor: "pointer",
    width: "100%", maxWidth: "200px", fontSize: "12px", fontFamily: "monospace"
  },
  terminal: {
    height: "25vh", minHeight: "150px", background: "#020617",
    padding: "15px", borderTop: "1px solid #1e293b", overflowY: "auto"
  },
  terminalLabel: {
    fontSize: "9px", color: "#475569", fontWeight: "bold", marginBottom: "8px"
  },
  terminalText: {
    margin: 0, fontSize: "13px", whiteSpace: "pre-wrap", fontFamily: "monospace"
  },
  iframe: {
    width: "100%", height: "100%", border: "none",
    background: "#fff", borderRadius: "4px"
  }
};

export default CodeEditor;
