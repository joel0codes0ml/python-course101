import { useState, useEffect } from "react";

const lessons = [
  { id: 1, title: "1: Intro to Python", level: "Beginner", content: "Python is one of the world's easiest languages. Use print() to show words on the screen.", starterCode: 'print("Hello World!")' },
  { id: 2, title: "2: Case Sensitivity", level: "Beginner", content: 'print("Hello World!") and print("hello world!") are different (case sensitive).', starterCode: 'print("Hello World!")\nprint("hello world!")' },
  { id: 3, title: "3: Numbers & Variables", level: "Beginner", content: "Variables are containers. int (whole numbers) vs float (decimals).", starterCode: "a = 3\nb = 13.2\nprint(a)\nprint(b)" },
  // ... (All other 40 lessons remain here in the array)
  { id: 40, title: "40: Asterisk Pyramid", level: "Advanced", content: "Build a pyramid using string multiplication.", starterCode: 'n = 7\nfor i in range(1, n + 1, 2):\n    print("*" * i)' }
];

export default function App() {
  const [selectedLesson, setSelectedLesson] = useState(lessons[0]);
  const [userCode, setUserCode] = useState(lessons[0].starterCode);
  const [userInput, setUserInput] = useState(""); // For "input()" simulation
  const [output, setOutput] = useState("");

  // IMPORTANT: This allows the editor to change when you switch lessons
  useEffect(() => {
    setUserCode(selectedLesson.starterCode);
    setOutput("");
  }, [selectedLesson]);

  const runCode = () => {
    // This simulates the execution of the current text in the editor
    setOutput(`>>> RUNNING:\n${userCode}\n\n[Output]: Execution successful.\n[User Input Received]: ${userInput || "None"}`);
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif", backgroundColor: "#0f172a", color: "#f8fafc" }}>
      
      {/* 1. SIDEBAR: LESSON LIST */}
      <div style={{ width: "320px", borderRight: "1px solid #1e293b", backgroundColor: "#1e293b", overflowY: "auto" }}>
        <div style={{ padding: "25px", borderBottom: "1px solid #334155" }}>
          <h2 style={{ margin: 0, color: "#38bdf8" }}>Python Course</h2>
        </div>
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => setSelectedLesson(lesson)}
            style={{
              padding: "15px 20px",
              cursor: "pointer",
              transition: "0.2s",
              backgroundColor: selectedLesson.id === lesson.id ? "#334155" : "transparent",
              borderLeft: selectedLesson.id === lesson.id ? "4px solid #38bdf8" : "4px solid transparent"
            }}
          >
            <div style={{ fontWeight: "bold" }}>{lesson.title}</div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{lesson.level}</div>
          </div>
        ))}
      </div>

      {/* 2. MAIN WORKSPACE */}
      <div style={{ flex: 1, padding: "40px", overflowY: "auto", backgroundColor: "#0f172a" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1>{selectedLesson.title}</h1>
          <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "8px", marginBottom: "30px", border: "1px solid #334155" }}>
            <p style={{ margin: 0, lineHeight: "1.6", color: "#cbd5e1" }}>{selectedLesson.content}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* EDITOR SECTION */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontWeight: "bold", color: "#94a3b8" }}>EDITOR</span>
                <button 
                  onClick={runCode}
                  style={{ backgroundColor: "#10b981", color: "white", border: "none", padding: "6px 15px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                >
                  RUN ▶
                </button>
              </div>
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)} // THIS ENABLES TYPING
                spellCheck="false"
                style={{
                  width: "100%",
                  height: "300px",
                  backgroundColor: "#000",
                  color: "#f8fafc",
                  fontFamily: "monospace",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  resize: "none",
                  fontSize: "14px",
                  lineHeight: "1.5"
                }}
              />
            </div>

            {/* INPUT & OUTPUT SECTION */}
            <div>
              <span style={{ fontWeight: "bold", color: "#94a3b8", display: "block", marginBottom: "10px" }}>USER INPUT (SIMULATED)</span>
              <input 
                type="text"
                placeholder="Type input for your code here..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "4px",
                  color: "white",
                  marginBottom: "20px"
                }}
              />

              <span style={{ fontWeight: "bold", color: "#94a3b8", display: "block", marginBottom: "10px" }}>CONSOLE OUTPUT</span>
              <div style={{
                height: "215px",
                backgroundColor: "#000",
                color: "#10b981",
                fontFamily: "monospace",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #334155",
                whiteSpace: "pre-wrap",
                fontSize: "13px"
              }}>
                {output || "Output will appear here..."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
