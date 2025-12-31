import { pythonLessons } from "./python.js";
import { htmlLessons } from "./html.js";
import { clLessons } from "./clessons.js";
import { cppLessons } from "./cpplessons.js";
import { cssLessons } from "./css.js";
import { goLessons } from "./golessons.js";
import { sqlLessons } from "./sqllessons.js";
import { rLessons } from "./Rlessons.js";

export const allCourses = {
  PYTHON: { icon: "🐍", lessons: pythonLessons },
  SQL: { icon: "🗄️", lessons: sqlLessons },
  HTML: { icon: "🌐", lessons: htmlLessons },
  CSS: { icon: "🎨", lessons: cssLessons },
  GO: { icon: "🐹", lessons: goLessons },
  C: { icon: "⚙️", lessons: clLessons },
  CPP: { icon: "🚀", lessons: cppLessons },
  R: { icon: "📊", lessons: rLessons }
};
