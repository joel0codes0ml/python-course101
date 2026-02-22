import React, { useState, useEffect, useRef } from "react";
import { updateUserProfile } from "../firebase";
import { increment } from "firebase/firestore";
import Editor from "react-simple-code-editor";
import { highlight, languages as prismLangs } from "prismjs/components/prism-core";

// Full Language Support
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
  // 1. ALWAYS START EMPTY (Ignored starterCode prop for a clean slate)
  const [code, setCode] = useState(""); 
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [pyodide, setPyodide] = useState(window.pyodideInstance || null);

  const isWebDev = language === "html" || language === "css";

  // Preload Python Engine
  useEffect(() => {
    if (language === "python" && !pyodide) {
      const loadPy = async () => {
        if (!window.loadPyodide) {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
          document.head.appendChild(s);
          await new Promise(r => s.onload = r);
        }
        const py = await window.loadPyodide();
        window.pyodideInstance = py;
        setPyodide(py);
      };
      loadPy();
    }
  }, [language, pyodide]);

  // Reset for new language selection
  useEffect(() => {
    setCode(""); 
    setOutput("");
    setError("");
    setPreviewContent("");
  }, [language]);

  const execute = async () => {
    if (!code.trim() || isRunning) return;

    setIsRunning(true);
    setOutput("Running...");
    setError("");

    try {
      // ENGINE 1: WEB (HTML/CSS)
      if (isWebDev) {
        setPreviewContent(language === "css" ? `<style>${code}</style>` : code);
        setOutput("Visual preview updated.");
      } 
      
      // ENGINE 2: PYTHON (Local)
      else if (language === "python" && pyodide) {
        await pyodide.runPythonAsync(`import sys, io\nsys.stdout = io.StringIO()`);
        await pyodide.runPythonAsync(code);
        const res = pyodide.runPython("sys.stdout.getvalue()");
        setOutput(res || "Program finished (no output).");
      } 

      // ENGINE 3: ALL OTHERS (Go, SQL, Java, C++, R, JS, C)
      else {
        const langConfig = {
          "c++": { id: "cpp", ver: "10.2.0" },
          "go": { id: "go", ver: "1.16.2" },
          "java": { id: "java", ver: "15.0.2" },
          "sqlite3": { id: "sql", ver: "3.35.4" },
          "sql": { id: "sql", ver: "3.35.4" },
          "r": { id: "r", ver: "4.0.2" },
          "javascript": { id: "javascript", ver: "15.10.0" },
          "c": { id: "c", ver: "10.2.0" }
        };

        const target = langConfig[language] || { id: language, ver: "*" };

        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: target.id,
            version: target.ver,
            files: [{ content: code }]
          })
        });

        const data = await response.json();

        if (data.run) {
          if (data.run.stderr) {
            setError(data.run.stderr);
          } else {
            // SHOW THE REAL OUTPUT
            setOutput(data.run.output || "Program finished (no output).");
          }
        }
      }

      // Record XP
      updateUserProfile(user.uid, { dailyExecutions: increment(1), xp: increment(25) });
      setUser(prev => ({ ...prev, dailyExecutions: (prev.dailyExecutions || 0) + 1, xp: (prev.xp || 0) + 25 }));

    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={ui.container}>
      <div style={ui.header}>
        <span style={ui.tag}>{language.toUpperCase()} ENGINE ACTIVE</span>
      </div>

      <div style={ui.scrollArea}>
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={c => highlight(c, prismLangs[language === 'html' ? 'markup' : language === 'c++' ? 'cpp' : language] || prismLangs.javascript)}
          padding={25}
          style={ui.editorFont}
          placeholder="// Type your code here..."
        />
      </div>

      <div style={ui.footer}>
        <button onClick={execute} disabled={isRunning} style={ui.runBtn}>
          {isRunning ? "..." : "RUN CODE"}
        </button>
      </div>

      <div style={ui.terminal}>
        <div style={ui.terminalLabel}>{isWebDev ? "BROWSER" : "OUTPUT"}</div>
        {isWebDev ? (
          <iframe srcDoc={previewContent} style={ui.iframe} title="p" />
        ) : (
          <pre style={{...ui.terminalText, color: error ? "#ef4444" : "#22c55e"}}>
            {error || output || "> ready_"}
          </pre>
        )}
      </div>
    </div>
  );
};

const ui = {
  container: { display: "flex", flexDirection: "column", height: "100%", backgroundColor: "#000" },
  header: { padding: "12px 20px", background: "#0f172a", borderBottom: "1px solid #1e293b" },
  tag: { fontSize: "10px", color: "#64748b", fontWeight: "900" },
  scrollArea: { flex: 1, overflowY: "auto" },
  editorFont: { fontFamily: 'monospace', fontSize: 15, color: "#fff" },
  footer: { padding: "15px 20px", borderTop: "1px solid #1e293b", textAlign: "right" },
  runBtn: { background: "#22c55e", color: "#000", padding: "10px 30px", borderRadius: "4px", fontWeight: "900", border: "none", cursor: "pointer" },
  terminal: { height: "200px", background: "#020617", padding: "20px", borderTop: "1px solid #1e293b", overflowY: "auto" },
  terminalLabel: { fontSize: "9px", color: "#475569", fontWeight: "bold" },
  terminalText: { margin: 0, fontSize: "13px", whiteSpace: "pre-wrap", fontFamily: 'monospace' },
  iframe: { width: "100%", height: "100%", border: "none", background: "#fff" }
};

export default CodeEditor;



