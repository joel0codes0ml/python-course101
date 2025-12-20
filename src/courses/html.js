export const htmlLessons = [
  {
    id: 1,
    title: "Lesson 1: What is HTML?",
    content: "HTML (HyperText Markup Language) is the language used to structure content on the web. Learn tags, elements, and attributes.",
    starterCode: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>My First Page</title>\n  </head>\n  <body>\n    <!-- Your content here -->\n  </body>\n</html>`
  },
  {
    id: 2,
    title: "Lesson 2: HTML Document Structure",
    content: "The basic HTML document has a doctype, html, head, and body sections.",
    starterCode: `<!DOCTYPE html>\n<html>\n<head>\n  <title>Structure</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>`
  },
  {
    id: 3,
    title: "Lesson 3: Headings",
    content: "Headings define sections. Use <h1> to <h6> for different heading sizes.",
    starterCode: `<h1>Heading 1</h1>\n<h2>Heading 2</h2>\n<h3>Heading 3</h3>`
  },
  {
    id: 4,
    title: "Lesson 4: Paragraphs & Text",
    content: "Use <p> to add text paragraphs.",
    starterCode: `<p>This is a paragraph of text.</p>`
  },
  {
    id: 5,
    title: "Lesson 5: Line Breaks & Comments",
    content: "Use <br> for line breaks and <!-- --> for comments.",
    starterCode: `<!-- This is a comment -->\n<p>Line1<br>Line2</p>`
  },
  {
    id: 6,
    title: "Lesson 6: Lists (ul, ol)",
    content: "Create ordered (<ol>) and unordered (<ul>) lists.",
    starterCode: `<ul>\n  <li>Item A</li>\n  <li>Item B</li>\n</ul>`
  },
  {
    id: 7,
    title: "Lesson 7: Links (Anchors)",
    content: "Use <a> with href to link to other pages.",
    starterCode: `<a href="https://example.com">Visit Example</a>`
  },
  {
    id: 8,
    title: "Lesson 8: Images",
    content: "Add images using <img> with src and alt attributes.",
    starterCode: `<img src="https://via.placeholder.com/150" alt="Example Image">`
  },
  {
    id: 9,
    title: "Lesson 9: Div & Span",
    content: "Containers: <div> for blocks, <span> for inline.",
    starterCode: `<div>This is a block</div>\n<span>This is inline</span>`
  },
  {
    id: 10,
    title: "Lesson 10: Tables",
    content: "Create tabular data with <table>, <tr>, <th>, <td>.",
    starterCode: `<table>\n  <tr><th>Col1</th><th>Col2</th></tr>\n  <tr><td>A</td><td>B</td></tr>\n</table>`
  },
  {
    id: 11,
    title: "Lesson 11: Forms",
    content: "Basic forms use <form>, <input>, <button>.",
    starterCode: `<form>\n  <input type="text" placeholder="Your name">\n  <button>Submit</button>\n</form>`
  },
  {
    id: 12,
    title: "Lesson 12: Input Types",
    content: "Explore different input types: text, email, password.",
    starterCode: `<input type="email" placeholder="Enter email">`
  },
  {
    id: 13,
    title: "Lesson 13: Semantic Tags",
    content: "Use semantic tags: <header>, <nav>, <main>, <footer>.",
    starterCode: `<header>Header</header>\n<nav>Menu</nav>`
  },
  {
    id: 14,
    title: "Lesson 14: Meta Tags",
    content: "Add <meta> in the <head> for charset, viewport, description.",
    starterCode: `<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  },
  {
    id: 15,
    title: "Lesson 15: Embedding Video",
    content: "Use <video> to embed playable video.",
    starterCode: `<video controls>\n  <source src="video.mp4" type="video/mp4">\n</video>`
  },
  {
    id: 16,
    title: "Lesson 16: Audio Elements",
    content: "Add audio with <audio> and controls.",
    starterCode: `<audio controls>\n  <source src="audio.mp3" type="audio/mp3">\n</audio>`
  },
  {
    id: 17,
    title: "Lesson 17: iFrame",
    content: "Embed other pages with <iframe>.",
    starterCode: `<iframe src="https://example.com" width="300" height="200"></iframe>`
  },
  {
    id: 18,
    title: "Lesson 18: HTML Entities",
    content: "Use entities like &amp;, &lt;, &gt; to show special characters.",
    starterCode: `<p>Use &amp; for an ampersand.</p>`
  },
  {
    id: 19,
    title: "Lesson 19: Linking CSS",
    content: "Add external styles with <link rel=\"stylesheet\">.",
    starterCode: `<link rel="stylesheet" href="styles.css">`
  },
  {
    id: 20,
    title: "Lesson 20: Create Your First Page",
    content: "Apply what you learned to build a simple webpage.",
    starterCode: `<!DOCTYPE html>\n<html>\n<body>\n  <h1>My Web Page</h1>\n  <p>Written in HTML!</p>\n</body>\n</html>`
  }
];
