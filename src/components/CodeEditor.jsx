import React, { useState, useEffect, useRef } from "react";
import { updateUserProfile } from "../firebase";
import { increment, arrayUnion } from "firebase/firestore";

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

const SECTOR_MAP = {
  python: "data",
  r: "data",
  sqlite3: "data",
  html: "web",
  css: "web",
  c: "sys",
  cpp: "sys",
  go: "sys",
};

const normalize = (str = "") =>
  str.trim().replace(/\r\n/g, "\n");

const CodeEditor = ({
  user,
  setUser,
  setIsPaystackOpen,
  language,
  starterCode,
  expectedOutput,
  challengeId,
}) => {
  const [code, setCode] = useState("");
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [pyodide, setPyodide] = useState(null);

  const successSoundRef = useRef(null);

  // Initialize success sound once
  useEffect(() => {
    successSoundRef.current = new Audio(
      "https://www.soundjay.com/misc/sounds/magic-chime-01.mp3"
    );
    successSoundRef.current.volume = 0.4;
  }, []);

  // Load Pyodide for Python
  useEffect(() => {
    async function initPy() {
      if (window.loadPyodide && !pyodide) {
        try {
          const instance = await window.loadPyodide();
          setPyodide(instance);
        } catch (e) {
          console.error("Pyodide failed to load", e);
        }
      }
    }
    initPy();
  }, []);

  useEffect(() => {
    setCode(starterCode || "");
    setStdout("");
    setStderr("");
  }, [starterCode, language]);

  // UNIVERSAL EXECUTION ENGINE
  const runCode = async () => {
    try {
      if (language === "python") {
        if (!pyodide) {
          return { success: false, stderr: "Engine warming up..." };
        }

        pyodide.runPython(`
import sys, io
sys.stdout = io.StringIO()
        `);

        try {
          await pyodide.runPythonAsync(code);
        } catch (err) {
          return { success: false, stderr: err.message };
        }

        const output = pyodide.runPython("sys.stdout.getvalue()");
        return { success: true, stdout: output };
      }

      // Remote execution for other languages
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
        return { success: false, stderr: data.run.stderr };
      }

      return { success: true, stdout: data.run.output };

    } catch (err) {
      return { success: false, stderr: "API connection error." };
    }
  };

  const execute = async () => {
    if (!code.trim()) {
      setStderr("⚠️ Editor is empty.");
      return;
    }

    if (!user?.isPro && (user?.dailyExecutions || 0) >= 25) {
      setStderr("⛔ Daily limit reached.");
      setIsPaystackOpen(true);
      return;
    }

    setIsRunning(true);
    setStdout("⚙️ Running...");
    setStderr("");

    const result = await runCode();

    if (!result.success) {
      setStdout("");
      setStderr(result.stderr);
      setIsRunning(false);
      return;
    }

    const cleanedResult = normalize(result.stdout);
    const cleanedExpected = normalize(expectedOutput);

    const isCorrect = expectedOutput
      ? cleanedResult === cleanedExpected
      : true;

    setStdout(result.stdout);

    if (!isCorrect) {
      setStderr("❌ Output does not match expected result.");
      setIsRunning(false);
      return;
    }

    if (challengeId && user?.completedChallenges?.includes(challengeId)) {
      setStdout(result.stdout + "\n\n✅ Already completed.");
      setIsRunning(false);
      return;
    }

    successSoundRef.current?.play();

    const nextRuns = (user?.dailyExecutions || 0) + 1;
    const sector = SECTOR_MAP[language] || "web";
    const currentProgress = user?.sectorProgress?.[sector] || 0;
    const newProgress = Math.min(100, currentProgress + 5);

    const updates = {
      dailyExecutions: nextRuns,
      xp: increment(25),
      [`sectorProgress.${sector}`]: newProgress,
    };

    if (challengeId) {
      updates.completedChallenges = arrayUnion(challengeId);
    }

    setUser((prev) => ({
      ...prev,
      dailyExecutions: nextRuns,
      xp: (prev.xp || 0) + 25,
      sectorProgress: {
        ...prev.sectorProgress,
        [sector]: newProgress,
      },
      completedChallenges: challengeId
        ? [...(prev.completedChallenges || []), challengeId]
        : prev.completedChallenges,
    }));

    await updateUserProfile(user.uid, updates);

    setStdout(result.stdout + "\n\n✨ CHALLENGE COMPLETE! +25 XP");
    setIsRunning(false);
  };

  return (
    <div style={ui.container}>
      <div style={ui.editorHeader}>
        <span style={ui.langTag}>
          {language.toUpperCase()} ENGINE ACTIVE
        </span>
        {language === "python" && !pyodide && (
          <span style={ui.loadingEngine}> (WARMING UP...)</span>
        )}
      </div>

      <div style={ui.scrollArea}>
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(code) =>
            highlight(
              code,
              prismLangs[language === "sqlite3" ? "sql" : language] ||
                prismLangs.python ||
                prismLangs.js
            )
          }
          padding={25}
          style={ui.editorFont}
        />
      </div>

      <div style={ui.footer}>
        <button
          onClick={execute}
          disabled={isRunning || (language === "python" && !pyodide)}
          style={ui.runBtn}
        >
          {isRunning ? "PROCESSING..." : "EXECUTE CODE"}
        </button>
      </div>

      <div style={ui.outputBox}>
        <div style={ui.terminalLabel}>TERMINAL</div>

        {stdout && <pre style={ui.stdout}>{stdout}</pre>}
        {stderr && <pre style={ui.stderr}>{stderr}</pre>}

        {!stdout && !stderr && (
          <pre style={ui.stdout}>{"> Ready for input..."}</pre>
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
  editorHeader: {
    padding: "12px 20px",
    backgroundColor: "#0f172a",
    borderBottom: "1px solid #1e293b",
  },
  langTag: {
    fontSize: "10px",
    fontWeight: "900",
    color: "#64748b",
    letterSpacing: "2px",
  },
  loadingEngine: {
    fontSize: "9px",
    color: "#f59e0b",
    fontWeight: "bold",
  },
  scrollArea: {
    flex: 1,
    overflowY: "auto",
    backgroundColor: "#000",
  },
  editorFont: {
    fontFamily: '"Fira Code", monospace',
    fontSize: 15,
    minHeight: "100%",
    color: "#fff",
  },
  footer: {
    padding: "15px 20px",
    borderTop: "1px solid #1e293b",
    backgroundColor: "#000",
    display: "flex",
    justifyContent: "flex-end",
  },
  runBtn: {
    backgroundColor: "#22c55e",
    color: "#000",
    border: "none",
    padding: "10px 25px",
    borderRadius: "6px",
    fontWeight: "900",
    cursor: "pointer",
    fontSize: "12px",
  },
  outputBox: {
    height: "200px",
    backgroundColor: "#020617",
    borderTop: "1px solid #1e293b",
    padding: "20px",
    overflowY: "auto",
  },
  terminalLabel: {
    fontSize: "9px",
    fontWeight: "900",
    color: "#475569",
    marginBottom: "10px",
    letterSpacing: "1px",
  },
  stdout: {
    color: "#22c55e",
    whiteSpace: "pre-wrap",
    margin: 0,
    fontSize: "13px",
  },
  stderr: {
    color: "#ef4444",
    whiteSpace: "pre-wrap",
    margin: 0,
    fontSize: "13px",
  },
};

export default CodeEditor;



