export const clLessons = [
  {
    id: 1,
    title: "Lesson 1: Introduction to C",
    content: "C is a general-purpose programming language developed in the 1970s. It's fast, efficient, and widely used for system programming, embedded systems, and more.",
    starterCode: `#include <stdio.h>

int main() {
    printf("Hello, C!\\n");
    return 0;
}

// Challenge: Change the message to 'Hello, World!' and run it.`
  },
  {
    id: 2,
    title: "Lesson 2: Variables and Data Types",
    content: "Variables store data in C. Common types: int, float, char, double, etc.\n\nExample:\nint age = 25;\nchar grade = 'A';",
    starterCode: `#include <stdio.h>

int main() {
    int age = 25;
    char grade = 'A';
    printf("Age: %d, Grade: %c\\n", age, grade);
    return 0;
}

// Challenge: Declare a float variable 'height' and print it.`
  },
  {
    id: 3,
    title: "Lesson 3: Constants",
    content: "Constants are immutable values using 'const' keyword or #define.\n\nExample:\nconst float Pi = 3.14;\n#define MAX 100",
    starterCode: `#include <stdio.h>
#define MAX 100

int main() {
    const float Pi = 3.14;
    printf("Pi: %.2f, Max: %d\\n", Pi, MAX);
    return 0;
}

// Challenge: Add a constant for your name and print it.`
  },
  {
    id: 4,
    title: "Lesson 4: Operators",
    content: "C supports arithmetic (+,-,*,/,% ), relational (>,<,==), and logical (&&,||,!) operators.",
    starterCode: `#include <stdio.h>

int main() {
    int a = 10, b = 3;
    printf("Sum: %d\\n", a+b);
    printf("Equal? %d\\n", a==b);
    return 0;
}

// Challenge: Use modulus operator to print remainder of 10/3.`
  },
  {
    id: 5,
    title: "Lesson 5: If-Else Statements",
    content: "Conditional statements allow branching logic.\n\nExample:\nif(age >= 18) { printf(\"Adult\"); } else { printf(\"Minor\"); }",
    starterCode: `#include <stdio.h>

int main() {
    int age = 20;
    if(age >= 18) {
        printf("Adult\\n");
    } else {
        printf("Minor\\n");
    }
    return 0;
}

// Challenge: Add an 'else if' for age == 18.`
  },
  {
    id: 6,
    title: "Lesson 6: Switch Statement",
    content: "Switch allows multi-branch selection based on a variable.\n\nExample:\nswitch(day) { case 1: ... }",
    starterCode: `#include <stdio.h>

int main() {
    int day = 2;
    switch(day) {
        case 1:
            printf("Monday\\n");
            break;
        case 2:
            printf("Tuesday\\n");
            break;
        default:
            printf("Other day\\n");
    }
    return 0;
}

// Challenge: Add case 3 for Wednesday.`
  },
  {
    id: 7,
    title: "Lesson 7: Loops - For",
    content: "For loops iterate a fixed number of times.\n\nExample:\nfor(int i=0; i<5; i++) { printf(\"%d\", i); }",
    starterCode: `#include <stdio.h>

int main() {
    for(int i=0; i<5; i++) {
        printf("Number %d\\n", i);
    }
    return 0;
}

// Challenge: Print even numbers from 2 to 10.`
  },
  {
    id: 8,
    title: "Lesson 8: Loops - While",
    content: "While loops run while a condition is true.",
    starterCode: `#include <stdio.h>

int main() {
    int i = 1;
    while(i <= 5) {
        printf("%d\\n", i);
        i++;
    }
    return 0;
}

// Challenge: Print numbers from 5 to 1 using while.`
  },
  {
    id: 9,
    title: "Lesson 9: Loops - Do While",
    content: "Do-while loops run at least once before checking the condition.",
    starterCode: `#include <stdio.h>

int main() {
    int i = 1;
    do {
        printf("%d\\n", i);
        i++;
    } while(i <= 5);
    return 0;
}

// Challenge: Print 1 to 3 using do-while.`
  },
  {
    id: 10,
    title: "Lesson 10: Arrays",
    content: "Arrays store multiple elements of the same type.\n\nExample:\nint nums[5] = {1,2,3,4,5};",
    starterCode: `#include <stdio.h>

int main() {
    int nums[5] = {1,2,3,4,5};
    for(int i=0; i<5; i++) {
        printf("%d\\n", nums[i]);
    }
    return 0;
}

// Challenge: Print the third element.`
  },
  {
    id: 11,
    title: "Lesson 11: Strings",
    content: "Strings are arrays of characters. Use %s in printf to print them.\n\nExample:\nchar name[] = \"Alice\";",
    starterCode: `#include <stdio.h>

int main() {
    char name[] = "Alice";
    printf("Name: %s\\n", name);
    return 0;
}

// Challenge: Declare another string 'city' and print it.`
  },
  {
    id: 12,
    title: "Lesson 12: Functions",
    content: "Functions allow reusable code blocks.\n\nExample:\nint add(int a,int b){ return a+b; }",
    starterCode: `#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main() {
    int sum = add(5,3);
    printf("Sum: %d\\n", sum);
    return 0;
}

// Challenge: Write a function 'multiply'.`
  },
  {
    id: 13,
    title: "Lesson 13: Pointers",
    content: "Pointers store memory addresses. Use * to dereference and & to get address.",
    starterCode: `#include <stdio.h>

int main() {
    int a = 10;
    int *ptr = &a;
    printf("Value: %d\\n", *ptr);
    return 0;
}

// Challenge: Change the value of 'a' using the pointer.`
  },
  {
    id: 14,
    title: "Lesson 14: Structs",
    content: "Structs group related data together.\n\nExample:\ntypedef struct { char name[50]; int age; } Person;",
    starterCode: `#include <stdio.h>

typedef struct {
    char name[50];
    int age;
} Person;

int main() {
    Person p = {"Alice", 25};
    printf("Name: %s, Age: %d\\n", p.name, p.age);
    return 0;
}

// Challenge: Create another Person and print it.`
  },
  {
    id: 15,
    title: "Lesson 15: Typedef",
    content: "typedef creates an alias for a type.\n\nExample:\ntypedef unsigned int uint;",
    starterCode: `#include <stdio.h>

typedef unsigned int uint;

int main() {
    uint a = 100;
    printf("Value: %u\\n", a);
    return 0;
}

// Challenge: Use typedef for a struct.`
  },
  {
    id: 16,
    title: "Lesson 16: File I/O",
    content: "Read and write files using FILE* and functions like fopen, fprintf, fscanf, fclose.",
    starterCode: `#include <stdio.h>

int main() {
    FILE *fp = fopen("data.txt","w");
    fprintf(fp,"Hello C file!\\n");
    fclose(fp);
    printf("File written successfully\\n");
    return 0;
}

// Challenge: Open the file for reading and print its contents.`
  },
  {
    id: 17,
    title: "Lesson 17: Dynamic Memory",
    content: "Use malloc, calloc, realloc, free to manage memory dynamically.",
    starterCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int *arr = (int*) malloc(5 * sizeof(int));
    for(int i=0; i<5; i++) arr[i] = i+1;
    for(int i=0; i<5; i++) printf("%d\\n", arr[i]);
    free(arr);
    return 0;
}

// Challenge: Resize the array using realloc.`
  },
  {
    id: 18,
    title: "Lesson 18: Command Line Arguments",
    content: "main can accept arguments from command line: int main(int argc, char *argv[]).",
    starterCode: `#include <stdio.h>

int main(int argc, char *argv[]) {
    printf("Program name: %s\\n", argv[0]);
    if(argc > 1) printf("First argument: %s\\n", argv[1]);
    return 0;
}

// Challenge: Print all command line arguments.`
  },
  {
    id: 19,
    title: "Lesson 19: Preprocessor Directives",
    content: "#include, #define, #ifdef, #ifndef are preprocessor directives that run before compilation.",
    starterCode: `#include <stdio.h>
#define PI 3.14

int main() {
    printf("PI: %.2f\\n", PI);
    return 0;
}

// Challenge: Use #ifdef to conditionally print a message.`
  },
  {
    id: 20,
    title: "Lesson 20: Mini Project",
    content: "Combine everything learned to write a small C program that uses functions, arrays, structs, and loops.\n\nExample: A simple student management program.",
    starterCode: `#include <stdio.h>
#include <string.h>

typedef struct {
    char name[50];
    int grade;
} Student;

int main() {
    Student s1 = {"Alice", 85};
    Student s2 = {"Bob", 90};
    Student students[2] = {s1, s2};

    for(int i=0; i<2; i++) {
        printf("Name: %s, Grade: %d\\n", students[i].name, students[i].grade);
    }
    return 0;
}

// Challenge: Add a function to calculate average grade.`
  }
];
