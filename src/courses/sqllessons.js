export const sqlLessons = [
  {
    title: "Lesson 1: Introduction to SQL",
    content: "SQL (Structured Query Language) is used to interact with relational databases. You can create tables, insert data, query data, update records, and more.\n\nIn this lesson, you'll learn basic SELECT statements.",
    starterCode: `-- Select all rows from a table
SELECT * FROM employees;

-- Challenge: Select all rows from a table called 'students'.`
  },
  {
    title: "Lesson 2: Selecting Columns",
    content: "You can select specific columns using SELECT column_name.\n\nExample:\nSELECT first_name, last_name FROM employees;",
    starterCode: `-- Select specific columns
SELECT first_name, last_name FROM employees;

-- Challenge: Select 'name' and 'age' from a table 'students'.`
  },
  {
    title: "Lesson 3: Filtering Rows",
    content: "Use WHERE to filter rows based on conditions.\n\nExample:\nSELECT * FROM employees WHERE age > 30;",
    starterCode: `-- Filter rows
SELECT * FROM employees WHERE age > 30;

-- Challenge: Select students with grade > 80.`
  },
  {
    title: "Lesson 4: Logical Operators",
    content: "Combine conditions using AND, OR, NOT.\n\nExample:\nSELECT * FROM employees WHERE age > 30 AND department='IT';",
    starterCode: `-- Logical operators
SELECT * FROM employees WHERE age > 30 AND department='IT';

-- Challenge: Select students with grade > 80 OR city='Nairobi'.`
  },
  {
    title: "Lesson 5: ORDER BY",
    content: "Sort query results using ORDER BY.\n\nExample:\nSELECT * FROM employees ORDER BY last_name ASC;",
    starterCode: `-- Sorting
SELECT * FROM employees ORDER BY last_name ASC;

-- Challenge: Order students by grade descending.`
  },
  {
    title: "Lesson 6: LIMIT / OFFSET",
    content: "Limit the number of rows returned using LIMIT. Skip rows with OFFSET.\n\nExample:\nSELECT * FROM employees LIMIT 5 OFFSET 10;",
    starterCode: `-- Limit and offset
SELECT * FROM employees LIMIT 5 OFFSET 10;

-- Challenge: Show first 3 students only.`
  },
  {
    title: "Lesson 7: Aggregate Functions",
    content: "SQL provides aggregate functions like COUNT(), SUM(), AVG(), MIN(), MAX().\n\nExample:\nSELECT COUNT(*) FROM employees;",
    starterCode: `-- Aggregate functions
SELECT COUNT(*) AS total_employees FROM employees;

-- Challenge: Find the average grade of students.`
  },
  {
    title: "Lesson 8: GROUP BY",
    content: "GROUP BY is used to aggregate rows by one or more columns.\n\nExample:\nSELECT department, COUNT(*) FROM employees GROUP BY department;",
    starterCode: `-- Group by example
SELECT department, COUNT(*) AS total FROM employees GROUP BY department;

-- Challenge: Group students by class and count them.`
  },
  {
    title: "Lesson 9: HAVING",
    content: "HAVING filters groups after aggregation.\n\nExample:\nSELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 5;",
    starterCode: `-- Having clause
SELECT department, COUNT(*) AS total FROM employees GROUP BY department HAVING COUNT(*) > 5;

-- Challenge: Show classes with more than 10 students.`
  },
  {
    title: "Lesson 10: JOINs Introduction",
    content: "JOIN combines rows from two or more tables based on a related column.\n\nExample:\nSELECT e.name, d.department_name FROM employees e JOIN departments d ON e.department_id = d.id;",
    starterCode: `-- Join example
SELECT e.name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.id;

-- Challenge: Join students and classes to show student names and class names.`
  },
  {
    title: "Lesson 11: LEFT JOIN / RIGHT JOIN",
    content: "LEFT JOIN returns all rows from the left table and matching rows from the right. RIGHT JOIN is similar but reversed.",
    starterCode: `-- Left join example
SELECT e.name, d.department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;

-- Challenge: Use RIGHT JOIN to show all departments and their employees.`
  },
  {
    title: "Lesson 12: INNER JOIN / FULL OUTER JOIN",
    content: "INNER JOIN returns only matching rows. FULL OUTER JOIN returns all rows from both tables, matching where possible.",
    starterCode: `-- Inner join example
SELECT e.name, d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;

-- Challenge: Show all students and all classes using FULL OUTER JOIN.`
  },
  {
    title: "Lesson 13: Aliases",
    content: "Aliases give temporary names to tables or columns for readability.\n\nExample:\nSELECT e.name AS employee_name FROM employees e;",
    starterCode: `-- Alias example
SELECT e.name AS employee_name, d.department_name AS dept
FROM employees e
JOIN departments d ON e.department_id = d.id;

-- Challenge: Use alias for students and classes columns.`
  },
  {
    title: "Lesson 14: Subqueries",
    content: "A subquery is a query inside another query.\n\nExample:\nSELECT name FROM employees WHERE department_id = (SELECT id FROM departments WHERE department_name='IT');",
    starterCode: `-- Subquery example
SELECT name
FROM employees
WHERE department_id = (SELECT id FROM departments WHERE department_name='IT');

-- Challenge: Select students with grades above average using subquery.`
  },
  {
    title: "Lesson 15: INSERT INTO",
    content: "INSERT INTO adds new rows to a table.\n\nExample:\nINSERT INTO employees (name, age, department_id) VALUES ('Alice', 25, 1);",
    starterCode: `-- Insert example
INSERT INTO employees (name, age, department_id)
VALUES ('Alice', 25, 1);

-- Challenge: Insert 3 students into 'students' table.`
  },
  {
    title: "Lesson 16: UPDATE",
    content: "UPDATE modifies existing records.\n\nExample:\nUPDATE employees SET age=26 WHERE name='Alice';",
    starterCode: `-- Update example
UPDATE employees
SET age = 26
WHERE name='Alice';

-- Challenge: Update a student's grade to 90.`
  },
  {
    title: "Lesson 17: DELETE",
    content: "DELETE removes rows from a table.\n\nExample:\nDELETE FROM employees WHERE name='Alice';",
    starterCode: `-- Delete example
DELETE FROM employees
WHERE name='Alice';

-- Challenge: Delete students with grade < 50.`
  },
  {
    title: "Lesson 18: CREATE TABLE",
    content: "CREATE TABLE defines a new table with columns and data types.\n\nExample:\nCREATE TABLE employees (id INT PRIMARY KEY, name VARCHAR(50), age INT, department_id INT);",
    starterCode: `-- Create table example
CREATE TABLE students (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  grade INT,
  class VARCHAR(20)
);

-- Challenge: Create a table 'classes' with columns id, name, teacher.`
  },
  {
    title: "Lesson 19: ALTER TABLE",
    content: "ALTER TABLE modifies an existing table structure. You can add, drop, or modify columns.\n\nExample:\nALTER TABLE employees ADD COLUMN email VARCHAR(100);",
    starterCode: `-- Alter table example
ALTER TABLE students
ADD COLUMN city VARCHAR(50);

-- Challenge: Remove the 'class' column from 'students' table.`
  },
  {
    title: "Lesson 20: Mini Project",
    content: "Combine everything learned to create tables, insert data, query, update, and delete records.\n\nExample project: Student Management Database.",
    starterCode: `-- Create tables
CREATE TABLE students (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  grade INT
);

CREATE TABLE classes (
  id INT PRIMARY KEY,
  name VARCHAR(50)
);

-- Insert data
INSERT INTO students (id, name, grade) VALUES (1,'Alice',85);
INSERT INTO classes (id, name) VALUES (1,'Math');

-- Query example
SELECT s.name, s.grade, c.name AS class_name
FROM students s
JOIN classes c ON c.id = 1;

-- Challenge: Add more students and classes, update grades, and query top students.`
  }
];
