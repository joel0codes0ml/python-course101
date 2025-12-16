import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

// 40 beginner Python lessons
const lessons = [
  { title: "Lesson 1: Introduction to Python", content: "Python is a high-level programming language.", starterCode: `print("Hello World")` },
  { title: "Lesson 2: Variables", content: "Variables store data.", starterCode: `x = 5\nprint(x)` },
  { title: "Lesson 3: Data Types", content: "Python has int, float, str, bool, list, tuple, dict.", starterCode: `a = 10\nb = 3.14\nc = "Hello"\nprint(a, b, c)` },
  { title: "Lesson 4: Lists", content: "Lists store multiple values and are mutable.", starterCode: `numbers = [1,2,3,4,5]\nprint(numbers)` },
  { title: "Lesson 5: Tuples", content: "Tuples are immutable lists.", starterCode: `colors = ("red","green","blue")\nprint(colors)` },
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
];

export default function App() {
  const [current, setCurrent] = useState(0);
  const [code, setCode] = useState(lessons[0].starterCode);
  const [output, setOutput] = useState("Output will appear here");
  const [pyodide, setPyodide] = useState(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);

  // Load Pyodide (browser-safe)
  useEffect(() => {
    const load = async () => {
      const py = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
      });
      setPyodide(py);
      setLoading(false);
    };
    load();
  }, []);

  const selectLesson = (i) => {
    setCurrent(i);
    setCode(lessons[i].starterCode);
    setOutput("Output will appear here");
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const runCode = async () => {
    if (!pyodide) return;
    try {
      const result = await pyodide.runPythonAsync(`
import sys, io
buf = io.StringIO()
sys.stdout = buf
sys.stderr = buf
try:
    exec("""${code.replace(/"/g, '\\"')}""")
except Exception as e:
    print(e)
sys.stdout = sys.__stdout__
buf.getvalue()
`);
      setOutput(result || "(no output)");
    } catch (e) {
      setOutput(e.toString());
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Python Lessons</h2>
        {lessons.map((l, i) => (
          <div
            key={i}
            onClick={() => selectLesson(i)}
            className={`p-2 mb-2 rounded cursor-pointer ${
              i === current ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            {l.title}
          </div>
        ))}
      </div>

      {/* Content */}
      <div ref={contentRef} className="flex-1 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-2">{lessons[current].title}</h1>
        <p className="mb-4">{lessons[current].content}</p>

        <div className="flex gap-4 flex-1">
          <Editor
            key={current}
            height="400px"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={(v) => setCode(v)}
          />

          <div className="w-1/2 bg-gray-900 text-white p-4 rounded">
            <h3 className="font-bold mb-2">Output</h3>
            <pre className="text-sm whitespace-pre-wrap">
              {loading ? "Loading Python..." : output}
            </pre>
            <button
              onClick={runCode}
              className="mt-4 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
              Run Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



