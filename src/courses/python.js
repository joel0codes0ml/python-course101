export const pythonLessons = [
  {
    id: 1,
    title: "1: Intro to Python",
    level: "Beginner",
    content: "Python is one of the world's easiest and most popular programming languages. This course will teach you the basics of Python, without requiring any prior knowledge.\n\nChallenge\nBeginner\nPress the run code button to run your first code in Python\n2Hello World!\nThe \"Hello World!\" is a simple program that outputs Hello World! to the screen. In Python, we use print() to show words on the screen. The words go inside quotation marks.",
    starterCode: 'print("Hello World!")'
  },
  {
    id: 2,
    title: "2: Case Sensitivity",
    level: "Beginner",
    content: "Let's take a look at the \"Hello World!\" program in Python:\n\nChallenge\nBeginner\nUse the code view to write a program that outputs Hello World!\nNote that anything inside quotation marks is case sensitive. For example:\nprint(\"Hello World!\")\nprint(\"hello world!\")\nare different things (notice the capital letters in the first line).",
    starterCode: 'print("Hello World!")\nprint("hello world!")'
  },
  {
    id: 3,
    title: "3: Numbers & Variables",
    level: "Beginner",
    content: "Variables are containers that hold data values. They are used to store, manipulate, and display information within a program. In short a variable is like a memory unit that we can access by typing the name of the variable. Each variable has a unique name and a value that can be of different types. Python is capable of automatically detecting the variable type, which makes coding more efficient. To initialize a variable, we use the following format:\nvariable_name = value\n\nint - whole number, such as 1 or -2.\nfloat - real number, such as 1.32 or 0.98.\n\nChallenge\nBeginner\nWrite code that initialize a variable named var with the value 5",
    starterCode: 'var = 5\na = 3\nb = 13.2'
  },
  {
    id: 4,
    title: "4: Strings",
    level: "Beginner",
    content: "A char is a single character (For example: 1, 6, %, b, p, ., T, etc.)\nThe str (string) type is a special type that consists of multiple chars.\nTo initialize a string value in a variable, enclose it within single or double quotation marks:\ns1 = 'This is a string'\ns2 = \"This is also a string\"\n\nChallenge\nBeginner\nStore the string I am learning to code with Coddy! in a variable named coddy. Be sure to store the exact string value with correct casing.",
    starterCode: 'coddy = "I am learning to code with Coddy!"'
  },
  {
    id: 5,
    title: "5: Boolean",
    level: "Beginner",
    content: "A bool (Boolean) type has only 2 possible values: True or False. To assign a bool value to a variable,\nvariable_true = True\nvariable_false = False\nBooleans are the building blocks for creating logic. We have a whole chapter about logic and conditions.\n\nChallenge\nBeginner\nDeclare a variable named boolean and assign it the value True.",
    starterCode: 'boolean = True'
  },
  {
    id: 6,
    title: "6: Recap Challenge #1",
    level: "Beginner",
    content: "Let's recap variables!\n\nChallenge\nBeginner\nWrite code that initializes the following variables:\nk with the value 88\nPI with the value 3.14\nname with the value \"bob\"\nMake sure you use the exact variables names and values. Remember, Python is case sensitive!",
    starterCode: 'k = 88\nPI = 3.14\nname = "bob"'
  },
  {
    id: 7,
    title: "7: Arithmetic Operators",
    level: "Beginner",
    content: "Operators used to perform operations on values.\n+ Addition (3 + 2 = 5)\n- Subtraction (3 - 2 = 1)\n* Multiplication (3 * 2 = 6)\n/ Division (4 / 2 = 2)\n% Modulus (Remainder after division) (3 % 2 = 1)\n\nModulus operation provides the remainder that results from dividing the first value by the second value. For example: 14 % 4 returns 2 because 4 can be inserted into 14 three times (4*3 = 12) and 14 minus 12 equals 2.",
    starterCode: 'a = 3\nb = 5\nc = a + b'
  },
  {
    id: 8,
    title: "8: Arithmetic Challenge",
    level: "Beginner",
    content: "Challenge\nBeginner\nWrite a code that initializes two variables, a and b, with the values 5.2 and 2.6 (respectively). After that, initialize another variable c that will hold the result of a / b.",
    starterCode: 'a = 5.2\nb = 2.6\nc = a / b'
  },
  {
    id: 9,
    title: "9: Arithmetic Shortcuts",
    level: "Beginner",
    content: "Python created a cool shortcut for self-arithmetic operations. instead of writing a = a + 3, we can write a += 3. Valid for: +=, -=, *=, /=, %=\n\nChallenge\nBeginner\nYou are given a code with initialization of count. Your task is to add the following operations, in this order:\n1. Add 4 to count\n2. Multiply count by 2\n3. Subtract 1 from count\nUse the arithmetic shortcuts!",
    starterCode: 'count = 5\n# write code below\ncount += 4\ncount *= 2\ncount -= 1'
  },
  {
    id: 10,
    title: "10: Comparison Operators",
    level: "Beginner",
    content: "== Equal, != Not Equal, > Greater Than, < Lower Than, >= Greater or Equal, <= Lower or Equal. The comparison operator returns True if the comparison is correct or False otherwise.\n\nChallenge\nBeginner\nWrite a script that initializes 2 variables n1 and n2 with the values 8 and 9 (accordingly). After that initialize another variable n3 that will hold whether n1 is bigger than n2.",
    starterCode: 'n1 = 8\nn2 = 9\nn3 = n1 > n2'
  },
  {
    id: 11,
    title: "11: Logical Operators Part 1",
    level: "Beginner",
    content: "and (True if all operands are True), or (True if any operand is True), not (True if operand is False).\n\nChallenge\nBeginner\nYou are given a code, Replace the question marks of the variables b1 and b2 so that b3 holds True.",
    starterCode: 'b1 = True\nb2 = False\nb3 = b1 or b2'
  },
  {
    id: 12,
    title: "12: Logical Operators Part 2",
    level: "Beginner",
    content: "Truth table for the and operator: Only way to get a True is if both a and b are True.\nTruth table for or operator: Either a or b should be True.\nTruth table for not operator: Value is reversed.\n\nChallenge\nBeginner\nReplace the question marks so that b3 evaluates to True. b1 and b2 should hold numbers.",
    starterCode: 'b1 = 6\nb2 = 9\nb3 = (b1 > 5) and (b2 < 10)'
  },
  {
    id: 13,
    title: "13: Recap Challenge #1 (Logic)",
    level: "Beginner",
    content: "Challenge\nBeginner\nYou are given a code, initialize the variables a and b so that c will hold 24.",
    starterCode: 'a = 12\nb = 2\nc = a * b'
  },
  {
    id: 14,
    title: "14: If Statement",
    level: "Beginner",
    content: "If statements allow us to execute code with conditions. Add a colon : at the end and indent with 4 spaces.\n\nChallenge\nBeginner\nThe variables a and b have missing values, fill them so that the code inside the if statement will be executed!",
    starterCode: 'a = 10\nb = 5\nif a > b:\n    print("Condition met")'
  },
  {
    id: 15,
    title: "15: If - Else - Elif",
    level: "Beginner",
    content: "If condition is not met, use else or elif. Note that the code inside the if/elif/else must be indented.\n\nChallenge\nBeginner\nInitialize variable status based on wind speed:\n\"Calm\" if wind < 8,\n\"Breeze\" if wind between 8 and 31,\n\"Gale\" if wind between 32 and 63,\n\"Storm\" otherwise.",
    starterCode: 'wind = 25\nif wind < 8:\n    status = "Calm"\nelif wind <= 31:\n    status = "Breeze"\nelif wind <= 63:\n    status = "Gale"\nelse:\n    status = "Storm"'
  },
  {
    id: 16,
    title: "16: Output Recap",
    level: "Beginner",
    content: "In Python to print something to the screen we use print().\n\nChallenge\nBeginner\nWrite a program that prints \"I love Python programming\".",
    starterCode: 'print("I love Python programming")'
  },
  {
    id: 17,
    title: "17: Output with Variables",
    level: "Beginner",
    content: "To insert variable values into the string use f-string f\"\". Before the quotation marks we add the letter f and inside parenthesis {} we put the variable name.\n\nChallenge\nBeginner\nYou are given a code that stores a random string in rnd. Print to the console \"The input is: \" and the random string rnd.",
    starterCode: 'rnd = "example"\nprint(f"The input is: {rnd}")'
  },
  {
    id: 18,
    title: "18: Input",
    level: "Beginner",
    content: "To get input from a user we write: var = input(). The input is always of type string.\n\nChallenge\nBeginner\nWrite a program that get input from the user (their name), and then outputs Hello, followed by the user's name. Example: Bob -> Hello, Bob.",
    starterCode: 'name = input()\nprint(f"Hello, {name}")'
  },
  {
    id: 19,
    title: "19: Cast",
    level: "Beginner",
    content: "To convert input to a different type we need to cast: int(), float(), bool(), str().\n\nChallenge\nBeginner\nStore two inputs, cast them to float and print the multiplication of the two.",
    starterCode: 'v1 = float(input())\nv2 = float(input())\nprint(v1 * v2)'
  },
  {
    id: 20,
    title: "20: Recap Challenge (Years till 120)",
    level: "Beginner",
    content: "Challenge\nBeginner\nWrite a program that gets input from the user, his age. The program will output (print) the number of missing years till 120. For example, for input 25, the expected output is \"95 years till 120\".",
    starterCode: 'age = int(input())\nprint(f"{120 - age} years till 120")'
  },
  {
    id: 21,
    title: "21: For Loop",
    level: "Beginner",
    content: "for i in range(start, end):. The i will receive all values from start to end (not including end) sequentially.\n\nChallenge\nBeginner\nWrite a program that prints \"Hello Coddy: \" and the i value from 3 to 27.",
    starterCode: 'for i in range(3, 28):\n    print(f"Hello Coddy: {i}")'
  },
  {
    id: 22,
    title: "22: While Loop",
    level: "Beginner",
    content: "A while loop allows us to keep iterating as long as a certain condition is met.\n\nChallenge\nBeginner\nWrite a program that gets one input, float number. Use a while loop to divide the input by 2 as long as the number is bigger or equal to 3.5. Print the first number that is smaller than 3.5.",
    starterCode: 'num = float(input())\nwhile num >= 3.5:\n    num /= 2\nprint(num)'
  },
  {
    id: 23,
    title: "23: Break",
    level: "Beginner",
    content: "The break statement stops the loop instantly when it's encountered.\n\nChallenge\nBeginner\nAdd if and break statements so that only the numbers from 1 to 5 will be printed from a 1 to 10 range.",
    starterCode: 'for i in range(1, 11):\n    if i == 6: break\n    print(i)'
  },
  {
    id: 24,
    title: "24: Continue",
    level: "Beginner",
    content: "The continue statement stops the current iteration and continues to the next.\n\nChallenge\nBeginner\nAdd if and continue statements so that only the even numbers will be printed (2, 4, 6, ...).",
    starterCode: 'for i in range(1, 21):\n    if i % 2 != 0: continue\n    print(i)'
  },
  {
    id: 25,
    title: "25: Recap Challenge (Factorial)",
    level: "Beginner",
    content: "Factorial of n is the product of all positive integers less than or equal to n. 3! = 1*2*3=6.\n\nChallenge\nBeginner\nWrite a program that receives one integer input, calculates the factorial and prints it.",
    starterCode: 'n = int(input())\nf = 1\nfor i in range(1, n+1): f *= i\nprint(f)'
  },
  {
    id: 26,
    title: "26: Dynamic Input Sum",
    level: "Beginner",
    content: "Challenge\nBeginner\nFirst input is a number representing how many inputs follow. Print the sum of all following numbers.\nExample: Input 3, 1, 5, 6 -> Output 12.",
    starterCode: 'count = int(input())\ns = 0\nfor i in range(count): s += int(input())\nprint(s)'
  },
  {
    id: 27,
    title: "27: Declare a Function",
    level: "Beginner",
    content: "def function_name():. Function code must come before its call.\n\nChallenge\nEasy\nCreate a function that calculates the sum of all numbers between 1 and 10000 and prints it.",
    starterCode: 'def sum_ten_k():\n    print(sum(range(1, 10001)))\nsum_ten_k()'
  },
  {
    id: 28,
    title: "28: Arguments",
    level: "Easy",
    content: "Add arguments inside parenthesis: def name(arg1, arg2):.\n\nChallenge\nEasy\nCreate a function that gets two arguments, calculates the product of them and prints it. Call the function with input numbers.",
    starterCode: 'def prod(a, b):\n    print(a * b)\nprod(5, 10)'
  },
  {
    id: 29,
    title: "29: Return",
    level: "Easy",
    content: "The return statement specifies the value the function should produce as output.\n\nChallenge\nEasy\nCreate a function that receives two arguments and returns the bigger number. Iterate 'iterations' times, divide the bigger by 2, and print the new value.",
    starterCode: 'def get_big(a, b): return a if a > b else b\n# rest of logic goes here'
  },
  {
    id: 30,
    title: "30: Sigma Function",
    level: "Easy",
    content: "Challenge\nEasy\nWrite a function named sigma with one argument n. The function will return the sum of all numbers from 1 to n.",
    starterCode: 'def sigma(n):\n    return sum(range(1, n+1))'
  },
  {
    id: 31,
    title: "31: is_valid Function",
    level: "Easy",
    content: "Challenge\nEasy\nWrite function is_valid(username, password). Return True if user is \"admin\" (any password) or \"user\" (password \"qweasd\"). Otherwise False.",
    starterCode: 'def is_valid(u, p):\n    if u == "admin": return True\n    if u == "user" and p == "qweasd": return True\n    return False'
  },
  {
    id: 32,
    title: "32: Declaring a List",
    level: "Easy",
    content: "Lists are created using square brackets []. Separation by commas. Use len() for length.\n\nChallenge\nEasy\nCreate a list called shopping_list that contains: bread, eggs, milk, and butter.",
    starterCode: 'shopping_list = ["bread", "eggs", "milk", "butter"]'
  },
  {
    id: 33,
    title: "33: Accessing List Elements",
    level: "Easy",
    content: "Indices start from 0. To access first element: my_list[0].\n\nChallenge\nEasy\nCreate a function named values that receives a list and prints all items one after the other using len() and range().",
    starterCode: 'def values(lst):\n    for i in range(len(lst)):\n        print(lst[i])'
  },
  {
    id: 34,
    title: "34: Modifying Lists",
    level: "Easy",
    content: "Assign a new value using index: my_list[1] = \"orange\".\n\nChallenge\nEasy\nCreate a function change_element(list, index, new_element) and return the modified list.",
    starterCode: 'def change_element(l, i, v):\n    l[i] = v\n    return l'
  },
  {
    id: 35,
    title: "35: List Methods",
    level: "Easy",
    content: "append(element), clear(), pop(index), reverse(), sort().\n\nExample sort: [1, 9, 2, 3].sort() -> [1, 2, 3, 9].",
    starterCode: 'my_list = [1, 9, 2, 3]\nmy_list.sort()\nprint(my_list)'
  },
  {
    id: 36,
    title: "36: Merge Lists",
    level: "Easy",
    content: "Challenge\nEasy\nCreate a function named merge that receives two lists, merges them into one sorted list and returns it.",
    starterCode: 'def merge(l1, l2):\n    l3 = l1 + l2\n    l3.sort()\n    return l3'
  },
  {
    id: 37,
    title: "37: List Product",
    level: "Easy",
    content: "Challenge\nEasy\nWrite a function named prod which gets a list of numbers and returns the product of all numbers. For [1, 2, 3], return 6.",
    starterCode: 'def prod(lst):\n    res = 1\n    for x in lst: res *= x\n    return res'
  },
  {
    id: 38,
    title: "38: Reverse List",
    level: "Easy",
    content: "Challenge\nEasy\nWrite a function named reverse which gets a list and returns the reversed list. Don't use the built-in function!",
    starterCode: 'def reverse(lst):\n    return lst[::-1]'
  },
  {
    id: 39,
    title: "39: Loop Rehearsal",
    level: "Beginner",
    content: "Rehearsal Challenge: Write a program that gets input 1 or 0 and outputs \"T\" for 1 and \"F\" otherwise.",
    starterCode: 'i = int(input())\nprint("T" if i == 1 else "F")'
  },
  {
    id: 40,
    title: "40: Asterisk Pyramid",
    level: "Advanced",
    content: "Final Logic: Build a pyramid using string multiplication based on range steps.",
    starterCode: 'n = 7\nfor i in range(1, n + 1, 2):\n    print("*" * i)'
  }
];
