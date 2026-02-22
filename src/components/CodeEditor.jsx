import React, { useState, useEffect, useRef } from "react";
import { updateUserProfile } from "../firebase";
import { increment } from "firebase/firestore";
import Editor from "react-simple-code-editor";
import { highlight, languages as prismLangs } from "prismjs/components/prism-core";

// Highlighting Support
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

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language, starterCode }) => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [pyodide, setPyodide] = useState(window.pyodideInstance || null);

  const isWebDev = language === "html" || language === "css";

  // 1. ENGINE PRELOADER (Python Specific)
  useEffect(() => {
    if (language === "python" && !pyodide) {
      const loadPy = async () => {
        try {
          if (!window.loadPyodide) {
            const s = document.createElement("script");
            s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
            document.head.appendChild(s);
            await new Promise(r => s.onload = r);
          }
          const py = await window.loadPyodide();
          window.pyodideInstance = py;
          setPyodide(py);
        } catch (e) {
          console.error("Python load failed", e);
        }
      };
      loadPy();
    }
  }, [language, pyodide]);

  // 2. STARTER CODE SYNC
  useEffect(() => {
    setCode(starterCode || "");
    setOutput("");
    setError("");
    setPreviewContent("");
  }, [starterCode, language]);

  // 3. SMART EXECUTION ROUTER
  const execute = async () => {
    if (!code.trim() || isRunning) return;

    // Safety: Run Limit Check
    if (!user?.isPro && (user?.dailyExecutions || 0) >= 25) {
      setIsPaystackOpen(true);
      return;
    }

    setIsRunning(true);
    setOutput("⚙️ SYSTEM: Initializing...");
    setError("");

    try {
      let result = "";

      // PATH A: WEB DEV (HTML/CSS)
      if (isWebDev) {
        const doc = language === "css" 
          ? `<style>${code}</style><div style="padding:20px; font-family:sans-serif;"><h1>Preview Mode</h1><p>CSS styles are now active on this frame.</p></div>` 
          : code;
        setPreviewContent(doc);
        result = "UI Updated Successfully.";
      } 
      
      // PATH B: PYTHON (Local Engine)
      else if (language === "python") {
        if (!pyodide) throw new Error("Python engine is still loading. Please wait 5 seconds.");
        await pyodide.runPythonAsync(`import sys, io\nsys.stdout = io.StringIO()`);
        await pyodide.runPythonAsync(code);
        result = pyodide.runPython("sys.stdout.getvalue()");
      } 
      
      // PATH C: COMPILED & REMOTE (Java, Go, C, C++, R, JS)
      else {
        // Correcting language keys for Piston API
        const pistonMap = {
          "c++": "cpp",
          "javascript": "javascript",
          "java": "java",
          "go": "go",
          "r": "r",
          "c": "c",
          "sqlite3": "sql"
        };

        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: pistonMap[language] || language,
            version: "*",
            files: [{ content: code }]
          })
        });

        const data = await response.json();

        if (data.run) {
          if (data.run.stderr) {
            setError(data.run.stderr);
          } else {
            result = data.run.output || data.run.stdout || "Program finished with no output.";
          }
        } else {
          throw new Error("Execution engine returned an invalid response.");
        }
      }

      if (result) setOutput(result);

      // 4. DATABASE SYNC (XP & Daily Count)
      updateUserProfile(user.uid, { 
        dailyExecutions: increment(1), 
        xp: increment(25) 
      });
      
      setUser(prev => ({ 
        ...prev, 
        dailyExecutions: (prev.dailyExecutions || 0) + 1, 
        xp: (prev.xp || 0) + 25 
      }));

    } catch (err) {
      setError(err.message || "An unknown execution error occurred.");
    } finally {
      setIsRunning(false);
    }
  };

  // Helper for syntax highlighting
  const getHighlight = (code) => {
    const map = { "c++": "cpp", html: "markup" };
    const lang = map[language] || language;
    return highlight(code, prismLangs[lang] || prismLangs.javascript);
  };

  return (
    <div style={ui.container}>
      <div style={ui.header}>
        <span style={ui.tag}>{language.toUpperCase()} WORKSPACE</span>
      </div>

      <div style={ui.scrollArea}>
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={getHighlight}
          padding={25}
          style={ui.editorFont}
        />
      </div>

      <div style={ui.footer}>
        <button onClick={execute} disabled={isRunning} style={ui.runBtn}>
          {isRunning ? "PROCESSING..." : "RUN CODE"}
        </button>
      </div>

      <div style={ui.terminal}>
        <div style={ui.terminalLabel}>{isWebDev ? "LIVE PREVIEW" : "TERMINAL"}</div>
        {isWebDev ? (
          <iframe srcDoc={previewContent} style={ui.iframe} title="live-ui" sandbox="allow-scripts" />
        ) : (
          <pre style={{...ui.terminalText, color: error ? "#ef4444" : "#22c55e"}}>
            {error ? `❌ ERROR:\n${error}` : output || "> ready_"}
          </pre>
        )}
      </div>
    </div>
  );
};

const ui = {
  container: { display: "flex", flexDirection: "column", height: "100%", backgroundColor: "#000" },
  header: { padding: "12px 20px", background: "#0f172a", borderBottom: "1px solid #1e293b" },
  tag: { fontSize: "10px", color: "#64748b", fontWeight: "900", letterSpacing: "1px" },
  scrollArea: { flex: 1, overflowY: "auto" },
  editorFont: { fontFamily: '"Fira Code", monospace', fontSize: 15, color: "#fff" },
  footer: { padding: "15px 20px", borderTop: "1px solid #1e293b", textAlign: "right", background: "#000" },
  runBtn: { background: "#22c55e", color: "#000", padding: "10px 30px", borderRadius: "4px", fontWeight: "900", border: "none", cursor: "pointer" },
  terminal: { height: "220px", background: "#020617", padding: "20px", borderTop: "1px solid #1e293b", overflowY: "auto" },
  terminalLabel: { fontSize: "9px", color: "#475569", fontWeight: "bold", marginBottom: "10px" },
  terminalText: { margin: 0, fontSize: "13px", whiteSpace: "pre-wrap", fontFamily: '"Fira Code", monospace' },
  iframe: { width: "100%", height: "100%", border: "none", background: "#fff", borderRadius: "4px" }
};

export default CodeEditor;



