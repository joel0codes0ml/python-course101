export const cppLessons = [
  { id: 1, title: "Lesson 1: Introduction to C++", content: "C++ is a powerful object-oriented programming language. It builds on C, adding classes, objects, and the Standard Template Library (STL).", starterCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, C++!" << endl;
    return 0;
}

// Challenge: Change the message to 'Hello, World!'.` },
  { id: 2, title: "Lesson 2: Variables and Data Types", content: "C++ supports int, float, double, char, bool, and string types.\n\nExample:\nint age = 25;\ndouble pi = 3.14;", starterCode: `#include <iostream>
using namespace std;

int main() {
    int age = 25;
    double pi = 3.14;
    cout << "Age: " << age << ", Pi: " << pi << endl;
    return 0;
}

// Challenge: Declare a string variable 'name' and print it.` },
  { id: 3, title: "Lesson 3: Constants", content: "Use 'const' or '#define' to create constants.", starterCode: `#include <iostream>
#define MAX 100
using namespace std;

int main() {
    const double PI = 3.14159;
    cout << "PI: " << PI << ", Max: " << MAX << endl;
    return 0;
}

// Challenge: Add a const string for your name and print it.` },
  { id: 4, title: "Lesson 4: Operators", content: "C++ has arithmetic (+,-,*,/,%), relational (==,>,<), and logical (&&,||,!) operators.", starterCode: `#include <iostream>
using namespace std;

int main() {
    int a = 10, b = 3;
    cout << "Sum: " << a + b << endl;
    cout << "Equal? " << (a == b) << endl;
    return 0;
}

// Challenge: Print remainder of a/b using %.` },
  { id: 5, title: "Lesson 5: If-Else Statements", content: "Conditional statements control program flow.", starterCode: `#include <iostream>
using namespace std;

int main() {
    int age = 20;
    if(age > 18) {
        cout << "Adult" << endl;
    } else if(age == 18) {
        cout << "Just Adult" << endl;
    } else {
        cout << "Minor" << endl;
    }
    return 0;
}

// Challenge: Add another condition for age < 10.` },
  { id: 6, title: "Lesson 6: Switch Statement", content: "Switch allows multiple branches based on a variable.", starterCode: `#include <iostream>
using namespace std;

int main() {
    int day = 2;
    switch(day) {
        case 1: cout << "Monday" << endl; break;
        case 2: cout << "Tuesday" << endl; break;
        default: cout << "Other day" << endl;
    }
    return 0;
}

// Challenge: Add case 3 for Wednesday.` },
  { id: 7, title: "Lesson 7: Loops - For", content: "For loops iterate a fixed number of times.", starterCode: `#include <iostream>
using namespace std;

int main() {
    for(int i=0; i<5; i++) {
        cout << "Number " << i << endl;
    }
    return 0;
}

// Challenge: Print even numbers from 2 to 10.` },
  { id: 8, title: "Lesson 8: Loops - While", content: "While loops run while a condition is true.", starterCode: `#include <iostream>
using namespace std;

int main() {
    int i = 1;
    while(i <= 5) {
        cout << i << endl;
        i++;
    }
    return 0;
}

// Challenge: Print numbers from 5 to 1 using while.` },
  { id: 9, title: "Lesson 9: Loops - Do While", content: "Do-while loops run at least once before checking the condition.", starterCode: `#include <iostream>
using namespace std;

int main() {
    int i = 1;
    do {
        cout << i << endl;
        i++;
    } while(i <= 5);
    return 0;
}

// Challenge: Print 1 to 3 using do-while.` },
  { id: 10, title: "Lesson 10: Arrays", content: "Arrays store multiple elements of the same type.", starterCode: `#include <iostream>
using namespace std;

int main() {
    int nums[5] = {1,2,3,4,5};
    for(int i=0; i<5; i++) cout << nums[i] << endl;
    return 0;
}

// Challenge: Print the third element.` },
  { id: 11, title: "Lesson 11: Strings", content: "C++ has both C-style strings (char arrays) and std::string.", starterCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string name = "Alice";
    cout << "Name: " << name << endl;
    return 0;
}

// Challenge: Declare another string 'city' and print it.` },
  { id: 12, title: "Lesson 12: Functions", content: "Functions allow reusable code blocks.", starterCode: `#include <iostream>
using namespace std;

int add(int a, int b) {
    return a + b;
}

int main() {
    cout << "Sum: " << add(5,3) << endl;
    return 0;
}

// Challenge: Write a function 'multiply'.` },
  { id: 13, title: "Lesson 13: Pointers", content: "Pointers store memory addresses. Use * to dereference and & to get address.", starterCode: `#include <iostream>
using namespace std;

int main() {
    int a = 10;
    int *ptr = &a;
    cout << "Value: " << *ptr << endl;
    return 0;
}

// Challenge: Change value of 'a' using pointer.` },
  { id: 14, title: "Lesson 14: References", content: "References are aliases for variables, declared with &.", starterCode: `#include <iostream>
using namespace std;

int main() {
    int a = 10;
    int &ref = a;
    ref = 20;
    cout << "a: " << a << endl;
    return 0;
}

// Challenge: Create a reference for another variable.` },
  { id: 15, title: "Lesson 15: Classes & Objects", content: "Classes define objects with attributes and methods.", starterCode: `#include <iostream>
using namespace std;

class Person {
public:
    string name;
    int age;
    void greet() {
        cout << "Hello, I am " << name << endl;
    }
};

int main() {
    Person p;
    p.name = "Alice";
    p.age = 25;
    p.greet();
    return 0;
}

// Challenge: Create another Person object.` },
  { id: 16, title: "Lesson 16: Constructors", content: "Constructors initialize objects automatically when created.", starterCode: `#include <iostream>
using namespace std;

class Person {
public:
    string name;
    int age;
    Person(string n, int a) {
        name = n;
        age = a;
    }
    void greet() { cout << "Hello, I am " << name << endl; }
};

int main() {
    Person p("Alice", 25);
    p.greet();
    return 0;
}

// Challenge: Create another Person with a different name.` },
  { id: 17, title: "Lesson 17: Vectors", content: "Vectors are dynamic arrays from the STL (Standard Template Library).", starterCode: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {1,2,3,4,5};
    for(int n : nums) cout << n << endl;
    return 0;
}

// Challenge: Add two more numbers to the vector and print.` },
  { id: 18, title: "Lesson 18: Inheritance", content: "Inheritance allows one class to extend another.", starterCode: `#include <iostream>
using namespace std;

class Animal {
public:
    void eat() { cout << "Eating..." << endl; }
};

class Dog : public Animal {
public:
    void bark() { cout << "Bark!" << endl; }
};

int main() {
    Dog d;
    d.eat();
    d.bark();
    return 0;
}

// Challenge: Create a Cat class that inherits Animal.` },
  { id: 19, title: "Lesson 19: File I/O", content: "Read and write files using fstream.", starterCode: `#include <iostream>
#include <fstream>
using namespace std;

int main() {
    ofstream out("data.txt");
    out << "Hello, file!" << endl;
    out.close();
    ifstream in("data.txt");
    string line;
    getline(in, line);
    cout << line << endl;
    in.close();
    return 0;
}

// Challenge: Write multiple lines and read them back.` },
  { id: 20, title: "Lesson 20: Mini Project", content: "Combine what you've learned to make a small program using classes, vectors, and file I/O.\n\nExample: Student Management System.", starterCode: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Student {
public:
    string name;
    int grade;
    Student(string n, int g) { name = n; grade = g; }
};

int main() {
    vector<Student> students;
    students.push_back(Student("Alice",85));
    students.push_back(Student("Bob",90));
    
    for(Student s : students) {
        cout << s.name << " - " << s.grade << endl;
    }
    return 0;
}

// Challenge: Add a function to calculate average grade of students.` }
];
