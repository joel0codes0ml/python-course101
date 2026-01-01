import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";

/**
 * CodeEditor
 * - Language-aware editor
 * - Runs code via execution API
 * - Displays output & errors
 * - Designed for lesson validation + AI hints
 */
export default function CodeEditor({
  language = "python",
  starterCode = "",
  expectedOutput = "",
  solution = ""
}) {
  const editorRef = useRef(null);

  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  function handleEditorMount(editor) {
    editorRef.current = editor;
  }

  async function runCode() {
    setIsRunning(true);
    setOutput("");
    setError("");
    setShowSolution(false);

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          code
        })
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error);
        return;
      }

      setOutput(result.output);

      if (expectedOutput && result.output.trim() !== expectedOutput.trim()) {
        setError("Output does not match expected result.");
      }
    } catch (err) {
      setError("Execution service unavailable.");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.editor}>
        <Editor
          height="100%"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorMount}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true
          }}
        />
      </div>

      <div style={styles.controls}>
        <button onClick={runCode} disabled={isRunning} style={styles.runBtn}>
          {isRunning ? "Running..." : "Run Code"}
        </button>

        {error && (
          <button
            onClick={() => setShowSolution(true)}
            style={styles.solutionBtn}
          >
            Reveal Solution
          </button>
        )}
      </div>

      <div style={styles.output}>
        <h4>Output</h4>
        <pre>{output || "—"}</pre>
      </div>

      {error && (
        <div style={styles.error}>
          <h4>Error</h4>
          <pre>{error}</pre>
        </div>
      )}

      {showSolution && (
        <div style={styles.solution}>
          <h4>Solution</h4>
          <pre>{solution}</pre>
        </div>
      )}
    </div>
  );
}

/**
 * Inline styles kept minimal on purpose.
 * We’ll replace with Tailwind / theme system later.
 */
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "#0f0f0f"
  },
  editor: {
    flex: 1,
    borderBottom: "1px solid #222"
  },
  controls: {
    display: "flex",
    gap: "10px",
    padding: "10px",
    background: "#111"
  },
  runBtn: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    cursor: "pointer"
  },
  solutionBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    cursor: "pointer"
  },
  output: {
    padding: "10px",
    color: "#22c55e",
    background: "#000"
  },
  error: {
    padding: "10px",
    color: "#ef4444",
    background: "#000"
  },
  solution: {
    padding: "10px",
    background: "#020617",
    color: "#38bdf8"
  }
};

