import React, { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages as prismLangs } from "prismjs/components/prism-core";

import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/themes/prism-tomorrow.css";

const CodeEditor = ({ language }) => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [pyodide, setPyodide] = useState(null);

  // Load Pyodide safely
  useEffect(() => {
    async function init() {
      if (window.loadPyodide) {
        const instance = await window.loadPyodide();
        setPyodide(instance);
      }
    }
    init();
  }, []);

  const execute = async () => {
    setIsRunning(true);
    setOutput("Running...");
    setError("");

    try {
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
      } else {
        const response = await fetch(
          "https://emkc.org/api/v2/piston/execute",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              language: language,
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
      setError(err.message);
    }

    setIsRunning(false);
  };

  return (
    <div style={{ background: "#000", color: "#fff", height: "100%" }}>
      <Editor
        value={code}
        onValueChange={setCode}
        highlight={(code) =>
          highlight(
            code,
            prismLangs[language] || prismLangs.python
          )
        }
        padding={20}
        style={{
          fontFamily: "monospace",
          fontSize: 14,
          minHeight: 200,
        }}
      />

      <button onClick={execute} disabled={isRunning}>
        {isRunning ? "Running..." : "Run"}
      </button>

      <pre style={{ color: error ? "red" : "lime" }}>
        {error || output}
      </pre>
    </div>
  );
};

export default CodeEditor;



