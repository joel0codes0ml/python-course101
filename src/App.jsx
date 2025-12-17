import { useState } from "react";

const lessons = [
  {
   const lessons = [
  {
    title: "Lesson 1: Introduction to Python",
    content: `
Python is one of the world's easiest and most popular programming languages.

This course teaches you Python basics without requiring any prior knowledge.

The classic first program in any language is "Hello World".

In Python, we use print() to display text on the screen.
Text must be inside quotation marks.
    `,
    starterCode: `print("Hello World!")`
  },

  {
    title: "Lesson 2: Printing Text",
    content: `
The print() function outputs text to the screen.

Python is case-sensitive:
"Hello World" and "hello world" are different.

You can print multiple lines by calling print() multiple times.
    `,
    starterCode: `print("Hello World!")
print("hello world!")`
  },

  {
    title: "Lesson 3: Numbers & Variables",
    content: `
Variables are containers that store values.

A variable has:
• a name
• a value
• a type (automatically detected by Python)

Types of numbers:
• int  → whole numbers (1, -5)
• float → decimal numbers (3.14, 0.5)

To assign a value:
variable_name = value
    `,
    starterCode: `a = 3
b = 13.2
print(a)
print(b)`
  },

  {
    title: "Lesson 4: Strings",
    content: `
A string is a sequence of characters.

Strings must be enclosed in:
• single quotes  ' '
• or double quotes  " "

Strings are case-sensitive.
    `,
    starterCode: `message = "I am learning Python"
print(message)`
  },

  {
    title: "Lesson 5: Boolean Values",
    content: `
Booleans represent truth values.

They can only be:
• True
• False

Booleans are essential for logic and decision making.
    `,
    starterCode: `is_learning = True
print(is_learning)`
  },

  {
    title: "Lesson 6: Variables Recap Challenge",
    content: `
Create the following variables:

• k → 88
• PI → 3.14
• name → "bob"

Python is case-sensitive.
    `,
    starterCode: `k = 88
PI = 3.14
name = "bob"
print(k, PI, name)`
  }
];
,
{
  title: "Lesson 7: Arithmetic Operators",
  content: `
Arithmetic operators are used to perform math operations.

Basic operators:
+  Addition
-  Subtraction
*  Multiplication
/  Division
%  Modulus (remainder)

Example:
14 % 4 = 2 (because 4 goes into 14 three times with remainder 2)
  `,
  starterCode: `a = 5
b = 3
print(a + b)
print(a - b)
print(a * b)
print(a / b)
print(a % b)`
},

{
  title: "Lesson 8: Arithmetic Challenge",
  content: `
Initialize two variables:
• a = 5.2
• b = 2.6

Create a variable c that stores the result of a / b.
  `,
  starterCode: `a = 5.2
b = 2.6
c = a / b
print(c)`
},

{
  title: "Lesson 9: Arithmetic Shortcuts",
  content: `
Python provides shortcuts for arithmetic operations.

Instead of:
a = a + 3

You can write:
a += 3

Available shortcuts:
+=  -=  *=  /=  %=
  `,
  starterCode: `count = 5
count += 4
count *= 2
count -= 1
print(count)`
},

{
  title: "Lesson 10: Comparison Operators",
  content: `
Comparison operators compare values and return True or False.

Operators:
==  Equal
!=  Not equal
>   Greater than
<   Less than
>=  Greater or equal
<=  Less or equal
  `,
  starterCode: `n1 = 8
n2 = 9
n3 = n1 > n2
print(n3)`
},

{
  title: "Lesson 11: Logical Operators (Part 1)",
  content: `
Logical operators combine comparisons.

and → True if both are True
or  → True if at least one is True
not → Reverses the value

Example:
(5 > 3) and (1 == 1) → True
  `,
  starterCode: `b1 = (5 > 3) and (1 == 1)
b2 = not (5 == 4)
print(b1)
print(b2)`
},

{
  title: "Lesson 12: Logical Operators (Part 2)",
  content: `
Truth tables define logical behavior.

AND:
True only if both are True

OR:
True if at least one is True

NOT:
Reverses the boolean value
  `,
  starterCode: `a = True
b = False
print(a and b)
print(a or b)
print(not a)`
},

{
  title: "Lesson 13: Logic Challenge",
  content: `
Create two numbers b1 and b2 so that:

(b1 > 5) and (b2 < 10) evaluates to True.

There are multiple correct solutions.
  `,
  starterCode: `b1 = 6
b2 = 9
print((b1 > 5) and (b2 < 10))`
}
{
  title: "Lesson 14: While Loops",
  content: "While loops run code as long as a condition remains true.",
  starterCode: `i = 0
while i < 5:
    print(i)
    i += 1`
},
{
  title: "Lesson 15: Break and Continue",
  content: "Break exits a loop early. Continue skips the current iteration.",
  starterCode: `for i in range(5):
    if i == 3:
        break
    print(i)`
},
{
  title: "Lesson 16: Functions",
  content: "Functions are reusable blocks of code defined using def.",
  starterCode: `def greet(name):
    print("Hello", name)

greet("Python")`
},
{
  title: "Lesson 17: Function Parameters",
  content: "Functions can take parameters to accept data.",
  starterCode: `def add(a, b):
    return a + b

print(add(3, 4))`
},
{
  title: "Lesson 18: Return Values",
  content: "The return keyword sends a value back from a function.",
  starterCode: `def square(x):
    return x * x

print(square(5))`
},
{
  title: "Lesson 19: Default Parameters",
  content: "Functions can have default parameter values.",
  starterCode: `def greet(name="Python"):
    print("Hello", name)

greet()
greet("Joel")`
},
{
  title: "Lesson 20: Keyword Arguments",
  content: "Arguments can be passed using parameter names.",
  starterCode: `def info(name, age):
    print(name, age)

info(age=25, name="John")`
},
{
  title: "Lesson 21: *args",
  content: "The *args parameter allows a function to accept any number of arguments.",
  starterCode: `def sum_all(*args):
    return sum(args)

print(sum_all(1, 2, 3, 4))`
},
{
  title: "Lesson 22: **kwargs",
  content: "**kwargs allows a function to accept keyword arguments as a dictionary.",
  starterCode: `def info(**kwargs):
    print(kwargs)

info(name="John", age=30, city="Nairobi")`
},
{
  title: "Lesson 23: List Indexing",
  content: "Access list elements using index positions.",
  starterCode: `nums = [10, 20, 30, 40]
print(nums[0])
print(nums[-1])`
},
{
  title: "Lesson 24: List Slicing",
  content: "Slicing extracts parts of a list using start and end indexes.",
  starterCode: `nums = [10, 20, 30, 40, 50]
print(nums[1:4])`
},
{
  title: "Lesson 25: List Methods",
  content: "Lists have built-in methods like append, remove, sort, and pop.",
  starterCode: `nums = [3, 1, 4, 2]
nums.sort()
nums.append(5)
print(nums)`
},
{
  title: "Lesson 26: String Basics",
  content: "Strings represent text and can be created using quotes.",
  starterCode: `text = "Hello Python"
print(text)`
},
{
  title: "Lesson 27: String Methods",
  content: "Common string methods include upper, lower, split, and strip.",
  starterCode: `text = "hello world"
print(text.upper())
print(text.split())`
},
{
  title: "Lesson 28: String Formatting",
  content: "String formatting lets you insert variables into text using f-strings.",
  starterCode: `name = "Joel"
age = 22
print(f"My name is {name} and I am {age} years old.")`
},
{
  title: "Lesson 29: Importing Modules",
  content: "Modules let you use pre-written functionality from Python libraries.",
  starterCode: `import math
print(math.sqrt(16))
print(math.pi)`
},
{
  title: "Lesson 30: Random Numbers",
  content: "The random module generates random values.",
  starterCode: `import random
print(random.randint(1, 10))`
},
{
  title: "Lesson 31: Exception Handling",
  content: "Exceptions prevent programs from crashing using try and except.",
  starterCode: `try:
    x = int("abc")
except ValueError:
    print("Conversion failed!")`
},
{
  title: "Lesson 32: File Handling",
  content: "Python can read and write files using the open() function.",
  starterCode: `with open("sample.txt", "w") as f:
    f.write("Hello from Python!")

print("File written successfully")`
},
{
  title: "Lesson 33: List Comprehension",
  content: "List comprehensions create lists using a single line of code.",
  starterCode: `squares = [x**2 for x in range(6)]
print(squares)`
},
{
  title: "Lesson 34: Dictionary Access",
  content: "Access dictionary values using keys.",
  starterCode: `student = {"name": "Amina", "age": 20}
print(student["name"])
print(student.get("age"))`
},
{
  title: "Lesson 35: Dictionary Methods",
  content: "Dictionaries have useful methods like keys(), values(), and items().",
  starterCode: `person = {"name": "John", "age": 25}
print(person.keys())
print(person.values())
print(person.items())`
},
{
  title: "Lesson 36: Sets",
  content: "Sets store unique values and automatically remove duplicates.",
  starterCode: `numbers = {1, 2, 2, 3, 4}
print(numbers)`
},
{
  title: "Lesson 37: Tuple Unpacking",
  content: "You can unpack tuple values into variables.",
  starterCode: `coords = (10, 20)
x, y = coords
print("X:", x)
print("Y:", y)`
},
{
  title: "Lesson 38: Boolean Logic",
  content: "Boolean logic uses and, or, and not in conditions.",
  starterCode: `a = True
b = False
print(a and b)
print(a or b)
print(not a)`
},
{
  title: "Lesson 39: Loops with Else",
  content: "Python allows an else block after loops.",
  starterCode: `for i in range(3):
    print(i)
else:
    print("Loop finished!")`
},
{
  title: "Lesson 40: Recap & Practice",
  content: "This lesson combines functions, loops, and variables.",
  starterCode: `def multiply(a, b):
    return a * b

for i in range(1, 6):
    print(multiply(i, 2))`
},

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




