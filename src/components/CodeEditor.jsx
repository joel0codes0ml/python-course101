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

  // THE SYNTAX ENGINE: Colors based on Coddy's actual Go lesson
  const highlightCode = (input) => {
    if (!input) return "";
    let text = input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return text
      // Blue: Keywords (package, import, func, return, etc.)
      .replace(/\b(package|import|func|var|return|if|else|for|range|go|type|struct|chan)\b/g, '<span style="color: #569cd6;">$1</span>')
      // Yellow: Functions (any word before a parenthesis like Println)
      .replace(/\b([a-zA-Z_]\w*)(?=\s*\()/g, '<span style="color: #dcdcaa;">$1</span>')
      // Orange/Peach: Strings "Hello World"
      .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span style="color: #ce9178;">$&</span>')
      // Light Green: Numbers
      .replace(/\b(\d+)\b/g, '<span style="color: #b5cea8;">$1</span>')
      // Golden: Braces and Parentheses () {}
      .replace(/[(){}[\]]/g, '<span style="color: #ffd700;">$&</span>')
      // Grey-Green: Comments
      .replace(/\/\/.*$/gm, '<span style="color: #6a9955; font-style: italic;">$&</span>');
  };

  const playSuccessSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play blocked"));
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
      let xpBonus = 0;
      let isSuccess = false;

      if (expectedOutput && result.trim() === expectedOutput.trim()) {
        xpBonus = 20;
        isSuccess = true;
        playSuccessSound();
      }

      setUser(prev => {
        const nextXp = (prev.xp || 0) + xpBonus;
        const nextRuns = (prev.dailyExecutions || 0) + 1;
        updateUserProfile(prev.uid, { xp: nextXp, dailyExecutions: nextRuns }).catch(e => {});
        return { ...prev, xp: nextXp, dailyExecutions: nextRuns };
      });

      if (data.run.stderr) {
        setError(data.run.stderr);
      } else {
        setOutput(isSuccess ? `${result}\n\n✨ SUCCESS! +20 XP` : result);
      }
    } catch (err) {
      setError("Execution failed. Check internet.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={ui.container}>
      <div style={ui.header}>
        <span>{language.toUpperCase()} ENGINE</span>
        <span style={{color: isRunning ? '#f59e0b' : '#22c55e', fontSize: '9px'}}>
            {isRunning ? "● PROCESSING" : "● READY"}
        </span>
      </div>

      <div style={ui.editorArea}>
        {/* HIGHLIGHTING LAYER */}
        <pre 
          ref={preRef}
          style={ui.highlighter} 
          dangerouslySetInnerHTML={{ __html: highlightCode(code) + "\n" }} 
        />
        {/* INTERACTIVE LAYER */}
        <textarea 
          value={code} 
          onChange={(e) => setCode(e.target.value)} 
          onScroll={syncScroll}
          style={ui.textarea} 
          spellCheck="false" 
          autoCapitalize="none"
        />
        <button onClick={execute} disabled={isRunning} style={ui.runBtn}>
          {isRunning ? "..." : "RUN CODE"}
        </button>
      </div>

      <div style={ui.outputBox}>
        <div style={{fontSize: '9px', color: '#475569', marginBottom: '8px', fontWeight: 'bold'}}>TERMINAL</div>
        <pre style={{ color: error ? '#ef4444' : '#22c55e', margin: 0, whiteSpace: 'pre-wrap' }}>
          {error || output || "Awaiting execution..."}
        </pre>
      </div>
    </div>
  );
};

const ui = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#1e1e1e' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '12px 20px', backgroundColor: '#252526', color: '#858585', fontSize: '11px', fontWeight: 'bold', borderBottom: '1px solid #1e1e1e' },
  editorArea: { flex: 1, position: 'relative', overflow: 'hidden' },
  highlighter: { 
    position: 'absolute', inset: 0, padding: '25px', margin: 0,
    color: '#d4d4d4', fontFamily: '"Fira Code", monospace', fontSize: '14px', 
    whiteSpace: 'pre-wrap', pointerEvents: 'none', lineHeight: '1.6', zIndex: 0 
  },
  textarea: { 
    width: '100%', height: '100%', backgroundColor: 'transparent', color: 'transparent', 
    padding: '25px', border: 'none', fontFamily: '"Fira Code", monospace', 
    outline: 'none', fontSize: '14px', resize: 'none', lineHeight: '1.6', 
    caretColor: '#fff', position: 'relative', zIndex: 1 
  },
  runBtn: { 
    position: 'absolute', bottom: '20px', right: '20px', backgroundColor: '#22c55e', 
    color: '#000', border: 'none', padding: '10px 30px', borderRadius: '4px', 
    fontWeight: '900', cursor: 'pointer', zIndex: 5 
  },
  outputBox: { height: '180px', backgroundColor: '#000', padding: '20px', overflowY: 'auto', borderTop: '1px solid #333', fontFamily: 'monospace', fontSize: '13px' }
};

export default CodeEditor;

