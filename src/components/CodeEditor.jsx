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
        setError(runError); // Catch syntax errors like print(Hello)
        setOutput("");
      } else {
        // Compare output to mission goal
        const cleanOutput = runOutput.trim();
        const cleanExpected = expectedOutput ? expectedOutput.trim() : null;

        if (cleanExpected && cleanOutput !== cleanExpected) {
          setOutput(runOutput); // Show what they got
          setError(`FAIL: Output does not match mission goal.`);
        } else {
          setOutput(`SUCCESS! \n\n${runOutput}`);
          setError("");
        }
      }
    } catch (e) {
      setError("System Error: Connection failed.");
    } finally {
      setIsRunning(false);
    }
  };

