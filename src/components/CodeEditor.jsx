import React, { useState, useEffect, useRef } from "react";
import { updateUserProfile } from "../firebase";
import { increment } from "firebase/firestore";
import Editor from "react-simple-code-editor";
import { highlight, languages as prismLangs } from "prismjs/components/prism-core";

// 📚 ALL REQUIRED PRISM IMPORTS
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-java"; // Added Java
import "prismjs/components/prism-r";
import "prismjs/components/prism-markup"; // Handles HTML
import "prismjs/components/prism-css";
import "prismjs/themes/prism-tomorrow.css";

const RUN_LIMIT = 25;
const EXECUTION_TIMEOUT = 8000;

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language, starterCode }) => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState("READY");
  
  // Web Dev Preview State
  const [previewContent, setPreviewContent] = useState("");
  const isWebDev = language === "html" || language === "css";

  // Python Local Engine State
  const [pyodide, setPyodide] = useState(window.pyodideInstance || null);

  const successSound = useRef(new Audio("https://www.soundjay.com/misc/sounds/magic-chime-01.mp3"));

  // 🐍 PRELOAD PYTHON ONCE
  useEffect(() => {
    if (window.pyodideInstance) {
      setPyodide(window.pyodideInstance);
      if (language === "python") setStatus("PYTHON_READY");
      return;
    }

    const preload = async () => {
      try {
        if (language === "python") setStatus("BOOTING_PYTHON...");
        if (!window.loadPyodide) {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
          document.head.appendChild(s);
          await new Promise((r) => (s.onload = r));
        }
        const py = await window.loadPyodide();
        window.pyodideInstance = py;
        setPyodide(py);
        if (language === "python") setStatus("PYTHON_READY");
      } catch {
        if (language === "python") setStatus("ENGINE_ERROR");
      }
    };
    preload();
  }, [language]);

  // Sync editor when switching lessons/languages
  useEffect(() => {
    setCode(starterCode || "");
    setOutput("");
    setError("");
    setPreviewContent("");
    setStatus(isWebDev ? "LIVE_PREVIEW_READY" : language === "python" && pyodide ? "PYTHON_READY" : "REMOTE_ENGINE_READY");
  }, [starterCode, language, isWebDev, pyodide]);

  const executeWithTimeout = async (promise) => {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Execution timeout. Code took too long to run.")), EXECUTION_TIMEOUT)
    );
    return Promise.race([promise, timeout]);
  };

  const execute = async () => {
    if (!code.trim() || isRunning) return;

    if (!user?.isPro && (user?.dailyExecutions || 0) >= RUN_LIMIT) {
      setIsPaystackOpen(true);
      return;
    }

    setIsRunning(true);
    setOutput("SYSTEM: Compiling and Running...");
    setError("");

    try {
      let result = "";

      // 🌐 ROUTE 1: WEB DEV (HTML/CSS) -> Renders in Iframe
      if (isWebDev) {
        // If it's CSS, wrap it in a style tag so the browser renders it
        const injectedCode = language === "css" 
          ? `<style>${code}</style><div style="font-family:sans-serif; padding: 20px;"><h2>CSS Active</h2><p>This is a test element to visualize your CSS.</p></div>` 
          : code;
        
        setPreviewContent(injectedCode);
        result = "PREVIEW_UPDATED: UI Rendered Successfully.";
      }

      // 🐍 ROUTE 2: PYTHON (Local Pyodide)
      else if (language === "python" && pyodide) {
        await pyodide.runPythonAsync(`import sys, io\nsys.stdout = io.StringIO()`);
        await executeWithTimeout(pyodide.runPythonAsync(code));
        result = pyodide.runPython("sys.stdout.getvalue()");
      }

      // ☁️ ROUTE 3: REMOTE COMPILE (Java, Go, C, C++, JS, R) via Piston
      else {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), EXECUTION_TIMEOUT);

        // Normalize language names for Piston API
        let apiLang = language;
        if (language === "c++") apiLang = "cpp";

        const res = await fetch("https://emkc.org/api/v2/piston/execute", {
          method: "POST",
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: apiLang,
            version: "*",
            files: [{ content: code }]
          })
        });

        clearTimeout(id);
        if (!res.ok) throw new Error("Remote execution service unavailable.");

        const data = await res.json();
        if (!data?.run) throw new Error("Execution engine unreachable.");
        if (data.run.stderr) throw new Error(data.run.stderr);

        result = data.run.output || data.run.stdout || "Program executed with no output.";
      }

      // Success Sequence
      successSound.current.play().catch(() => {});
      setOutput(`${result}\n\n✨ +25 XP EARNED`);

      const nextRuns = (user?.dailyExecutions || 0) + 1;
      setUser((prev) => ({ ...prev, dailyExecutions: nextRuns, xp: (prev.xp || 0) + 25 }));
      updateUserProfile(user.uid, { dailyExecutions: nextRuns, xp: increment(25) });

    } catch (err) {
      setError(err.message || "Execution failed.");
    } finally {
      setIsRunning(false);
    }
  };

  // Map Prism syntax highlighting aliases
  const getPrismLanguage = (lang) => {
    const map = { html: "markup", "c++": "cpp", js: "javascript" };
    return prismLangs[map[lang] || lang] || prismLangs.javascript;
  };

  return (
    <div style={ui.container}>
      <div style={ui.header}>
        <span style={ui.tag}>{language.toUpperCase()} ENGINE | {status}</span>
      </div>

      <div style={ui.scrollArea}>
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(c) => highlight(c, getPrismLanguage(language))}
          padding={25}
          style={ui.editorFont}
        />
      </div>

      <div style={ui.footer}>
        <button onClick={execute} disabled={isRunning} style={ui.runBtn}>
          {isRunning ? "PROCESSING..." : isWebDev ? "RENDER PREVIEW" : "RUN CODE"}
        </button>
      </div>

      {/* DYNAMIC OUTPUT: Browser Preview for Web Dev, Terminal for everything else */}
      {isWebDev ? (
        <div style={ui.previewBox}>
          <div style={ui.terminalLabel}>LIVE BROWSER PREVIEW</div>
          <iframe 
            srcDoc={previewContent} 
            style={ui.iframe} 
            title="live-preview" 
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      ) : (
        <div style={ui.terminal}>
          <div style={ui.terminalLabel}>OUTPUT TERMINAL</div>
          <pre style={{...ui.terminalText, color: error ? "#ef4444" : "#22c55e"}}>
            {error ? `❌ ERROR:\n${error}` : output || "> ready_"}
          </pre>
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
  terminal: { height: "180px", background: "#020617", padding: "20px", borderTop: "1px solid #1e293b", overflowY: "auto" },
  previewBox: { height: "250px", background: "#fff", borderTop: "4px solid #1e293b", display: "flex", flexDirection: "column" },
  iframe: { width: "100%", flex: 1, border: "none", backgroundColor: "#fff" },
  terminalLabel: { fontSize: "9px", color: "#475569", fontWeight: "bold", marginBottom: "10px", padding: isWebDev ? "10px 20px 0" : "0" },
  terminalText: { margin: 0, fontSize: "13px", whiteSpace: "pre-wrap", fontFamily: '"Fira Code", monospace' }
};

export default CodeEditor;



