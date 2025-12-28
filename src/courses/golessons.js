export const golessons = [
  { id: 1, title: "Lesson 1: Introduction to Go", content: "Go (Golang) is a statically typed, compiled language designed at Google. It's known for simplicity, performance, and concurrency support.\n\nIn this lesson, you'll learn the basic structure of a Go program.", starterCode: `package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}

// Challenge: Change the message to 'Hello, World!' and run it.` },
  { id: 2, title: "Lesson 2: Variables and Types", content: "Variables in Go are declared using the 'var' keyword or short declaration ':='. Go supports types like int, float64, string, and bool.\n\nExample:\nvar age int = 25\nname := \"Alice\"", starterCode: `package main

import "fmt"

func main() {
    var age int = 25
    name := "Alice"
    fmt.Println(name, "is", age, "years old.")
}

// Challenge: Declare a new variable 'city' and print it.` },
  { id: 3, title: "Lesson 3: Constants", content: "Constants are immutable values declared using the 'const' keyword. They cannot be changed after declaration.\n\nExample:\nconst Pi = 3.14", starterCode: `package main

import "fmt"

func main() {
    const Pi = 3.14
    fmt.Println("Pi is", Pi)
}

// Challenge: Add a constant 'Language' with value 'Go' and print it.` },
  { id: 4, title: "Lesson 4: Functions", content: "Functions allow you to organize code into reusable blocks. Use 'func' to define a function.\n\nExample:\nfunc add(a int, b int) int { return a + b }", starterCode: `package main

import "fmt"

func add(a int, b int) int {
    return a + b
}

func main() {
    sum := add(5, 3)
    fmt.Println("Sum is", sum)
}

// Challenge: Write a function 'multiply' and use it.` },
  { id: 5, title: "Lesson 5: Loops", content: "Go has only one loop type: 'for'. It can act like a while loop, for-each loop, or traditional for loop.\n\nExample:\nfor i := 0; i < 5; i++ { fmt.Println(i) }", starterCode: `package main

import "fmt"

func main() {
    for i := 0; i < 5; i++ {
        fmt.Println("Number", i)
    }
}

// Challenge: Write a loop that prints even numbers from 2 to 10.` },
  { id: 6, title: "Lesson 6: If-Else Statements", content: "Use if-else statements to execute code based on conditions.\n\nExample:\nif age >= 18 { fmt.Println(\"Adult\") } else { fmt.Println(\"Minor\") }", starterCode: `package main

import "fmt"

func main() {
    age := 20
    if age >= 18 {
        fmt.Println("Adult")
    } else {
        fmt.Println("Minor")
    }
}

// Challenge: Add an 'else if' for age == 18.` },
  { id: 7, title: "Lesson 7: Switch Statements", content: "Switch statements allow multi-branch selection. They are often cleaner than multiple if-else statements.\n\nExample:\nswitch day {\n case 1: fmt.Println(\"Monday\")\n case 2: fmt.Println(\"Tuesday\")\n default: fmt.Println(\"Other\")\n}", starterCode: `package main

import "fmt"

func main() {
    day := 2
    switch day {
    case 1:
        fmt.Println("Monday")
    case 2:
        fmt.Println("Tuesday")
    default:
        fmt.Println("Other")
    }
}

// Challenge: Add a case for 3 => Wednesday.` },
  { id: 8, title: "Lesson 8: Arrays", content: "Arrays store fixed-size sequences of elements of the same type.\n\nExample:\nvar numbers [3]int = [3]int{1,2,3}", starterCode: `package main

import "fmt"

func main() {
    numbers := [3]int{1,2,3}
    fmt.Println(numbers)
}

// Challenge: Print the second element of the array.` },
  { id: 9, title: "Lesson 9: Slices", content: "Slices are dynamically-sized, more flexible arrays.\n\nExample:\nnumbers := []int{1,2,3}\nnumbers = append(numbers, 4)", starterCode: `package main

import "fmt"

func main() {
    numbers := []int{1,2,3}
    numbers = append(numbers, 4)
    fmt.Println(numbers)
}

// Challenge: Remove the first element using slicing.` },
  { id: 10, title: "Lesson 10: Maps", content: "Maps are key-value stores.\n\nExample:\nm := map[string]int{\"Alice\": 25, \"Bob\": 30}", starterCode: `package main

import "fmt"

func main() {
    m := map[string]int{"Alice":25, "Bob":30}
    fmt.Println(m)
}

// Challenge: Add a new key-value pair 'Charlie': 22.` },
  { id: 11, title: "Lesson 11: Structs", content: "Structs are collections of fields that group related data.\n\nExample:\ntype Person struct { Name string; Age int }", starterCode: `package main

import "fmt"

type Person struct {
    Name string
    Age  int
}

func main() {
    p := Person{Name:"Alice", Age:25}
    fmt.Println(p)
}

// Challenge: Create another Person and print it.` },
  { id: 12, title: "Lesson 12: Pointers", content: "Pointers store the memory address of a value. Use '*' to dereference and '&' to get the address.", starterCode: `package main

import "fmt"

func main() {
    a := 10
    ptr := &a
    fmt.Println("Value:", *ptr)
}

// Challenge: Change the value using the pointer and print it.` },
  { id: 13, title: "Lesson 13: Packages and Imports", content: "Go code is organized into packages. Use 'import' to include external packages.\n\nExample:\nimport \"fmt\"", starterCode: `package main

import "fmt"

func main() {
    fmt.Println("Using the fmt package")
}

// Challenge: Import 'math' and print math.Sqrt(16).` },
  { id: 14, title: "Lesson 14: Error Handling", content: "Go handles errors explicitly with multiple return values.\n\nExample:\nval, err := strconv.Atoi(\"123\")", starterCode: `package main

import (
    "fmt"
    "strconv"
)

func main() {
    val, err := strconv.Atoi("123")
    if err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Println("Value:", val)
    }
}

// Challenge: Try converting a non-number string and print the error.` },
  { id: 15, title: "Lesson 15: Goroutines", content: "Goroutines are lightweight threads managed by Go.\n\nExample:\ngo sayHello()", starterCode: `package main

import (
    "fmt"
    "time"
)

func sayHello() {
    fmt.Println("Hello from goroutine")
}

func main() {
    go sayHello()
    time.Sleep(time.Second)
}

// Challenge: Launch 3 goroutines that print numbers 1 to 3.` },
  { id: 16, title: "Lesson 16: Channels", content: "Channels allow goroutines to communicate safely.\n\nExample:\nch := make(chan int)", starterCode: `package main

import "fmt"

func main() {
    ch := make(chan int)
    
    go func() {
        ch <- 42
    }()
    
    val := <-ch
    fmt.Println("Received:", val)
}

// Challenge: Send 2 numbers in separate goroutines and receive them.` },
  { id: 17, title: "Lesson 17: For-Range Loops", content: "Use 'for range' to iterate over arrays, slices, maps, and strings.", starterCode: `package main

import "fmt"

func main() {
    nums := []int{1,2,3}
    for i, v := range nums {
        fmt.Println(i, v)
    }
}

// Challenge: Iterate over a map and print key-value pairs.` },
  { id: 18, title: "Lesson 18: Defer", content: "'defer' schedules a function call to run after the surrounding function completes.\n\nUseful for cleanup tasks.", starterCode: `package main

import "fmt"

func main() {
    defer fmt.Println("Goodbye!")
    fmt.Println("Hello!")
}

// Challenge: Use defer to close a file or print multiple messages.` },
  { id: 19, title: "Lesson 19: Interfaces", content: "Interfaces define behavior. Any type that implements the interface methods satisfies it.\n\nExample:\ntype Shape interface { Area() float64 }", starterCode: `package main

import "fmt"

type Shape interface {
    Area() float64
}

type Square struct {
    Side float64
}

func (s Square) Area() float64 {
    return s.Side * s.Side
}

func main() {
    sq := Square{Side:5}
    var s Shape = sq
    fmt.Println("Area:", s.Area())
}

// Challenge: Create a Circle type that implements Shape.` },
  { id: 20, title: "Lesson 20: Building a Small Program", content: "Apply everything you learned to build a small Go program that reads user input, processes it, and prints output.", starterCode: `package main

import "fmt"

func main() {
    var name string
    fmt.Print("Enter your name: ")
    fmt.Scanln(&name)
    fmt.Println("Hello,", name)
}

// Challenge: Extend this program to ask age and calculate birth year.` }
];

