const execute = async () => {
    setIsRunning(true);
    setOutput("SYSTEM: Validating...");
    setError("");

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
      
      const runOutput = data.run.output;
      const runError = data.run.stderr || (data.compile && data.compile.stderr);

      if (runError) {
        setError(runError);
        setOutput("");
      } else {
        setOutput(runOutput);
        
        // VALIDATION LOGIC
        // Normalize strings (remove extra spaces/newlines) to compare
        const cleanOutput = runOutput.trim();
        const cleanExpected = expectedOutput.trim();

        if (expectedOutput && cleanOutput !== cleanExpected) {
          setError(`FAIL: Output "${cleanOutput}" does not match mission goal.`);
        } else if (expectedOutput) {
          setOutput(`SUCCESS! \n\n${runOutput}`);
        }
      }
    } catch (e) {
      setError("System Error: Lab engine offline.");
    } finally {
      setIsRunning(false);
    }
  };

