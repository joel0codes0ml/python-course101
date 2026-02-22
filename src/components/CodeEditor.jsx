import React, { useState, useEffect, useRef } from "react";
import { updateUserProfile } from "../firebase";
import { increment } from "firebase/firestore";
import Editor from "react-simple-code-editor";
import { highlight, languages as prismLangs } from "prismjs/components/prism-core";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-r";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/themes/prism-tomorrow.css";

const RUN_LIMIT = 25;
const EXECUTION_TIMEOUT = 8000;

const CodeEditor = ({
  user,
  setUser,
  setIsPaystackOpen,
  language,
  starterCode
}) => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const [pyodide, setPyodide] = useState(window.pyodideInstance || null);
  const [status, setStatus] = useState("READY");

  const successSound = useRef(
    new Audio("https://www.soundjay.com/misc/sounds/magic-chime-01.mp3")
  );

  // 🚀 PRELOAD PYODIDE ONCE (not per language switch)
  useEffect(() => {
    if (window.pyodideInstance) {
      setPyodide(window.pyodideInstance);
      setStatus("PYTHON_READY");
      return;
    }

    const preload = async () => {
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
  }, []);

  useEffect(() => {
    setCode(starterCode || "");
    setOutput("");
    setError("");
  }, [starterCode, language]);

  const executeWithTimeout = async (promise) => {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Execution timeout.")), EXECUTION_TIMEOUT)
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
    setOutput("SYSTEM: Running...");
    setError("");

    try {
      let result = "";

      // 🐍 PYTHON (local)
      if (language === "python" && pyodide) {
        await pyodide.runPythonAsync(`
import sys, io
sys.stdout = io.StringIO()
        `);

        await executeWithTimeout(pyodide.runPythonAsync(code));

        result = pyodide.runPython("sys.stdout.getvalue()");
      }

      // 🌐 HTML / CSS
      else if (language === "html" || language === "css") {
        result = "PREVIEW_UPDATED";
      }

      // ☁️ Remote Execution (Piston)
      else {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), EXECUTION_TIMEOUT);

        const res = await fetch("https://emkc.org/api/v2/piston/execute", {
          method: "POST",
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: language === "sqlite3" ? "sql" : language,
            version: "*",
            files: [{ content: code }]
          })
        });

        clearTimeout(id);

        if (!res.ok) throw new Error("Execution service unavailable.");

        const data = await res.json();

        if (!data?.run)
          throw new Error("Execution engine unreachable.");

        if (data.run.stderr)
          throw new Error(data.run.stderr);

        result =
          data.run.output ||
          data.run.stdout ||
          "Program executed with no output.";
      }

      successSound.current.play().catch(() => {});

      setOutput(`${result}\n\n✨ +25 XP`);

      const nextRuns = (user?.dailyExecutions || 0) + 1;

      setUser((prev) => ({
        ...prev,
        dailyExecutions: nextRuns,
        xp: (prev.xp || 0) + 25
      }));

      updateUserProfile(user.uid, {
        dailyExecutions: nextRuns,
        xp: increment(25)
      });
    } catch (err) {
      setError(err.message || "Execution failed.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={ui.container}>
      <div style={ui.header}>
        <span style={ui.tag}>
          {language.toUpperCase()} ENGINE | {status}
        </span>
      </div>

      <div style={ui.scrollArea}>
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(c) =>
            highlight(
              c,
              prismLangs[
                language === "sqlite3"
                  ? "sql"
                  : language === "html"
                  ? "markup"
                  : language
              ] || prismLangs.js
            )
          }
          padding={25}
          style={ui.editorFont}
        />
      </div>

      <div style={ui.footer}>
        <button
          onClick={execute}
          disabled={isRunning}
          style={ui.runBtn}
        >
          {isRunning ? "PROCESSING..." : "RUN CODE"}
        </button>
      </div>

      <div style={ui.terminal}>
        <div style={ui.terminalLabel}>OUTPUT TERMINAL</div>
        <pre
          style={{
            color: error ? "#ef4444" : "#22c55e",
            margin: 0,
            fontSize: "13px",
            whiteSpace: "pre-wrap",
            fontFamily: '"Fira Code", monospace'
          }}
        >
          {error ? `❌ ERROR: ${error}` : output || "> ready_"}
        </pre>
      </div>
    </div>
  );
};

const ui = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#000"
  },
  header: {
    padding: "12px 20px",
    background: "#0f172a",
    borderBottom: "1px solid #1e293b"
  },
  tag: {
    fontSize: "10px",
    color: "#64748b",
    fontWeight: "900",
    letterSpacing: "1px"
  },
  scrollArea: { flex: 1, overflowY: "auto" },
  editorFont: {
    fontFamily: '"Fira Code", monospace',
    fontSize: 15,
    color: "#fff"
  },
  footer: {
    padding: "15px 20px",
    borderTop: "1px solid #1e293b",
    textAlign: "right",
    background: "#000"
  },
  runBtn: {
    background: "#22c55e",
    color: "#000",
    padding: "10px 30px",
    borderRadius: "4px",
    fontWeight: "900",
    border: "none",
    cursor: "pointer"
  },
  terminal: {
    height: "180px",
    background: "#020617",
    padding: "20px",
    borderTop: "1px solid #1e293b",
    overflowY: "auto"
  },
  terminalLabel: {
    fontSize: "9px",
    color: "#475569",
    fontWeight: "bold",
    marginBottom: "10px"
  }
};

export default CodeEditor;



