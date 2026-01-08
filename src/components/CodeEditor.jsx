import React, { useState, useEffect, useRef } from 'react';
import { updateUserProfile } from "../firebase";

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language, starterCode, expectedOutput }) => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    setCode(starterCode || "");
    setOutput("");
    setError("");
  }, [starterCode, language]);

  // SYNTAX HIGHLIGHTING LOGIC (Coddy Style)
  const highlightCode = (input) => {
    if (!input) return "";
    return input
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") // Escape HTML
      .replace(/\b(def|function|return|if|else|for|while|import|from|class|try|except|let|const|var)\b/g, '<span style="color: #ff79c6;">$1</span>') // Keywords (Pink)
      .replace(/\b(print|console|log|len|range|str|int|float|bool)\b/g, '<span style="color: #50fa7b;">$1</span>') // Functions (Green)
      .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span style="color: #f1fa8c;">$&</span>') // Strings (Yellow)
      .replace(/\b(True|False|None|true|false|null)\b/g, '<span style="color: #bd93f9;">$1</span>') // Bools/Nulls (Purple)
      .replace(/\b\d+\b/g, '<span style="color: #bd93f9;">$&</span>') // Numbers (Purple)
      .replace(/#.*$/gm, '<span style="color: #6272a4;">$&</span>'); // Comments (Grey)
  };

  const execute = async () => {
    if (!user?.isPro && (user?.dailyExecutions || 0) >= 12) {
      setIsPaystackOpen(true);
      return;
    }

    setIsRunning(true);
    setError("");
    setOutput("🚀 SYSTEM: EXECUTING...");

    const langMap = { 'sqlite3': 'sql', 'python': 'python', 'c': 'c', 'cpp': 'cpp', 'go': 'go' };
    const engineLang = langMap[language] || language;

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: engineLang,
          version: "*",
          files: [{ content: code }]
        }),
      });

      const data = await response.json();
      const run = data.run;

      if (run.stderr) {
        setError(run.stderr);
        setOutput("");
      } else {
        const userResult = run.output.trim();
        const goal = expectedOutput ? expectedOutput.trim() : "";

        if (goal && userResult === goal) {
          setOutput(`✅ SUCCESS! +20 XP\n\n${userResult}`);
          const updates = { 
            xp: (user?.xp || 0) + 20, 
            dailyExecutions: (user?.dailyExecutions || 0) + 1,
            lastExecutionDate: new Date().toDateString()
          };
          setUser(prev => ({ ...prev, ...updates }));
          await updateUserProfile(user.uid, updates);
        } else {
          setOutput(userResult || "Code executed with no output.");
        }
      }
    } catch (err) {
      setError("Engine timeout. Check connection.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={ui.container}>
      {/* EDITOR SECTION */}
      <div style={ui.editorWrapper}>
        <div 
          style={ui.highlighter} 
          dangerouslySetInnerHTML={{ __html: highlightCode(code) + "\n" }} 
        />
        <textarea 
          value={code} 
          onChange={(e) => setCode(e.target.value)} 
          onScroll={(e) => {
             const h = e.target.parentElement.firstChild;
             h.scrollTop = e.target.scrollTop;
             h.scrollLeft = e.target.scrollLeft;
          }}
          style={ui.textarea} 
          spellCheck="false"
        />
        <button onClick={execute} disabled={isRunning} style={ui.runBtn}>
          {isRunning ? "..." : "RUN"}
        </button>
      </div>

      {/* DASHBOARD (BOTTOM) */}
      <div style={ui.dashboard}>
        <div style={ui.dashHeader}>TERMINAL_DASHBOARD</div>
        <div style={ui.outputArea}>
          {error ? (
            <pre style={ui.errorText}>⚠️ LOGIC_ERROR:{"\n"}{error}</pre>
          ) : (
            <pre style={ui.successText}>{output || "Ready for input..."}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

const ui = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#000' },
  editorWrapper: { flex: 1, position: 'relative', overflow: 'hidden' },
  highlighter: { 
    position: 'absolute', inset: 0, padding: '25px', color: '#f8f8f2', 
    fontFamily: 'monospace', fontSize: '15px', whiteSpace: 'pre-wrap', 
    pointerEvents: 'none', overflow: 'hidden', lineHeight: '1.6' 
  },
  textarea: { 
    width: '100%', height: '100%', backgroundColor: 'transparent', color: 'transparent', 
    padding: '25px', border: 'none', fontFamily: 'monospace', fontSize: '15px', 
    outline: 'none', resize: 'none', caretColor: '#fff', position: 'relative', 
    zIndex: 1, lineHeight: '1.6', whiteSpace: 'pre-wrap' 
  },
  runBtn: { 
    position: 'absolute', bottom: '15px', right: '15px', padding: '8px 20px', 
    backgroundColor: '#22c55e', color: '#000', fontWeight: '900', border: 'none', 
    borderRadius: '4px', cursor: 'pointer', zIndex: 10, fontSize: '11px' 
  },
  dashboard: { height: '160px', backgroundColor: '#020617', borderTop: '2px solid #1e293b' },
  dashHeader: { padding: '8px 20px', fontSize: '9px', color: '#475569', fontWeight: 'bold' },
  outputArea: { padding: '15px 20px', height: '120px', overflowY: 'auto' },
  errorText: { margin: 0, color: '#ff5555', fontSize: '13px', fontFamily: 'monospace' },
  successText: { margin: 0, color: '#50fa7b', fontSize: '13px', fontFamily: 'monospace' }
};

export default CodeEditor;
