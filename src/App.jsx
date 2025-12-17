import { useState } from "react";

const lessons = [
  { id: 1, title: "1: Intro to Python", level: "Beginner", content: "Python is one of the world's easiest languages. Use print() to show words on the screen.", starterCode: 'print("Hello World!")' },
  { id: 2, title: "2: Case Sensitivity", level: "Beginner", content: 'print("Hello World!") and print("hello world!") are different (case sensitive).', starterCode: 'print("Hello World!")\nprint("hello world!")' },
  { id: 3, title: "3: Numbers & Variables", level: "Beginner", content: "Variables are containers. int (whole numbers) vs float (decimals).", starterCode: "a = 3\nb = 13.2\nprint(a)\nprint(b)" },
  { id: 4, title: "4: Strings", level: "Beginner", content: "Strings (str) are multiple characters enclosed in ' ' or \" \".", starterCode: 'coddy = "I am learning to code!"\nprint(coddy)' },
  { id: 5, title: "5: Boolean Values", level: "Beginner", content: "Bool has 2 values: True or False. Building blocks for logic.", starterCode: "boolean = True\nprint(boolean)" },
  { id: 6, title: "6: Recap Challenge #1", level: "Beginner", content: "Initialize: k=88, PI=3.14, name='bob'.", starterCode: 'k = 88\nPI = 3.14\nname = "bob"\nprint(k, PI, name)' },
  { id: 7, title: "7: Arithmetic Operators", level: "Beginner", content: "+, -, *, /, % (Modulus/Remainder). 14 % 4 = 2.", starterCode: "a = 5\nb = 3\nprint(a + b)" },
  { id: 8, title: "8: Arithmetic Challenge", level: "Beginner", content: "Initialize a=5.2, b=2.6. Solve c = a / b.", starterCode: "a = 5.2\nb = 2.6\nc = a / b\nprint(c)" },
  { id: 9, title: "9: Arithmetic Shortcuts", level: "Beginner", content: "Shortcuts: a += 3 is a = a + 3. Works for -=, *=, /=, %=", starterCode: "count = 5\ncount += 4\ncount *= 2\ncount -= 1\nprint(count)" },
  { id: 10, title: "10: Comparison Operators", level: "Beginner", content: "==, !=, >, <, >=, <=. Returns True or False.", starterCode: "n1 = 8\nn2 = 9\nprint(n1 > n2)" },
  { id: 11, title: "11: Logical Operators P1", level: "Beginner", content: "and (both True), or (one True), not (reverses).", starterCode: "b1 = (5 > 3) and (1 == 1)\nprint(b1)" },
  { id: 12, title: "12: Logical Operators P2", level: "Beginner", content: "Truth Tables: define behavior for and, or, and not.", starterCode: "a = True\nb = False\nprint(a and b)" },
  { id: 13, title: "13: Logic Challenge", level: "Beginner", content: "Make (b1 > 5) and (b2 < 10) evaluate to True.", starterCode: "b1 = 6\nb2 = 9\nprint((b1 > 5) and (b2 < 10))" },
  { id: 14, title: "14: While Loops", level: "Intermediate", content: "While loops run code as long as a condition is True.", starterCode: "i = 0\nwhile i < 5:\n    print(i)\n    i += 1" },
  { id: 15, title: "15: Break and Continue", level: "Intermediate", content: "Break exits early. Continue skips to the next iteration.", starterCode: "for i in range(5):\n    if i == 3: break\n    print(i)" },
  { id: 16, title: "16: Functions", level: "Intermediate", content: "Reusable blocks of code defined using def.", starterCode: 'def greet(name):\n    print("Hello", name)\n\ngreet("Python")' },
  { id: 17, title: "17: Function Parameters", level: "Intermediate", content: "Functions take parameters to process data.", starterCode: "def add(a, b):\n    return a + b\n\nprint(add(3, 4))" },
  { id: 18, title: "18: Return Values", level: "Intermediate", content: "The return keyword sends a value back.", starterCode: "def square(x):\n    return x * x\n\nprint(square(5))" },
  { id: 19, title: "19: Default Parameters", level: "Intermediate", content: "Functions can have default values.", starterCode: 'def greet(name="User"):\n    print("Hi", name)\ngreet()' },
  { id: 20, title: "20: Keyword Arguments", level: "Intermediate", content: "Pass arguments using specific parameter names.", starterCode: 'def info(n, a): print(n, a)\ninfo(a=25, n="John")' },
  { id: 21, title: "21: *args", level: "Intermediate", content: "Accept any number of positional arguments.", starterCode: "def sum_all(*args): return sum(args)\nprint(sum_all(1, 2, 3))" },
  { id: 22, title: "22: **kwargs", level: "Intermediate", content: "Accept any number of keyword arguments.", starterCode: 'def info(**kw): print(kw)\ninfo(name="John", age=30)' },
  { id: 23, title: "23: List Indexing", level: "Intermediate", content: "Access elements by position (0 is first).", starterCode: "nums = [10, 20, 30]\nprint(nums[0])" },
  { id: 24, title: "24: List Slicing", level: "Intermediate", content: "Extract parts of a list using start:end.", starterCode: "nums = [10, 20, 30, 40]\nprint(nums[1:3])" },
  { id: 25, title: "25: List Methods", level: "Intermediate", content: "append, remove, sort, and pop.", starterCode: "nums = [3, 1, 2]\nnums.sort()\nprint(nums)" },
  { id: 26, title: "26: String Basics", level: "Intermediate", content: "Strings represent text and can be manipulated.", starterCode: 'text = "Hello"\nprint(text)' },
  { id: 27, title: "27: String Methods", level: "Intermediate", content: "upper, lower, split, strip.", starterCode: 's = "hello"\nprint(s.upper())' },
  { id: 28, title: "28: String Formatting", level: "Intermediate", content: "Use f-strings to insert variables.", starterCode: 'n="Joe"; print(f"Hi {n}")' },
  { id: 29, title: "29: Importing Modules", level: "Intermediate", content: "Use math and other libraries.", starterCode: "import math\nprint(math.sqrt(16))" },
  { id: 30, title: "30: Random Numbers", level: "Intermediate", content: "Generate random values.", starterCode: "import random\nprint(random.randint(1, 10))" },
  { id: 31, title: "31: Exception Handling", level: "Intermediate", content: "try/except prevents crashes.", starterCode: 'try: int("abc")\nexcept: print("Error!")' },
  { id: 32, title: "32: File Handling", level: "Advanced", content: "Read and write text files.", starterCode: 'print("File operation placeholder")' },
  { id: 33, title: "33: List Comprehension", level: "Advanced", content: "Create lists in one line.", starterCode: "sq = [x**2 for x in range(5)]\nprint(sq)" },
  { id: 34, title: "34: Dictionary Access", level: "Advanced", content: "Access values by keys.", starterCode: 'd = {"name": "Ali"}\nprint(d["name"])' },
  { id: 35, title: "35: Dictionary Methods", level: "Advanced", content: "keys(), values(), items().", starterCode: 'd = {"a":1}\nprint(d.keys())' },
  { id: 36, title: "36: Sets", level: "Advanced", content: "Unique collections, no duplicates.", starterCode: "s = {1, 2, 2, 3}\nprint(s)" },
  { id: 37, title: "37: Tuple Unpacking", level: "Advanced", content: "Unpack values into variables.", starterCode: "c = (10, 20); x, y = c; print(x)" },
  { id: 38, title: "38: Boolean Logic Recap", level: "Advanced", content: "Using logic in complex conditions.", starterCode: "print(True and not False)" },
  { id: 39, title: "39: Loops with Else", level: "Advanced", content: "Else block runs after loop finishes.", starterCode: 'for i in range(2): print(i)\nelse: print("Done")' },
  { id: 40, title: "40: Asterisk Pyramid", level: "Advanced", content: "Build a pyramid using string multiplication.", starterCode: 'n = 7\nfor i in range(1, n + 1, 2):\n    print("*" * i)' }
];

export default function App() {
  const [selectedLesson, setSelectedLesson] = useState(lessons[0]);
  const [output, setOutput] = useState("");

  const runCode = () => {
    setOutput(`>>> RUNNING PYTHON:\n${selectedLesson.starterCode}\n\n[Execution Finished Successfully]`);
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif", backgroundColor: "#f3f4f6" }}>
      {/* Sidebar - Shows all 40 Lessons */}
      <div style={{ width: "300px", borderRight: "1px solid #ddd", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px", background: "#1f2937", color: "white" }}>
          <h3 style={{ margin: 0 }}>Python Course</h3>
          <small>{lessons.length} Lessons Total</small>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => { setSelectedLesson(lesson); setOutput(""); }}
              style={{
                padding: "12px 20px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                backgroundColor: selectedLesson.id === lesson.id ? "#e5e7eb" : "transparent"
              }}
            >
              <strong>{lesson.title}</strong>
              <div style={{ fontSize: "0.7rem", color: "#666" }}>{lesson.level}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ marginBottom: "10px" }}>{selectedLesson.title}</h1>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", border: "1px solid #ddd", lineHeight: "1.6" }}>
            {selectedLesson.content}
          </div>

          <div style={{ marginTop: "30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <h3>Code Editor</h3>
              <button onClick={runCode} style={{ background: "#10b981", color: "white", border: "none", padding: "8px 20px", borderRadius: "5px", cursor: "pointer" }}>Run Code</button>
            </div>
            <pre style={{ background: "#1e1e1e", color: "#d4d4d4", padding: "20px", borderRadius: "8px", overflowX: "auto" }}>
              <code>{selectedLesson.starterCode}</code>
            </pre>
          </div>

          {output && (
            <div style={{ marginTop: "20px", background: "#000", color: "#00ff00", padding: "15px", borderRadius: "5px", fontFamily: "monospace" }}>
              {output}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
