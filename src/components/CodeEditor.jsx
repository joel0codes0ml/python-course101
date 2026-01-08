import React, { useState, useEffect, useRef } from 'react';
import { updateUserProfile } from "../firebase";

const CodeEditor = ({ user, setUser, setIsPaystackOpen, language, starterCode, expectedOutput }) => {
  const [code, setCode] = useState(starterCode || "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const preRef = useRef(null);

  useEffect(() => {
    if (starterCode) setCode(starterCode);
  }, [starterCode]);

  // AUTHENTIC CODDY.TECH SYNTAX HIGHLIGHTING
  const highlightCode = (input) => {
    if (!input) return "";
    let text = input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return text
      // Keywords: Pink (#ff79c6) - def, return, if, else, import
      .replace(/\b(def|return|if|else|for|while|import|from|class|try|except|let|const|var|function|async|await)\b/g, '<span style="color: #ff79c6;">$1</span>')
      // Functions: Green (#50fa7b) - print, console.log
      .replace(/\b(print|console|log|len|range|str|int|float|bool|input)\b/g, '<span style="color: #50fa7b;">$1</span>')
      // Strings: Yellow (#f1fa8c) - "text"
      .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span style="color: #f1fa8c;">$&</span>')
      // Bools/Numbers: Purple (#bd93f9) - True, False, 123
      .replace(/\b(True|False|None|true|false|null|\d+)\b/g, '<span style="color: #bd93f9;">$1</span>')
      // Comments: Muted Grey-Blue (#6272a4)
      .replace(/#.*$/gm, '<span style="color: #6272a4; font-style: italic;">$&</span>');
  };

  const syncScroll = (e) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.target.scrollTop;
      preRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  return (
    <div style={ui.container}>
      {/* Tab Header style from Coddy */}
      <div style={ui.editorHeader}>
        <div style={ui.tab}>{language.toUpperCase()}</div>
      </div>

      <div style={ui.editorWrapper}>
        <pre 
          ref={preRef}
          style={ui.highlighter} 
          dangerouslySetInnerHTML={{ __html: highlightCode(code) + "\n" }} 
        />
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onScroll={syncScroll}
          style={ui.textarea}
          spellCheck="false"
          autoCapitalize="none"
        />
        
        {/* The Action Button */}
        <button 
          onClick={() => {/* execution logic */}} 
          style={ui.runBtn}
        >
          {isRunning ? "..." : "RUN"}
        </button>
      </div>

      <div style={ui.terminal}>
        <div style={ui.terminalLabel}>TERMINAL</div>
        <pre style={ui.output}>{output || "Click RUN to see output..."}</pre>
      </div>
    </div>
  );
};

const ui = {
  container: { 
    display: 'flex', flexDirection: 'column', height: '100%', 
    backgroundColor: '#191a21', // Deep background
    fontFamily: '"Fira Code", "Source Code Pro", monospace'
  },
  editorHeader: { 
    height: '40px', backgroundColor: '#21222c', 
    display: 'flex', alignItems: 'center', borderBottom: '1px solid #44475a' 
  },
  tab: { 
    padding: '0 20px', color: '#ff79c6', fontSize: '12px', 
    fontWeight: 'bold', borderRight: '1px solid #44475a' 
  },
  editorWrapper: { flex: 1, position: 'relative', overflow: 'hidden' },
  highlighter: { 
    position: 'absolute', inset: 0, padding: '20px', margin: 0,
    color: '#f8f8f2', fontSize: '15px', whiteSpace: 'pre-wrap', 
    pointerEvents: 'none', lineHeight: '1.6', zIndex: 0 
  },
  textarea: { 
    width: '100%', height: '100%', backgroundColor: 'transparent', 
    color: 'transparent', padding: '20px', border: 'none', resize: 'none', 
    outline: 'none', fontSize: '15px', lineHeight: '1.6', caretColor: '#fff', 
    position: 'relative', zIndex: 1, whiteSpace: 'pre-wrap'
  },
  runBtn: { 
    position: 'absolute', bottom: '24px', right: '24px', padding: '10px 30px', 
    backgroundColor: '#50fa7b', color: '#282a36', border: 'none', 
    borderRadius: '6px', fontWeight: '900', cursor: 'pointer', zIndex: 10,
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)'
  },
  terminal: { height: '160px', backgroundColor: '#191a21', padding: '20px', borderTop: '2px solid #44475a' },
  terminalLabel: { fontSize: '10px', color: '#6272a4', fontWeight: 'bold', marginBottom: '8px' },
  output: { color: '#50fa7b', margin: 0, fontSize: '13px' }
};

export default CodeEditor;

