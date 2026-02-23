import React, { useState, useEffect } from "react";
import { updateUserProfile } from "../firebase";
import { increment } from "firebase/firestore";
import Editor from "react-simple-code-editor";
import { highlight, languages as prismLangs } from "prismjs/components/prism-core";

// Prism Languages
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

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language }) => {
  const [code, setCode] = useState(""); 
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [pyodide, setPyodide] = useState(window.pyodideInstance || null);

  const isWebDev = language === "html" || language === "css";

  // WIPE ON LANGUAGE CHANGE
  useEffect(() => {
    setCode(""); 
    setOutput("");
    setError("");
    setPreviewContent("");
  }, [language]);

  // NON-BLOCKING PYTHON LOADER
  useEffect(() => {
    if (language === "python" && !pyodide) {
      const loadPy = async () => {
        if (!window.loadPyodide) {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
          s.async = true; // Prevents freezing the UI during login!
          s.defer = true;
          document.head.appendChild(s);
          await new Promise(r => s.onload = r);
        }
        const py = await window.loadPyodide();
        window.pyodideInstance = py;
        setPyodide(py);
      };
      // Delay the load slightly so the UI renders FIRST
      setTimeout(() => loadPy(), 500); 
    }
  }, [language, pyodide]);

  const execute = async () => {
    if (!code.trim() || isRunning) return;

    setIsRunning(true);
    setOutput("Processing...");
    setError("");

    try {
      if (isWebDev) {
        setPreviewContent(language === "css" ? `<style>${code}</style>` : code);
        setOutput("Browser updated.");
      } 
      else if (language === "python") {
        if (!pyodide) throw new Error("Python is still booting up. Try again in 2 seconds.");
        await pyodide.runPythonAsync(`import sys, io\nsys.stdout = io.StringIO()\nsys.stderr = io.StringIO()`);
        await pyodide.runPythonAsync(code);
        const stdout = pyodide.runPython("sys.stdout.getvalue()");
        const stderr = pyodide.runPython("sys.stderr.getvalue()");
        if (stderr) setError(stderr);
        setOutput(stdout || "Finished (no output).");
      } 
      else {
        const langMap = { "c++": "cpp", "sqlite3": "sql", "javascript": "javascript", "r": "r" };
        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: langMap[language] || language,
            version: "*",
            files: [{ content: code }]
          })
        });

        const data = await response.json();
        if (data && data.run) {
          if (data.run.stderr) setError(data.run.stderr);
          else setOutput(data.run.output || data.run.stdout || "Execution complete (no output).");
        } else {
          setError(data.message || "Server Busy. Try again in 2 seconds.");
        }
      }

      if (user?.uid) {
        updateUserProfile(user.uid, { dailyExecutions: increment(1), xp: increment(25) });
        setUser(prev => ({ ...prev, dailyExecutions: (prev.dailyExecutions || 0) + 1, xp: (prev.xp || 0) + 25 }));
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={ui.container}>
      <div style={ui.header}>
        <span style={ui.tag}>{language.toUpperCase()} ENGINE</span>
      </div>
      
      {/* Dynamic Scroll Area for Mobile */}
      <div style={ui.scrollArea}>
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={c => highlight(c, prismLangs[language === 'html' ? 'markup' : language === 'c++' ? 'cpp' : language] || prismLangs.javascript)}
          padding={15}
          style={ui.editorFont}
        />
      </div>

      <div style={ui.footer}>
        <button onClick={execute} disabled={isRunning} style={ui.runBtn}>
          {isRunning ? "..." : "RUN CODE"}
        </button>
      </div>

      <div style={ui.terminal}>
        <div style={ui.terminalLabel}>{isWebDev ? "LIVE PREVIEW" : "TERMINAL"}</div>
        {isWebDev ? (
          <iframe srcDoc={previewContent} style={ui.iframe} title="p" />
        ) : (
          <pre style={{...ui.terminalText, color: error ? "#ef4444" : "#22c55e"}}>
            {error ? `❌ ERROR:\n${error}` : output || "> ready_"}
          </pre>
        )}
      </div>
    </div>
  );
};

// MOBILE-RESPONSIVE UI
const ui = {
  container: { 
    display: "flex", 
    flexDirection: "column", 
    height: "100%", // Adapts to parent container
    minHeight: "60vh", // Ensures it doesn't collapse on mobile
    backgroundColor: "#000",
    width: "100%",
    overflow: "hidden" // Prevents horizontal wobble
  },
  header: { padding: "10px 15px", background: "#0f172a", borderBottom: "1px solid #1e293b" },
  tag: { fontSize: "10px", color: "#64748b", fontWeight: "900" },
  scrollArea: { 
    flex: 1, 
    overflowY: "auto", 
    overflowX: "hidden", 
    minHeight: "35vh" // Gives the editor breathing room on phones
  },
  editorFont: { fontFamily: 'monospace', fontSize: "14px", color: "#fff", minHeight: "100%" },
  footer: { padding: "10px 15px", borderTop: "1px solid #1e293b", textAlign: "right", background: "#000" },
  runBtn: { background: "#22c55e", color: "#000", padding: "12px 24px", borderRadius: "4px", fontWeight: "900", border: "none", cursor: "pointer", width: "100%", maxWidth: "200px" }, // Better touch target for thumbs
  terminal: { 
    height: "25vh", // Scales with the phone screen instead of fixed 200px
    minHeight: "150px",
    background: "#020617", 
    padding: "15px", 
    borderTop: "1px solid #1e293b", 
    overflowY: "auto" 
  },
  terminalLabel: { fontSize: "9px", color: "#475569", fontWeight: "bold", marginBottom: "8px" },
  terminalText: { margin: 0, fontSize: "13px", whiteSpace: "pre-wrap", fontFamily: 'monospace' },
  iframe: { width: "100%", height: "100%", border: "none", background: "#fff", borderRadius: "4px" }
};

export default CodeEditor;
