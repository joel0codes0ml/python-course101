import React, { useState, useEffect, useRef } from 'react';
import { updateUserProfile } from "../firebase";

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language, starterCode, expectedOutput }) => {
  const [code, setCode] = useState(starterCode || "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (starterCode) setCode(starterCode);
    setOutput("");
    setError("");
  }, [starterCode, language]);

  // CODDY THEME COLORS
  const highlightCode = (input) => {
    if (!input) return "";
    let text = input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return text
      .replace(/\b(def|return|if|else|for|while|import|from|class|try|except|let|const|var|function|async|await)\b/g, '<span style="color: #ff79c6;">$1</span>') // Keywords
      .replace(/\b(print|console|log|len|range|str|int|float|bool|input|map|filter)\b/g, '<span style="color: #50fa7b;">$1</span>') // Functions
      .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span style="color: #f1fa8c;">$&</span>') // Strings
      .replace(/\b(True|False|None|true|false|null)\b/g, '<span style="color: #bd93f9;">$1</span>') // Bools
      .replace(/\b\d+\b/g, '<span style="color: #bd93f9;">$&</span>') // Numbers
      .replace(/#.*$/gm, '<span style="color: #6272a4; font-style: italic;">$&</span>'); // Comments
  };

  const handleScroll = (e) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = e.target.scrollTop;
      scrollRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  const execute = async () => {
    const currentRuns = user?.dailyExecutions || 0;
    if (!user?.isPro && currentRuns >= 12) {
      setIsPaystackOpen(true);
      return; 
    }

    setIsRunning(true);
    setOutput("SYSTEM: Executing...");
    setError("");

    const langMap = { 'sqlite3': 'sql', 'python': 'python', 'c': 'c', 'cpp': 'cpp', 'go': 'go' };
    const engineLang = langMap[language] || language;

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: engineLang,
          version: "*",
          files: [{ content: code }],
        }),
      });

      const data = await response.json();
      const run = data.run;
      const nextRuns = currentRuns + 1;

      // Local update + Background Sync
      setUser(prev => ({ ...prev, dailyExecutions: nextRuns }));
      updateUserProfile(user.uid, { dailyExecutions: nextRuns }).catch(e => console.error(e));

      if (run.stderr) {
        setError(run.stderr);
        setOutput("");
      } else {
        const userResult = run.output.trim();
        const goal = expectedOutput ? expectedOutput.trim() : "";

        if (goal && userResult === goal) {
          setOutput(`✅ SUCCESS! +20 XP\n\n${userResult}`);
          const newXP = (user?.xp || 0) + 20;
          setUser(prev => ({ ...prev, xp: newXP }));
          updateUserProfile(user.uid, { xp: newXP });
        } else {
          setOutput(userResult || "Program executed successfully.");
        }
      }
    } catch (err) {
      setError("❌ Engine Connection Failed.");
    } finally {
      setIsRunning(false);
    }
  };

  const isLimitHit = !user?.isPro && (user?.dailyExecutions || 0) >= 12;

  return (
    <div style={ui.container}>
      {/* HEADER TAB */}
      <div style={ui.editorHeader}>
        <span style={ui.tab}>{language.toUpperCase()}</span>
      </div>

      <div style={ui.editorWrapper}>
        {/* Layer 1: Highlighting */}
        <pre 
          ref={scrollRef}
          style={ui.highlighter} 
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: highlightCode(code) + "\n" }} 
        />
        {/* Layer 2: Actual Input */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onScroll={handleScroll}
          style={ui.textarea}
          spellCheck="false"
          autoCapitalize="none"
        />
        
        {/* Floating Action Button */}
        <button 
          onClick={isLimitHit ? () => setIsPaystackOpen(true) : execute} 
          disabled={isRunning}
          style={isLimitHit ? ui.upgradeBtn : ui.runBtn}
        >
          {isRunning ? "..." : isLimitHit ? "UNLOCK PRO" : "RUN"}
        </button>
      </div>

      {/* CONSOLE DASHBOARD */}
      <div style={ui.dashboard}>
        <div style={ui.dashTitle}>OUTPUT</div>
        <div style={ui.outputContent}>
          {error ? (
            <pre style={{color: '#ff5555', margin: 0}}>{error}</pre>
          ) : (
            <pre style={{color: '#50fa7b', margin: 0}}>{output || "Click RUN to see output..."}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

const ui = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#1e1e1e' },
  editorHeader: { height: '35px', backgroundColor: '#2d2d2d', display: 'flex', alignItems: 'center', padding: '0 15px' },
  tab: { color: '#ef4444', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' },
  editorWrapper: { flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#282a36' },
  highlighter: { 
    position: 'absolute', inset: 0, padding: '20px', margin: 0,
    color: '#f8f8f2', fontFamily: '"Fira Code", "Source Code Pro", monospace', 
    fontSize: '14px', whiteSpace: 'pre-wrap', pointerEvents: 'none', 
    lineHeight: '1.6', zIndex: 0, overflow: 'hidden'
  },
  textarea: { 
    width: '100%', height: '100%', backgroundColor: 'transparent', color: 'transparent', 
    padding: '20px', border: 'none', fontFamily: '"Fira Code", "Source Code Pro", monospace', 
    resize: 'none', outline: 'none', fontSize: '14px', lineHeight: '1.6', 
    caretColor: '#fff', position: 'relative', zIndex: 1, whiteSpace: 'pre-wrap'
  },
  runBtn: { 
    position: 'absolute', bottom: '20px', right: '20px', padding: '10px 25px', 
    backgroundColor: '#50fa7b', color: '#282a36', border: 'none', borderRadius: '5px', 
    fontWeight: '900', cursor: 'pointer', zIndex: 10, boxShadow: '0 4px 15px rgba(0,0,0,0.3)' 
  },
  upgradeBtn: { 
    position: 'absolute', bottom: '20px', right: '20px', padding: '10px 25px', 
    backgroundColor: '#ffb86c', color: '#282a36', border: 'none', borderRadius: '5px', 
    fontWeight: '900', cursor: 'pointer', zIndex: 10 
  },
  dashboard: { height: '150px', backgroundColor: '#191a21', borderTop: '2px solid #44475a', padding: '15px' },
  dashTitle: { fontSize: '10px', color: '#6272a4', fontWeight: 'bold', marginBottom: '10px' },
  outputContent: { height: '100px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '13px' }
};

export default CodeEditor;
