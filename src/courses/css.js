export const cssLessons = [
  {
    id: 201,
    title: "What is CSS?",
    content: "CSS (Cascading Style Sheets) is used to style HTML elements.",
    starterCode: `/* Write your CSS here */\nbody {\n  background-color: white;\n}`
  },
  {
    id: 202,
    title: "Selectors",
    content: "Use selectors to target HTML elements, e.g., h1, p, .class, #id.",
    starterCode: `h1 {\n  color: red;\n}`
  },
  {
    id: 203,
    title: "Colors",
    content: "CSS allows colors by name, hex, rgb, or hsl.",
    starterCode: `p {\n  color: #4ade80;\n}`
  },
  {
    id: 204,
    title: "Fonts",
    content: "Change font-family, font-size, font-weight.",
    starterCode: `h1 {\n  font-family: Arial, sans-serif;\n  font-size: 24px;\n}`
  },
  {
    id: 205,
    title: "Text Alignment",
    content: "Use text-align to left, center, or right.",
    starterCode: `p {\n  text-align: center;\n}`
  },
  {
    id: 206,
    title: "Backgrounds",
    content: "Set background color or images.",
    starterCode: `body {\n  background-color: #1e293b;\n}`
  },
  {
    id: 207,
    title: "Margins",
    content: "Space outside elements.",
    starterCode: `div {\n  margin: 20px;\n}`
  },
  {
    id: 208,
    title: "Padding",
    content: "Space inside elements.",
    starterCode: `div {\n  padding: 15px;\n}`
  },
  {
    id: 209,
    title: "Borders",
    content: "Add border style, width, and color.",
    starterCode: `div {\n  border: 2px solid #ef4444;\n}`
  },
  {
    id: 210,
    title: "Width & Height",
    content: "Control element dimensions.",
    starterCode: `div {\n  width: 200px;\n  height: 100px;\n}`
  },
  {
    id: 211,
    title: "Display",
    content: "Change layout using display: block, inline, flex, grid.",
    starterCode: `div {\n  display: flex;\n  justify-content: center;\n}`
  },
  {
    id: 212,
    title: "Positioning",
    content: "Use static, relative, absolute, fixed, sticky.",
    starterCode: `div {\n  position: relative;\n  top: 10px;\n}`
  },
  {
    id: 213,
    title: "Flexbox Basics",
    content: "Align items with flex container.",
    starterCode: `div.container {\n  display: flex;\n  justify-content: space-between;\n}`
  },
  {
    id: 214,
    title: "Grid Basics",
    content: "CSS Grid layout.",
    starterCode: `div.container {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n}`
  },
  {
    id: 215,
    title: "Pseudo-classes",
    content: "Style elements in states, e.g., :hover, :focus.",
    starterCode: `button:hover {\n  background-color: #ef4444;\n}`
  },
  {
    id: 216,
    title: "Pseudo-elements",
    content: "Target parts of elements, e.g., ::before, ::after.",
    starterCode: `p::before {\n  content: "★ ";\n}`
  },
  {
    id: 217,
    title: "Opacity & Visibility",
    content: "Control transparency or visibility.",
    starterCode: `div {\n  opacity: 0.5;\n}`
  },
  {
    id: 218,
    title: "Box Shadow",
    content: "Add shadows to elements.",
    starterCode: `div {\n  box-shadow: 2px 2px 5px #000;\n}`
  },
  {
    id: 219,
    title: "Text Shadow",
    content: "Add shadows to text.",
    starterCode: `h1 {\n  text-shadow: 2px 2px #ef4444;\n}`
  },
  {
    id: 220,
    title: "Create Your First Styled Page",
    content: "Combine HTML + CSS for a complete page.",
    starterCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { background-color: #1e293b; color: #fff; }
h1 { color: #ef4444; text-align: center; }
</style>
</head>
<body>
<h1>My Styled Page</h1>
<p>CSS is fun!</p>
</body>
</html>`
  }
];
