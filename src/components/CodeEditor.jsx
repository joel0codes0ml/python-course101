import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ language, version, starterCode, expectedOutput, solution }) {
  // Use a local state that updates immediately
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  // This ensures that when you switch lessons, the new code actually loads
  useEffect(() => { 
    setCode(starterCode); 
    setOutput(""); 
    setError(""); 
  }, [starterCode]);

  const execute = async () => {
    setIsRunning(true);
    setOutput("SYSTEM: Initializing execution...");
    try {
      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          language, 
          version: version || "latest", 
          files: [{ content: code }] 
        })
      });
      const data = await res.json();
      if (data.run && data.run.stderr) {
        setError(data.run.stderr);
        setOutput("");
      } else if (data.run) {
        setOutput(data.run.output);
        setError("");
      }
    } catch (e) {
      setError("Execution service timeout.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#000', fontFamily: 'monospace' }}>
      
      {/* EDITOR AREA - UNLOCKED */}
      <div style={{ flex: 1, borderBottom: '1px solid #1e293b', position: 'relative' }}>
        <Editor
          height="100%"
          theme="vs-dark"
          language={language === "sqlite3" ? "sql" : language}
          value={code}
          // THE FIX: Ensure value updates state instantly
          onChange={(value) => setCode(value || "")} 
          options={{ 
            fontSize: 14, 
            minimap: { enabled: false }, 
            padding: { top: 20 }, 
            automaticLayout: true,
            scrollBeyondLastLine: false,
            // Force it to be writable
            readOnly: false,
            contextmenu: true
          }}
        />
      </div>

      {/* TERMINAL AREA */}
      <div style={{ height: '40%', display: 'flex', flexDirection: 'column', backgroundColor: '#050505', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <span style={{ fontSize: '10px', color: '#475569', fontWeight: 'bold', letterSpacing: '2px' }}>CONSOLE_V1.0</span>
          <button 
            onClick={execute} 
            disabled={isRunning}
            style={{ 
              backgroundColor: '#ef4444', 
              color: 'white', 
              padding: '8px 24px', 
              borderRadius: '6px', 
              border: 'none', 
              fontWeight: '900', 
              fontSize: '11px', 
              cursor: 'pointer',
              boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)' 
            }}
          >
            {isRunning ? "RUNNING..." : "RUN CODE ▶"}
          </button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '8px', border: '1px solid #1e293b', padding: '15px' }}>
          {error ? (
            <pre style={{ color: '#ef4444', fontSize: '12px', margin: 0, whiteSpace: 'pre-wrap' }}>{error}</pre>
          ) : (
            <pre style={{ color: '#22c55e', fontSize: '12px', margin: 0, whiteSpace: 'pre-wrap' }}>{output || "> Waiting for signal..."}</pre>
          )}
        </div>
      </div>
    </div>
  );
}

