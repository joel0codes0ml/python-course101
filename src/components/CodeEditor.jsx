import React, { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages as prismLangs } from "prismjs/components/prism-core";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-r";

import "prismjs/themes/prism-tomorrow.css";

const CodeEditor = ({ language }) => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [pyodide, setPyodide] = useState(null);

  // Load Pyodide once (for Python)
  useEffect(() => {
    async function loadEngine() {
      if (window.loadPyodide) {
        try {
          const instance = await window.loadPyodide();
          setPyodide(instance);
        } catch (err) {
          console.error("Failed to load Pyodide:", err);
        }
      }
    }
    loadEngine();
  }, []);

  // Reset editor when language changes
  useEffect(() => {
    setCode("");
    setOutput("");
    setError("");
  }, [language]);

  const execute = async () => {
    setIsRunning(true);
    setOutput("⚙️ Running...");
    setError("");

    try {
      // PYTHON (Local via Pyodide)
      if (language === "python") {
        if (!pyodide) {
          setError("Python engine still loading...");
          setIsRunning(false);
          return;
        }

        pyodide.runPython(`
import sys, io
sys.stdout = io.StringIO()
        `);

        await pyodide.runPythonAsync(code);

        const result = pyodide.runPython("sys.stdout.getvalue()");
        setOutput(result || "Program finished.");
      }

      // OTHER LANGUAGES (Remote via Piston)
      else {
        const response = await fetch(
          "https://emkc.org/api/v2/piston/execute",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              language: language === "sqlite3" ? "sql" : language,
              version: "*",
              files: [{ content: code }],
            }),
          }
        );

        const data = await response.json();

        if (data.run.stderr) {
          setError(data.run.stderr);
        } else {
          setOutput(data.run.output || "Program finished.");
        }
      }
    } catch (err) {
      setError(err.message || "Execution error.");
    }

    setIsRunning(false);
  };

  return (
    <div style={ui.container}>
      <div style={ui.header}>
        {language.toUpperCase()} ENGINE
      </div>

      <div style={ui.editorWrapper}>
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(code) =>
            highlight(
              code,
              prismLangs[language === "sqlite3" ? "sql" : language] ||
                prismLangs.python
            )
          }
          padding={20}
          style={ui.editor}
        />
      </div>

      <div style={ui.buttonArea}>
        <button onClick={execute} disabled={isRunning} style={ui.button}>
          {isRunning ? "Running..." : "Run Code"}
        </button>
      </div>

      <div style={ui.terminal}>
        <div style={ui.terminalLabel}>TERMINAL</div>

        {output && (
          <pre style={ui.stdout}>{output}</pre>
        )}

        {error && (
          <pre style={ui.stderr}>{error}</pre>
        )}

        {!output && !error && (
          <pre style={ui.idle}>{"> Ready..."}</pre>
        )}
      </div>
    </div>
  );
};

const ui = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#000",
    borderLeft: "1px solid #1e293b",
  },
  header: {
    padding: "12px 20px",
    backgroundColor: "#0f172a",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "bold",
    borderBottom: "1px solid #1e293b",
  },
  editorWrapper: {
    flex: 1,
    overflowY: "auto",
  },
  editor: {
    fontFamily: '"Fira Code", monospace',
    fontSize: 14,
    minHeight: "100%",
    backgroundColor: "#000",
    color: "#fff",
  },
  buttonArea: {
    padding: "15px 20px",
    borderTop: "1px solid #1e293b",
    backgroundColor: "#000",
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    backgroundColor: "#22c55e",
    color: "#000",
    border: "none",
    padding: "10px 25px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  terminal: {
    height: "200px",
    backgroundColor: "#020617",
    borderTop: "1px solid #1e293b",
    padding: "20px",
    overflowY: "auto",
  },
  terminalLabel: {
    fontSize: "10px",
    fontWeight: "bold",
    color: "#475569",
    marginBottom: "10px",
  },
  stdout: {
    color: "#22c55e",
    whiteSpace: "pre-wrap",
    margin: 0,
  },
  stderr: {
    color: "#ef4444",
    whiteSpace: "pre-wrap",
    margin: 0,
  },
  idle: {
    color: "#64748b",
    whiteSpace: "pre-wrap",
    margin: 0,
  },
};

export default CodeEditor;



