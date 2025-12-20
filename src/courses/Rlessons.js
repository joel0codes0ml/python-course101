export const rLessons = [
  {
    id: 1,
    title: "Lesson 1: Introduction to R",
    content: "R is a programming language for statistical computing and graphics. It's widely used for data analysis, visualization, and machine learning.\n\nIn this lesson, you'll learn the basic R structure and how to run simple commands.",
    starterCode: `# Print a message
print("Hello, R!")

# Challenge: Change the message to 'Hello, World!'`
  },
  {
    id: 2,
    title: "Lesson 2: Variables and Assignment",
    content: "Variables store data. Use '<-' or '=' for assignment.\n\nExample:\nx <- 10\ny = 20\nprint(x + y)",
    starterCode: `# Declare variables
x <- 10
y <- 20
print(x + y)

# Challenge: Create a new variable 'z' as x * y and print it.`
  },
  {
    id: 3,
    title: "Lesson 3: Data Types",
    content: "R has several data types: numeric, character, logical, and factor.\n\nExample:\na <- 5       # numeric\nb <- 'Hi'    # character\nc <- TRUE    # logical",
    starterCode: `# Example data types
a <- 5
b <- "Hi"
c <- TRUE
print(a); print(b); print(c)

# Challenge: Create a factor variable for colors and print it.`
  },
  {
    id: 4,
    title: "Lesson 4: Vectors",
    content: "Vectors are ordered collections of elements of the same type.\n\nExample:\nv <- c(1,2,3,4)\nprint(v)",
    starterCode: `# Create a vector
v <- c(1,2,3,4)
print(v)

# Challenge: Create a vector of letters and print it.`
  },
  {
    id: 5,
    title: "Lesson 5: Sequences and Repetition",
    content: "Create sequences with ':' or seq() and repeat with rep().\n\nExample:\n1:5\nseq(1,10,2)\nrep(1,5)",
    starterCode: `# Sequences
print(1:5)
print(seq(1,10,2))
print(rep(1,5))

# Challenge: Create a sequence from 10 to 2 decreasing.`
  },
  {
    id: 6,
    title: "Lesson 6: Lists",
    content: "Lists can store different types of elements together.\n\nExample:\nlst <- list(name='Alice', age=25, scores=c(90,85,95))",
    starterCode: `# Create a list
lst <- list(name="Alice", age=25, scores=c(90,85,95))
print(lst)

# Challenge: Add a new element 'city' with value 'Nairobi'.`
  },
  {
    id: 7,
    title: "Lesson 7: Matrices",
    content: "Matrices are 2D data structures with elements of the same type.\n\nExample:\nm <- matrix(1:6, nrow=2, ncol=3)",
    starterCode: `# Create a matrix
m <- matrix(1:6, nrow=2, ncol=3)
print(m)

# Challenge: Create a 3x3 matrix with numbers 1-9.`
  },
  {
    id: 8,
    title: "Lesson 8: Data Frames",
    content: "Data frames store tabular data. Each column can be of a different type.\n\nExample:\ndf <- data.frame(name=c('A','B'), age=c(20,25))",
    starterCode: `# Create a data frame
df <- data.frame(name=c('A','B'), age=c(20,25))
print(df)

# Challenge: Add a new column 'city'.`
  },
  {
    id: 9,
    title: "Lesson 9: Subsetting",
    content: "Access elements in vectors, lists, and data frames using indexing.\n\nExample:\nv[1]; lst$name; df$age",
    starterCode: `# Subsetting examples
v <- c(10,20,30)
lst <- list(name="Alice", age=25)
df <- data.frame(name=c('A','B'), age=c(20,25))

print(v[1])
print(lst$name)
print(df$age)

# Challenge: Print the second element of v and the second row of df.`
  },
  {
    id: 10,
    title: "Lesson 10: Conditional Statements",
    content: "Use if, else if, else to control program flow.\n\nExample:\nif(x>0){print('Positive')} else {print('Non-positive')}",
    starterCode: `# If-else example
x <- 5
if(x > 0){
  print("Positive")
} else if (x == 0){
  print("Zero")
} else {
  print("Negative")
}

# Challenge: Change x to -3 and observe the output.`
  },
  {
    id: 11,
    title: "Lesson 11: Loops",
    content: "Use for, while, repeat loops.\n\nExample:\nfor(i in 1:5){print(i)}",
    starterCode: `# For loop
for(i in 1:5){
  print(i)
}

# Challenge: Use a while loop to print 5 to 1.`
  },
  {
    id: 12,
    title: "Lesson 12: Functions",
    content: "Functions are reusable blocks of code.\n\nExample:\nadd <- function(a,b){return(a+b)}",
    starterCode: `# Define a function
add <- function(a,b){
  return(a+b)
}
print(add(2,3))

# Challenge: Write a function multiply(a,b) and call it.`
  },
  {
    id: 13,
    title: "Lesson 13: Apply Functions",
    content: "Use apply(), lapply(), sapply() to apply a function to data.\n\nExample:\nmatrix <- matrix(1:6,2,3)\napply(matrix, 1, sum)",
    starterCode: `# Apply example
matrix <- matrix(1:6,2,3)
print(apply(matrix, 1, sum))

# Challenge: Use sapply on a vector to square each element.`
  },
  {
    id: 14,
    title: "Lesson 14: Reading/Writing Data",
    content: "Read/write CSV files using read.csv() and write.csv().",
    starterCode: `# Reading/Writing CSV
# write.csv(df, "data.csv")
# df2 <- read.csv("data.csv")
# print(df2)

# Challenge: Save your data frame and read it back.`
  },
  {
    id: 15,
    title: "Lesson 15: Packages",
    content: "R has many packages for analysis. Install with install.packages() and load with library().",
    starterCode: `# Example
# install.packages("ggplot2")
library(ggplot2)

# Challenge: Install 'dplyr' and load it.`
  },
  {
    id: 16,
    title: "Lesson 16: Plotting",
    content: "Use plot(), hist(), barplot() to visualize data.\n\nExample:\nx <- 1:5\ny <- c(2,4,6,8,10)\nplot(x,y,type='b')",
    starterCode: `# Simple plot
x <- 1:5
y <- c(2,4,6,8,10)
plot(x, y, type='b', main="Line Plot", xlab="X", ylab="Y")

# Challenge: Make a barplot of y.`
  },
  {
    id: 17,
    title: "Lesson 17: Strings",
    content: "Manipulate strings with paste(), substr(), nchar().\n\nExample:\nname <- 'Alice'\npaste('Hello', name)",
    starterCode: `# Strings example
name <- "Alice"
print(paste("Hello", name))
print(nchar(name))
print(substr(name, 1, 3))

# Challenge: Extract last two letters of a string.`
  },
  {
    id: 18,
    title: "Lesson 18: Factors",
    content: "Factors represent categorical data. Useful for statistics and modeling.\n\nExample:\ngender <- factor(c('M','F','M'))",
    starterCode: `# Factors example
gender <- factor(c('M','F','M'))
print(gender)

# Challenge: Count levels of the factor.`
  },
  {
    id: 19,
    title: "Lesson 19: Lists Advanced",
    content: "Lists can contain lists and complex objects.\n\nExample:\nmylist <- list(a=1, b=list(c=2,d=3))",
    starterCode: `# Nested list
mylist <- list(a=1, b=list(c=2, d=3))
print(mylist)

# Challenge: Access element 'd' inside the nested list.`
  },
  {
    id: 20,
    title: "Lesson 20: Mini Project",
    content: "Use what you've learned to create a small R script that reads a vector, calculates mean and plots it.",
    starterCode: `# Mini project
values <- c(10,20,30,40,50)
mean_val <- mean(values)
print(paste("Mean is", mean_val))
plot(values, type='b', main="Values Plot")

# Challenge: Extend to calculate median and add to plot.`
  }
];

