import { useState, useEffect } from "react";

const lessons = [
  { id: 1, title: "1: Intro to Python", level: "Beginner", content: "Python is one of the world's easiest languages. Use print() to show words on the screen.", starterCode: 'print("Hello World!")' },
  { id: 2, title: "2: Case Sensitivity", level: "Beginner", content: 'print("Hello World!") and print("hello world!") are different (case sensitive).', starterCode: 'print("Hello World!")\nprint("hello world!")' },
  { id: 3, title: "3: Numbers & Variables", level: "Beginner", content: "Numbers

Variables are containers that hold data values. They are used to store, manipulate, and display information within a program.

In short a variable is like a memory unit that we can access by typing the name of the variable. 

Each variable has a unique name and a value that can be of different types. Python is capable of automatically detecting the variable type, which makes coding more efficient.

To initialize a variable, we use the following format:

variable_name = value
Lets take a look at the different types of numbers:

int - whole number, such as 1 or -2.

float - real number, such as 1.32 or 0.98.

For example:

To initialize a variable of type int with the name a and the value 3:

a = 3
To initialize a variable of type float with the name b and the value 13.2:

b = 13.2, starterCode: "# Type your code below
var = ?

# Don't change the line below
print(f'var = {var}')" },
  { id: 4, title: "Lesson 4: Strings", content: "String

A char is a single character (For example: 1, 6, %, b, p, ., T, etc.)

The str (string) type is a special type that consists of multiple chars.

To initialize a string value in a variable, enclose it within single or double quotation marks:

s1 = 'This is a string'
s2 = "This is also a string"
In the above example, two string variables initialized, named s1 and s2. ", starterCode: `numbers = [1,2,3,4,5]\nprint(numbers)` },
  { id: , title: "Lesson 5: Tuples", content: "Tuples are immutable lists.", starterCode: `colors = ("red","green","blue")\nprint(colors)` },
  { title: "Lesson 6: Dictionaries", content: "Dictionaries store key-value pairs.", starterCode: `person = {"name":"John","age":25}\nprint(person)` },
  { title: "Lesson 7: Booleans", content: "Boolean values: True or False.", starterCode: `is_python_fun = True\nprint(is_python_fun)` },
  { title: "Lesson 8: Arithmetic Operators", content: "Operators: +, -, *, /, %, //, **", starterCode: `a = 10\nb = 3\nprint(a+b, a-b, a*b, a/b)` },
  { title: "Lesson 9: Comparison Operators", content: "Operators: ==, !=, >, <, >=, <=", starterCode: `print(5>3, 5==5, 3!=4)` },
  { title: "Lesson 10: Logical Operators", content: "Operators: and, or, not", starterCode: `print(True and False)\nprint(True or False)\nprint(not True)` },
  { title: "Lesson 11: If Statements", content: "Conditional statements using if, elif, else.", starterCode: `x = 10\nif x > 5:\n    print("x > 5")\nelse:\n    print("x <= 5")` },
  { title: "Lesson 12: Nested If", content: "If statements can be nested.", starterCode: `x = 15\nif x > 10:\n    if x < 20:\n        print("x is between 10 and 20")` },
  { title: "Lesson 13: For Loops", content: "For loops iterate over sequences.", starterCode: `for i in range(5):\n    print(i)` },
  { title: "Lesson 14: While Loops", content: "While loops run while condition is True.", starterCode: `i = 0\nwhile i<5:\n    print(i)\n    i += 1` },
  { title: "Lesson 15: Break and Continue", content: "Break exits loop, continue skips iteration.", starterCode: `for i in range(5):\n    if i==3:\n        break\n    print(i)` },
  { title: "Lesson 16: Functions", content: "Functions group reusable code.", starterCode: `def greet(name):\n    print("Hello", name)\ngreet("Python")` },
  { title: "Lesson 17: Function Parameters", content: "Functions can take parameters.", starterCode: `def add(a,b):\n    return a+b\nprint(add(3,4))` },
  { title: "Lesson 18: Return Values", content: "Use return to get value from function.", starterCode: `def square(x):\n    return x*x\nprint(square(5))` },
  { title: "Lesson 19: Default Parameters", content: "Functions can have default values.", starterCode: `def greet(name="Python"):\n    print("Hello", name)\ngreet()` },
  { title: "Lesson 20: Keyword Arguments", content: "Call functions using keywords.", starterCode: `def greet(name, age):\n    print(name, age)\ngreet(age=25, name="John")` },
  { title: "Lesson 21: *args", content: "Functions can take variable number of arguments.", starterCode: `def sum_all(*args):\n    return sum(args)\nprint(sum_all(1,2,3,4))` },
  { title: "Lesson 22: **kwargs", content: "Functions can take variable keyword arguments.", starterCode: `def info(**kwargs):\n    print(kwargs)\ninfo(name="John", age=25)` },
  { title: "Lesson 23: Lists - Indexing", content: "Access elements by index.", starterCode: `nums = [10,20,30]\nprint(nums[0], nums[-1])` },
  { title: "Lesson 24: Lists - Slicing", content: "Get sublists using slicing.", starterCode: `nums = [10,20,30,40,50]\nprint(nums[1:4])` },
  { title: "Lesson 25: List Methods", content: "Methods: append, remove, pop, sort, reverse.", starterCode: `nums = [3,1,2]\nnums.sort()\nprint(nums)` },
  { title: "Lesson 26: String Basics", content: "Strings are text.", starterCode: `text = "Hello"\nprint(text)` },
  { title: "Lesson 27: String Methods", content: "upper, lower, split, strip.", starterCode: `text = "hello world"\nprint(text.upper())` },
  { title: "Lesson 28: String Formatting", content: "Use f-strings.", starterCode: `name = "John"\nprint(f"Hello {name}")` },
  { title: "Lesson 29: Importing Modules", content: "Use import.", starterCode: `import math\nprint(math.sqrt(16))` },
  { title: "Lesson 30: Random Numbers", content: "Use random.", starterCode: `import random\nprint(random.randint(1,10))` },
  { title: "Lesson 31: Exception Handling", content: "Use try/except.", starterCode: `try:\n    print(5/0)\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")` },
  { title: "Lesson 32: File Handling", content: "Read/write files.", starterCode: `with open("test.txt","w") as f:\n    f.write("Hello")` },
  { title: "Lesson 33: List Comprehension", content: "Compact lists.", starterCode: `squares = [x*x for x in range(5)]\nprint(squares)` },
  { title: "Lesson 34: Dictionaries - Access", content: "Get values by key.", starterCode: `person = {"name":"John"}\nprint(person["name"])` },
  { title: "Lesson 35: Dictionaries - Methods", content: "keys, values, items.", starterCode: `person = {"a":1,"b":2}\nprint(person.keys())` },
  { title: "Lesson 36: Sets", content: "Unique items.", starterCode: `s = {1,2,2,3}\nprint(s)` },
  { title: "Lesson 37: Tuple Unpacking", content: "Unpack values.", starterCode: `t = (1,2,3)\na,b,c = t\nprint(a,b,c)` },
  { title: "Lesson 38: Boolean Logic", content: "and / or / not.", starterCode: `a = True\nb = False\nprint(a and b, a or b, not a)` },
  { title: "Lesson 39: Loops with else", content: "else after loop.", starterCode: `for i in range(3):\n    print(i)\nelse:\n    print("Done")` },
  { title: "Lesson 40: Recap & Practice", content: "Combine concepts.", starterCode: `def multiply(a,b):\n    return a*b\nprint(multiply(3,4))` },

  { id: 3, title: "3: Numbers & Variables", level: "Beginner", content: "Numbers

Variables are containers that hold data values. They are used to store, manipulate, and display information within a program.

In short a variable is like a memory unit that we can access by typing the name of the variable. 

Each variable has a unique name and a value that can be of different types. Python is capable of automatically detecting the variable type, which makes coding more efficient.

To initialize a variable, we use the following format:

variable_name = value
Let's take a look at the different types of numbers:

int - whole number, such as 1 or -2.

float - real number, such as 1.32 or 0.98.

For example:

To initialize a variable of type int with the name a and the value 3:

a = 3
To initialize a variable of type float with the name b and the value 13.2:

b = 13.2", starterCode: "# Type your code below
var = ?

# Don't change the line below
print(f'var = {var}')" },
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
