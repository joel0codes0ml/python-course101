import React, { useState, useEffect, useRef } from "react";
import { updateUserProfile } from "../firebase";
import { increment } from "firebase/firestore";
import Editor from "react-simple-code-editor";
import { highlight, languages as prismLangs } from "prismjs/components/prism-core";

// 📚 ORDER MATTERS: Load core before specific languages
import "prismjs/components/prism-clike";
import "prismjs/components/prism-markup"; // HTML
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

const RUN_LIMIT = 25;
const EXECUTION_TIMEOUT = 8000;

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language, starterCode }) => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState("READY");
  const [previewContent, setPreviewContent] = useState("");

  const isWebDev = language === "html" || language === "css";
  const [pyodide, setPyodide] = useState(window.pyodideInstance || null);
  const successSound = useRef(new Audio("https://www.soundjay.com/misc/sounds/magic-chime-01.mp3"));

  useEffect(() => {
    if (window.pyodideInstance) {
      setPyodide(window.pyodideInstance);
      if (language === "python") setStatus("PYTHON_READY");
      return;
    }

    const preload = async () => {
      if (language !== "python") return;
      try {
        setStatus("BOOTING_PYTHON...");
        if (!window.loadPyodide) {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
          document.head.appendChild(s);
          await new Promise((r) => (s.onload = r));
        }
        const py = await window.loadPyodide();
        window.pyodideInstance = py;
        setPyodide(py);
        setStatus("PYTHON_READY");
      } catch {
        setStatus("ENGINE_ERROR");
      }
    };
    preload();
  }, [language]);

  useEffect(() => {
    setCode(starterCode || "");
    setOutput("");
    setError("");
    setPreviewContent("");
    setStatus(isWebDev ? "LIVE_PREVIEW" : language === "python" ? (pyodide ? "PYTHON_READY" : "BOOTING...") : "REMOTE_ENGINE");
  }, [starterCode, language, isWebDev, pyodide]);

  const execute = async () => {
    if (!code.trim() || isRunning) return;
    if (!user?.isPro && (user?.dailyExecutions || 0) >= RUN_LIMIT) {
      setIsPaystackOpen(true);
      return;
    }

    setIsRunning(true);
    setOutput("SYSTEM: Executing...");
    setError("");

    try {
      let result = "";
      if (isWebDev) {
        setPreviewContent(language === "css" ? `<style>${code}</style><div style="padding:20px"><h1>Preview Mode</h1><p>Styling applied.</p></div>` : code);
        result = "UI UPDATED";
      } else if (language === "python" && pyodide) {
        await pyodide.runPythonAsync(`import sys, io\nsys.stdout = io.StringIO()`);
        await pyodide.runPythonAsync(code);
        result = pyodide.runPython("sys.stdout.getvalue()");
      } else {
        const res = await fetch("https://emkc.org/api/v2/piston/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: language === "c++" ? "cpp" : language === "sqlite3" ? "sql" : language,
            version: "*",
            files: [{ content: code }]
          })
        });
        const data = await res.json();
        if (data.run?.stderr) throw new Error(data.run.stderr);
        result = data.run?.output || "Done.";
      }

      successSound.current.play().catch(() => {});
      setOutput(`${result}\n\n✨ +25 XP`);
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
      <div style={ui.header}><span style={ui.tag}>{language.toUpperCase()} ENGINE | {status}</span></div>
      <div style={ui.scrollArea}>
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(c) => highlight(c, prismLangs[language === 'html' ? 'markup' : language === 'c++' ? 'cpp' : language] || prismLangs.javascript)}
          padding={25}
          style={ui.editorFont}
        />
      </div>
      <div style={ui.footer}>
        <button onClick={execute} disabled={isRunning} style={ui.runBtn}>{isRunning ? "..." : "RUN CODE"}</button>
      </div>
      {isWebDev ? (
        <div style={ui.terminal}>
            <div style={ui.terminalLabel}>BROWSER PREVIEW</div>
            <iframe srcDoc={previewContent} style={{ width: "100%", height: "100%", border: "none", background: "#fff" }} title="preview" />
        </div>
      ) : (
        <div style={ui.terminal}>
          <div style={ui.terminalLabel}>TERMINAL</div>
          <pre style={{...ui.terminalText, color: error ? "#ef4444" : "#22c55e"}}>{error || output || "> ready_"}</pre>
        </div>
      )}
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
  terminal: { height: "200px", background: "#020617", padding: "20px", borderTop: "1px solid #1e293b", overflowY: "auto" },
  terminalLabel: { fontSize: "9px", color: "#475569", fontWeight: "bold", marginBottom: "10px" },
  terminalText: { margin: 0, fontSize: "13px", whiteSpace: "pre-wrap", fontFamily: '"Fira Code", monospace' }
};

export default CodeEditor;



