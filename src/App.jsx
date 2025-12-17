import { useState } from "react";

const lessons = [
  {
    id: 1,
    title: "Introduction to Python",
    level: "Beginner",
    type: "Challenge",
    content: `
Python is one of the world's easiest and most popular programming languages.
This course will teach you the basics of Python without requiring any prior knowledge.

Press the run code button to run your first code in Python.

Hello World!

The "Hello World!" program outputs text to the screen.
In Python, we use print() to display text.
Text must be inside quotation marks.

Example:
print("Hello World!")
print("hello world!")

Note: Python is case sensitive.
`
  },
  {
    id: 2,
    title: "Hello World Challenge",
    level: "Beginner",
    type: "Challenge",
    content: `
Write a program that outputs Hello World!

Remember:
print("Hello World!")
`
  },
  {
    id: 3,
    title: "Numbers & Variables",
    level: "Beginner",
    type: "Lesson",
    content: `
Variables are containers that store data values.
They allow us to store, manipulate, and display information.

Format:
variable_name = value

Python automatically detects variable types.

Number types:
int   → whole numbers (1, -2)
float → decimal numbers (1.32, 0.98)

Examples:
a = 3
b = 13.2
`
  },
  {
    id: 4,
    title: "Variables Challenge",
    level: "Beginner",
    type: "Challenge",
    content: `
Write code that initializes a variable named var with a value of your choice.
`
  },
  {
    id: 5,
    title: "Strings",
    level: "Beginner",
    type: "Lesson",
    content: `
A char is a single character.
A string (str) is a sequence of characters.

Strings must be inside quotes.

Examples:
s1 = 'This is a string'
s2 = "This is also a string"
`
  },
  {
    id: 6,
    title: "String Challenge",
    level: "Beginner",
    type: "Challenge",
    content: `
Store the string:
"I am learning to code with Coddy!"
in a variable named coddy.

Make sure casing is exact.
`
  },
  {
    id: 7,
    title: "Booleans",
    level: "Beginner",
    type: "Lesson",
    content: `
Boolean values are either True or False.

Examples:
variable_true = True
variable_false = False

Booleans are used to build logic and conditions.
`
  },
  {
    id: 8,
    title: "Boolean Challenge",
    level: "Beginner",
    type: "Challenge",
    content: `
Declare a variable named boolean and assign it the value True.
`
  },
  {
    id: 9,
    title: "Variables Recap Challenge",
    level: "Beginner",
    type: "Challenge",
    content: `
Initialize the following variables:

k = 88
PI = 3.14
name = "bob"

Remember: Python is case sensitive!
`
  }
];

export default function App() {
  const [selectedLesson, setSelectedLesson] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      {/* Sidebar */}
      <div style={{ width: "30%", borderRight: "1px solid #ddd", padding: 20 }}>
        <h2>Python Course</h2>
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => setSelectedLesson(lesson)}
            style={{
              padding: 10,
              marginBottom: 8,
              cursor: "pointer",
              background:
                selectedLesson?.id === lesson.id ? "#e0e7ff" : "#f9fafb",
              borderRadius: 6
            }}
          >
            <strong>{lesson.title}</strong>
            <div style={{ fontSize: 12, color: "#555" }}>
              {lesson.type} · {lesson.level}
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ width: "70%", padding: 30 }}>
        {selectedLesson ? (
          <>
            <h1>{selectedLesson.title}</h1>
            <pre style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
              {selectedLesson.content}
            </pre>
          </>
        ) : (
          <h2>Select a lesson to begin 🚀</h2>
        )}
      </div>
    </div>
  );
}




