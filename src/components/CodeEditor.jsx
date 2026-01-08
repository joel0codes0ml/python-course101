import React, { useState, useEffect, useRef } from 'react';
import { updateUserProfile } from "../firebase";

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language, starterCode, expectedOutput }) => {
  const [code, setCode] = useState(starterCode || "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const preRef = useRef(null);

  useEffect(() => {
    setCode(starterCode || "");
    setOutput("");
    setError("");
  }, [starterCode, language]);

  // HIGH-PRECISION REGEX: Only wraps the text, doesn't leak into the editor
  const highlightCode = (input) => {
    if (!input) return "";
    // Step 1: Escape HTML entities to prevent rendering bugs
    let text = input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Step 2: Apply Coddy.tech Colors
    return text
      .replace(/\b(package|import|func|var|return|if|else|for|range|go|type|struct|chan)\b/g, '<span style="color: #569cd6;">$1</span>')
      .replace(/\b([a-zA-Z_]\w*)(?=\s*\()/g, '<span style="color: #dcdcaa;">$1</span>') // Yellow Functions
      .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span style="color: #ce9178;">$&</span>') // Orange Strings
      .replace(/\b(\d+)\b/g, '<span style="color: #b5cea8;">$1</span>') // Numbers
      .replace(/[(){}[\]]/g, '<span style="color: #ffd700;">$&</span>') // Gold Brackets
      .replace(/\/\/.*$/gm, '<span style="color: #6a9955; font-style: italic;">$&</span>');
  };

  const syncScroll = (e) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.target.scrollTop;
      preRef.current.scrollLeft = e.target.scrollLeft;
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

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          language: language === "sqlite3" ? "sql" : language, 
          version: "*", 
          files: [{ content: code }] 
        }),
      });
      const data = await response.json();
      const result = data.run.output || "";
      let isSuccess = expectedOutput && result.trim() === expectedOutput.trim();

      setUser(prev => {
        const nextXp = (prev.xp || 0) + (isSuccess ? 20 : 0);
        const nextRuns = (prev.dailyExecutions || 0) + 1;
        updateUserProfile(prev.uid, { xp: nextXp, dailyExecutions: nextRuns }).catch(() => {});
        return { ...prev, xp: nextXp, dailyExecutions: nextRuns };
      });

      if (data.run.stderr) {
        setError(data.run.stderr);
      } else {
        setOutput(isSuccess ? `${result}\n\n✨ SUCCESS! +20 XP` : result);
      }
    } catch (err) {
      setError("Execution failed.");
    } finally { setIsRunning(false); }
  };

  return (
    <div style={ui.container}>
      <div style={ui.header}>
        <span>{language.toUpperCase()} ENGINE</span>
      </div>

      <div style={ui.editorArea}>
        {/* BACKGROUND: THE HIGHLIGHTED CODE */}
        <div 
          ref={preRef}
          style={ui.highlighter} 
          dangerouslySetInnerHTML={{ __html: highlightCode(code) + "\n" }} 
        />
        
        {/* FOREGROUND: THE ACTUAL INVISIBLE TEXTAREA */}
        <textarea 
          value={code} 
          onChange={(e) => setCode(e.target.value)} 
          onScroll={syncScroll}
          style={ui.textarea} 
          spellCheck="false" 
          autoCapitalize="none"
        />
        
        <button onClick={execute} disabled={isRunning} style={ui.runBtn}>
          {isRunning ? "..." : "RUN"}
        </button>
      </div>

      <div style={ui.outputBox}>
        <pre style={{ color: error ? '#ef4444' : '#22c55e', margin: 0, whiteSpace: 'pre-wrap' }}>
          {error || output || "Terminal Ready"}
        </pre>
      </div>
    </div>
  );
};

const ui = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#1e1e1e' },
  header: { padding: '10px 20px', backgroundColor: '#252526', color: '#858585', fontSize: '11px', borderBottom: '1px solid #111' },
  editorArea: { flex: 1, position: 'relative', overflow: 'hidden' },
  
  // Highlighting layer - Must match textarea EXACTLY
  highlighter: { 
    position: 'absolute', inset: 0, padding: '25px', margin: 0,
    color: '#d4d4d4', fontFamily: '"Fira Code", monospace', fontSize: '14px', 
    whiteSpace: 'pre-wrap', wordBreak: 'break-all', pointerEvents: 'none', 
    lineHeight: '1.6', zIndex: 0, overflow: 'hidden'
  },
  
  // User input layer - Transparent text, white cursor
  textarea: { 
    width: '100%', height: '100%', backgroundColor: 'transparent', 
    color: 'transparent', // This hides the raw text so you don't see double
    padding: '25px', border: 'none', fontFamily: '"Fira Code", monospace', 
    outline: 'none', fontSize: '14px', resize: 'none', lineHeight: '1.6', 
    caretColor: '#fff', // Keeps the flashing cursor visible
    position: 'relative', zIndex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all'
  },
  
  runBtn: { position: 'absolute', bottom: '20px', right: '20px', backgroundColor: '#22c55e', color: '#000', border: 'none', padding: '10px 30px', borderRadius: '4px', fontWeight: '900', cursor: 'pointer', zIndex: 5 },
  outputBox: { height: '150px', backgroundColor: '#000', padding: '20px', overflowY: 'auto', borderTop: '1px solid #333' }
};

export default CodeEditor;

