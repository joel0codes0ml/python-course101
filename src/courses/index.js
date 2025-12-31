// src/courses/index.js

import * as htmlMod from "./html.js";
import * as cssMod from "./css.js";
import * as pythonMod from "./python.js";
import * as cMod from "./clessons.js";
import * as cppMod from "./cpplessons.js";
import * as goMod from "./golessons.js";
import * as sqlMod from "./sqllessons.js";
import * as rMod from "./Rlessons.js";

// This helper function finds the data array inside each file 
// regardless of how you capitalized the variable name inside the file.
const getLessons = (mod) => {
  return Object.values(mod).find(val => Array.isArray(val)) || [];
};

// THESE NAMES MUST MATCH YOUR App.jsx IMPORTS EXACTLY
export const htmlLessons = getLessons(htmlMod);
export const cssLessons = getLessons(cssMod);
export const pythonLessons = getLessons(pythonMod);
export const clLessons = getLessons(cMod);
export const cppLessons = getLessons(cppMod);
export const goLessons = getLessons(goMod);
export const sqlLessons = getLessons(sqlMod);
export const rLessons = getLessons(rMod);
