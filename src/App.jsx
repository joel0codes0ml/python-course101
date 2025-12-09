import React, { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";

const LESSONS = [
  {
    id: 1,
    title: "Introduction to Python & Setup",
    lesson: "What is Python? Installing Python, using REPL, VS Code, and the course structure.",
    exercise: "Write a Python program that prints \"Hello, world!\"",
    starter: "print(\"Hello, world!\")",
  },
  {
    id: 2,
    title: "Variables and Types",
    lesson: "Numbers, strings, booleans. Naming variables and simple assignments.",
    exercise: "Create two variables (a, b). Assign numbers and print their sum.",
    starter: "a = 5\nb = 7\nprint(a + b)",
  },
  // ... add all 40 lessons here
  {
    id: 3,
    title: "Basic String Operations",
    lesson: "Concatenation, repetition, length, indexing, simple methods (upper, lower).",
    exercise: "Given a name variable, print a greeting with the name uppercased.",
    starter: "name = 'Alice'\nprint('Hello, ' + name.upper())",
  },
  {
    id: 4,
    title: "Input and Output",
    lesson: "Reading from input(), converting types, and formatted output (f-strings).",
    exercise: "Ask the user for their age and print 'You are X years old'.",
    starter: "age = input('Enter your age: ')\nprint(f'You are {age} years old')",
  },
  {
    id: 5,
    title: "Control Flow: if / else",
    lesson: "if, elif, else — making decisions in code.",
    exercise: "Read a number and print whether it is positive, negative, or zero.",
    starter: "n = int(input('Number: '))\nif n > 0:\n    print('Positive')\nelif n < 0:\n    print('Negative')\nelse:\n    print('Zero')",
  },
  {
    id: 6,
    title: "Loops: for",
    lesson: "for loops over ranges and collections.",
    exercise: "Print numbers from 1 to 5 using a for loop.",
    starter: "for i in range(1,6):\n    print(i)",
  },
  {
    id: 7,
    title: "Loops: while",
    lesson: "while loops and guarding against infinite loops.",
    exercise: "Use a while loop to sum numbers from 1 to 10.",
    starter: "i = 1\nsum = 0\nwhile i <= 10:\n    sum += i\n    i += 1\nprint(sum)",
  },
  {
    id: 8,
    title: "Collections: Lists",
    lesson: "Creating, indexing, slicing, appending, removing items.",
    exercise: "Create a list of 3 fruits and print the second fruit.",
    starter: "fruits = ['apple','banana','cherry']\nprint(fruits[1])",
  },
  {
    id: 9,
    title: "Collections: Tuples & Sets",
    lesson: "Immutability (tuple) and uniqueness (set).",
    exercise: "Create a tuple and attempt to change an element (observe error).",
    starter: "t = (1,2,3)\nprint(t)\n# t[0] = 5  # this would raise a TypeError",
  },
  {
    id: 10,
    title: "Collections: Dictionaries",
    lesson: "Key-value mapping, accessing, adding, iterating keys/values.",
    exercise: "Create a dict for a person (name, age) and print the age.",
    starter: "person = {'name':'John','age':30}\nprint(person['age'])",
  },
  {
    id: 11,
    title: "Functions: Defining and Calling",
    lesson: "def, return, parameters, and simple examples.",
    exercise: "Write a function add(a,b) that returns the sum.",
    starter: "def add(a,b):\n    return a + b\nprint(add(2,3))",
  },
  {
    id: 12,
    title: "Scope & Lifetime",
    lesson: "Local vs global variables, parameter passing.",
    exercise: "Show that changing a local variable doesn't affect the global one.",
    starter: "x = 10\ndef f():\n    x = 5\n    print('inside', x)\n\nf()\nprint('outside', x)",
  },
  {
    id: 13,
    title: "Error Handling: try/except",
    lesson: "Catching exceptions and basic debugging strategies.",
    exercise: "Read an int from input, handle ValueError if conversion fails.",
    starter: "try:\n    n = int(input('Enter number: '))\n    print(n)\nexcept ValueError:\n    print('Not a valid integer')",
  },
  {
    id: 14,
    title: "File I/O Basics",
    lesson: "open, read, write, with context managers.",
    exercise: "Write 'Hello' to a file and read it back.",
    starter: "with open('hello.txt','w') as f:\n    f.write('Hello')\nwith open('hello.txt') as f:\n    print(f.read())",
  },
  {
    id: 15,
    title: "List Comprehensions",
    lesson: "Compact way to build lists.",
    exercise: "Create a list of squares from 1 to 5 using a comprehension.",
    starter: "squares = [x*x for x in range(1,6)]\nprint(squares)",
  },
  {
    id: 16,
    title: "String Formatting & Methods",
    lesson: "f-strings, format(), common string methods.",
    exercise: "Format a float to 2 decimal places inside a sentence.",
    starter: "pi = 3.14159\nprint(f'Pi is {pi:.2f}')",
  },
  {
    id: 17,
    title: "Modules and Imports",
    lesson: "Using math, random, creating your own modules.",
    exercise: "Import math and print math.sqrt(16).",
    starter: "import math\nprint(math.sqrt(16))",
  },
  {
    id: 18,
    title: "Virtual Environments & pip",
    lesson: "venv, installing packages with pip, basic project layout.",
    exercise: "Create a requirements.txt for one package (example: requests).",
    starter: "# requirements.txt\nrequests==2.31.0",
  },
  {
    id: 19,
    title: "Basic OOP: Classes & Objects",
    lesson: "Defining classes, __init__, methods, attributes.",
    exercise: "Define a Dog class with speak() method and instantiate it.",
    starter: "class Dog:\n    def __init__(self,name):\n        self.name = name\n    def speak(self):\n        return 'Woof'\n\nd = Dog('Rex')\nprint(d.name, d.speak())",
  },
  {
    id: 20,
    title: "OOP: Inheritance and Polymorphism",
    lesson: "Subclassing and method overriding.",
    exercise: "Create a Cat subclass of Animal and override speak().",
    starter: "class Animal:\n    def speak(self):\n        return ''\n\nclass Cat(Animal):\n    def speak(self):\n        return 'Meow'\n\nprint(Cat().speak())",
  },
  {
    id: 21,
    title: "Iterators & Generators",
    lesson: "iter(), next(), yield and memory-efficient loops.",
    exercise: "Write a generator that yields first n even numbers.",
    starter: "def evens(n):\n    i = 0\n    while i < n:\n        yield 2*i\n        i += 1\n\nfor e in evens(5):\n    print(e)",
  },
  {
    id: 22,
    title: "Lambda, map, filter, reduce",
    lesson: "Anonymous functions and functional tools.",
    exercise: "Use map to square a list of numbers.",
    starter: "nums = [1,2,3]\nprint(list(map(lambda x: x*x, nums)))",
  },
  {
    id: 23,
    title: "Working with JSON",
    lesson: "json.loads, json.dumps and common use cases.",
    exercise: "Serialize a dict to JSON string and parse it back.",
    starter: "import json\nobj = {'a':1}\ns = json.dumps(obj)\nprint(json.loads(s))",
  },
  {
    id: 24,
    title: "HTTP Requests with requests",
    lesson: "GET/POST basics using requests (note: CORS on browser).",
    exercise: "Show how to GET 'https://httpbin.org/get' (server-side example).",
    starter: "import requests\nres = requests.get('https://httpbin.org/get')\nprint(res.status_code)",
  },
  {
    id: 25,
    title: "Testing Basics with unittest",
    lesson: "Writing simple unit tests and running them.",
    exercise: "Write a test that checks add(2,3) == 5.",
    starter: "import unittest\n\ndef add(a,b):\n    return a+b\n\nclass TestAdd(unittest.TestCase):\n    def test_add(self):\n        self.assertEqual(add(2,3),5)\n\nif __name__ == '__main__':\n    unittest.main()",
  },
  {
    id: 26,
    title: "Debugging Techniques",
    lesson: "print debugging, using pdb, and reading tracebacks.",
    exercise: "Introduce a bug in a short function and fix it using prints.",
    starter: "def inc(x):\n    return x + 1\n\nprint(inc(4))",
  },
  {
    id: 27,
    title: "Working with Dates & Times",
    lesson: "datetime module usage and formatting dates.",
    exercise: "Print today's date in YYYY-MM-DD format.",
    starter: "from datetime import date\nprint(date.today().isoformat())",
  },
  {
    id: 28,
    title: "Virtual DOM & Web Integration (brief)",
    lesson: "How Python can power web backends (Flask/Django) — overview.",
    exercise: "Sketch (pseudo) a small Flask app returning 'Hello'.",
    starter: "from flask import Flask\napp = Flask(__name__)\n\n@app.route('/')\ndef home():\n    return 'Hello'",
  },
  {
    id: 29,
    title: "Databases Basics",
    lesson: "SQLite usage with sqlite3 and simple CRUD.",
    exercise: "Create a SQLite table and insert one row.",
    starter: "import sqlite3\nconn = sqlite3.connect(':memory:')\nc = conn.cursor()\nc.execute('CREATE TABLE t(x int)')\nc.execute('INSERT INTO t VALUES(1)')\nconn.commit()",
  },
  {
    id: 30,
    title: "Virtualization & Deployment Overview",
    lesson: "Containers (Docker) and simple deployment ideas (Heroku/Vercel).",
    exercise: "Write a Dockerfile for a minimal Flask app (pseudo).",
    starter: "# Dockerfile\nFROM python:3.11-slim\nWORKDIR /app\nCOPY . .\nRUN pip install -r requirements.txt\nCMD ['gunicorn','app:app']",
  },
  {
    id: 31,
    title: "Web Scraping fundamentals",
    lesson: "BeautifulSoup basics and respectful scraping rules.",
    exercise: "Parse a small HTML string and extract text from <p> tags.",
    starter: "from bs4 import BeautifulSoup\nhtml = '<p>Hello</p>'\nsoup = BeautifulSoup(html, 'html.parser')\nprint(soup.p.text)",
  },
  {
    id: 32,
    title: "Concurrency: threading & asyncio (intro)",
    lesson: "When to use threads vs asyncio; simple examples.",
    exercise: "Write a simple asyncio coroutine that waits and prints.",
    starter: "import asyncio\nasync def main():\n    await asyncio.sleep(0.1)\n    print('done')\n\nasyncio.run(main())",
  },
  {
    id: 33,
    title: "Packaging & setuptools",
    lesson: "Creating setup.py / pyproject.toml and packaging basics.",
    exercise: "Add a minimal pyproject.toml example (name, version).",
    starter: "# pyproject.toml\n[project]\nname = 'mypkg'\nversion = '0.1.0'",
  },
  {
    id: 34,
    title: "Security Basics for Python Apps",
    lesson: "Input validation, avoid eval, basic secrets handling.",
    exercise: "Show why eval(user_input) is dangerous with an example.",
    starter: "user = '2+2'\n# eval(user)  # dangerous in real apps",
  },
  {
    id: 35,
    title: "Data Handling with pandas (intro)",
    lesson: "Reading CSV and simple DataFrame ops (overview).",
    exercise: "Create a DataFrame from a dict and show head().",
    starter: "import pandas as pd\ndf = pd.DataFrame({'a':[1,2]})\nprint(df.head())",
  },
  {
    id: 36,
    title: "Visualization overview (matplotlib)",
    lesson: "Plotting simple charts and saving images.",
    exercise: "Plot x=[1,2,3] vs y=[1,4,9] (pseudo code).",
    starter: "import matplotlib.pyplot as plt\nplt.plot([1,2,3],[1,4,9])\nplt.savefig('plot.png')",
  },
  {
    id: 37,
    title: "Working with CSV & Excel",
    lesson: "csv module and openpyxl basics.",
    exercise: "Read a CSV file and print rows as lists.",
    starter: "import csv\nwith open('data.csv') as f:\n    reader = csv.reader(f)\n    for r in reader:\n        print(r)",
  },
  {
    id: 38,
    title: "APIs: Building & Consuming",
    lesson: "REST basics and using Flask/FastAPI for endpoints.",
    exercise: "Create a simple endpoint returning JSON (pseudo).",
    starter: "from flask import Flask, jsonify\napp = Flask(__name__)\n@app.route('/api')\ndef api():\n    return jsonify({'ok':True})",
  },
  {
    id: 39,
    title: "Final Project: Put it together",
    lesson: "Design a small project: CLI todo app or simple web API.",
    exercise: "Plan (write) the steps for a todo CLI app and implement add/list.",
    starter: "# pseudo-starter for todo app\ntodos = []\ndef add(todo):\n    todos.append(todo)\n\nadd('Buy milk')\nprint(todos)",
  },
  {
    id: 40,
    title: "Next steps & Learning Path",
    lesson: "How to keep learning: algorithms, system design, open source.",
    exercise: "Write a learning plan for the next 3 months (topics + projects).",
    starter: "# Example plan:\n# Month 1: Data structures\n# Month 2: Small web project\n# Month 3: Contribute to open source",
  },
];



export default function PythonCourseApp() {
  const [selected, setSelected] = useState(LESSONS[0]);
  const [code, setCode] = useState(selected.starter);
  const [output, setOutput] = useState("-- output will appear here --");
  const pyodideRef = useRef(null);
  const lessonRef = useRef(null); // ref for scrolling to lesson

  useEffect(() => {
    setCode(selected.starter);
    setOutput("-- output will appear here --");
    
    // Scroll lesson into view when selected changes
    lessonRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selected]);

  async function loadPyodideIfNeeded() {
    if (pyodideRef.current) return pyodideRef.current;
    if (window.loadPyodide) {
      pyodideRef.current = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
      });
      return pyodideRef.current;
    }
    return null;
  }

  async function runCodeInPyodide(src) {
    setOutput("Running...");
    try {
      const pyodide = await loadPyodideIfNeeded();
      if (!pyodide) {
        setOutput(
          "Pyodide not loaded — include the pyodide script in index.html"
        );
        return;
      }
      let result = await pyodide.runPythonAsync(
        `import sys\nfrom js import console\n__out = None\ntry:\n    import io\n    buf = io.StringIO()\n    sys.stdout = buf\n    sys.stderr = buf\n    exec('''${src.replace(/`/g, "\\`")}''')\n    __out = buf.getvalue()\nfinally:\n    sys.stdout = sys.__stdout__\n    sys.stderr = sys.__stderr__\n__out`
      );
      setOutput(String(result));
    } catch (e) {
      setOutput(String(e));
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-80 border-r p-4 bg-white h-screen overflow-auto">
        <h2 className="text-xl font-bold mb-4">
          Python — 40 Lesson Beginner Course
        </h2>
        <div className="space-y-2">
          {LESSONS.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelected(l)}
              className={`w-full text-left px-3 py-2 rounded-md hover:bg-slate-100 ${
                selected.id === l.id ? "bg-slate-100 font-semibold" : ""
              }`}
            >
              {l.id}. {l.title}
            </button>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 grid grid-cols-3 gap-6">
        {/* Lesson panel */}
        <section
          ref={lessonRef}
          className="col-span-1 bg-white p-4 rounded shadow-sm overflow-auto"
        >
          <h3 className="text-lg font-semibold">Lesson</h3>
          <h4 className="mt-2 font-bold">{selected.title}</h4>
          <p className="mt-2 text-sm whitespace-pre-line">{selected.lesson}</p>

          <h5 className="mt-4 font-semibold">Exercise</h5>
          <p className="mt-1 text-sm whitespace-pre-line">{selected.exercise}</p>

          <div className="mt-4">
            <button
              onClick={() => runCodeInPyodide(code)}
              className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Run
            </button>
            <button
              onClick={() => {
                setCode(selected.starter);
                setOutput("-- output will appear here --");
              }}
              className="ml-2 px-3 py-2 rounded border"
            >
              Reset
            </button>
          </div>

          <div className="mt-4 bg-slate-50 p-3 rounded h-40 overflow-auto text-xs">
            <strong>Output</strong>
            <pre className="whitespace-pre-wrap mt-2">{output}</pre>
          </div>
        </section>

        {/* Code editor */}
        <section className="col-span-2 bg-white p-4 rounded shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Code Editor</h3>
          <Editor
            height="60vh"
            defaultLanguage="python"
            value={code}
            onChange={(v) => setCode(v)}
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </section>
      </main>
    </div>
  );
}
