import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ language, version, starterCode, expectedOutput, solution }) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { setCode(starterCode); setOutput(""); setError(""); }, [starterCode]);

  const execute = async () => {
    setIsRunning(true);
    setOutput("SYSTEM: Compiling Jutsu...");
    try {
      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        body: JSON.stringify({ language, version, files: [{ content: code }] })
      });
      const data = await res.json();
      if (data.run.stderr) {
        setError(data.run.stderr);
        setOutput("");
      } else {
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
    <div className="flex flex-col h-full bg-black font-mono">
      {/* Editor Top Area */}
      <div className="flex-1 border-b border-white/5">
        <Editor
          height="100%"
          theme="vs-dark"
          language={language === "sqlite3" ? "sql" : language}
          value={code}
          onChange={(v) => setCode(v)}
          options={{ fontSize: 14, minimap: { enabled: false }, padding: { top: 20 }, background: "#000000" }}
        />
      </div>

      {/* Terminal Footer (CMD LOOK) */}
      <div className="h-[40%] flex flex-col bg-[#050505] p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Console_Output_v1.0</span>
          <button 
            onClick={execute} 
            disabled={isRunning}
            className="bg-red-600 hover:bg-red-500 text-white px-8 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-900/40 transition-all active:scale-95"
          >
            {isRunning ? "Running..." : "Run Code ▶"}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-thin rounded-xl bg-black/50 border border-white/5 p-4">
          {error ? (
            <pre className="text-red-500 text-xs whitespace-pre-wrap">{error}</pre>
          ) : (
            <pre className="text-green-500 text-xs whitespace-pre-wrap">{output || "> Waiting for signal..."}</pre>
          )}
        </div>
      </div>
    </div>
  );
}

