import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { updateUserProfile } from "../firebase"; // Ensure this is imported

export default function CodeEditor({ user, setUser, language, version, starterCode, expectedOutput }) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { 
    setCode(starterCode); 
    setOutput(""); 
    setError(""); 
  }, [starterCode]);

  const execute = async () => {
    // 🔒 THE GATEKEEPER LOGIC
    const currentRuns = user?.dailyExecutions || 0;
    
    if (!user?.isPro && currentRuns >= 12) {
      setError("LIMIT REACHED: 12/12 runs used. Upgrade to Pro to continue!");
      return;
    }

    setIsRunning(true);
    setOutput("SYSTEM: Initializing...");
    setError("");

    try {
      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          language, 
          version: version || "*", 
          files: [{ content: code }] 
        })
      });

      const data = await res.json();
      const run = data.run;
      const compile = data.compile;

      if (compile?.stderr) {
        setError(compile.stderr);
      } else if (run?.stderr) {
        setError(run.stderr);
      } else {
        const runOutput = run?.output || "";
        const cleanOutput = runOutput.trim();
        const cleanExpected = expectedOutput ? expectedOutput.trim() : null;

        // ✅ UPDATE FIREBASE COUNT AFTER RUN
        const nextRuns = currentRuns + 1;
        await updateUserProfile(user.uid, { dailyExecutions: nextRuns });
        setUser(prev => ({ ...prev, dailyExecutions: nextRuns }));

        if (cleanExpected && cleanOutput !== cleanExpected) {
          setOutput(runOutput);
          setError("FAIL: Output does not match mission goal.");
        } else {
          setOutput(cleanExpected ? `SUCCESS!\n\n${runOutput}` : runOutput);
        }
      }
    } catch (e) {
      setError("System Error: Engine unreachable.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#000', fontFamily: 'monospace' }}>
      <div style={{ flex: 1, borderBottom: '1px solid #1e293b' }}>
        <Editor
          height="100%"
          theme="vs-dark"
          language={language === "sqlite3" ? "sql" : language}
          value={code}
          onChange={(v) => setCode(v || "")}
          options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true }}
        />
      </div>

      <div style={{ height: '40%', display: 'flex', flexDirection: 'column', backgroundColor: '#050505', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '10px', color: '#475569', fontWeight: 'bold' }}>
            {!user?.isPro ? `RUNS: ${user?.dailyExecutions || 0}/12` : "PRO UNLIMITED"}
          </span>
          <button 
            onClick={execute} 
            disabled={isRunning}
            style={{ 
              backgroundColor: (!user?.isPro && (user?.dailyExecutions || 0) >= 12) ? '#334155' : '#ef4444', 
              color: '#fff', padding: '8px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' 
            }}
          >
            {isRunning ? "RUNNING..." : "RUN CODE ▶"}
          </button>
        </div>
        {/* Output area stays the same */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#000', padding: '10px', borderRadius: '4px', border: '1px solid #1e293b' }}>
          {error ? (
            <pre style={{ color: '#ef4444', fontSize: '12px', margin: 0, whiteSpace: 'pre-wrap' }}>{error}</pre>
          ) : (
            <pre style={{ color: '#22c55e', fontSize: '12px', margin: 0, whiteSpace: 'pre-wrap' }}>{output || "> Ready..."}</pre>
          )}
        </div>
      </div>
    </div>
  );
}

