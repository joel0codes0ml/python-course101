// src/courses/index.js

import { htmlLessons } from "./html.js";
import { cssLessons } from "./css.js";
// FIXED: This must match your filename "coursespython.js" exactly
import { pythonLessons } from "./coursespython.js"; 
import { clLessons } from "./clessons.js";
import { cppLessons } from "./cpplessons.js";
import { golessons as goLessons } from "./golessons.js";
import { sqllessons as sqlLessons } from "./sqllessons.js";
// FIXED: Note the Capital "R" to match your file "Rlessons.js"
import { Rlessons as rLessons } from "./Rlessons.js";

export {
  htmlLessons,
  pythonLessons,
  clLessons,
  cppLessons,
  cssLessons,
  goLessons,
  sqlLessons,
  rLessons,
};
