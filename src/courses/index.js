// src/courses/index.js

import * as htmlModule from "./html.js";
import * as cssModule from "./css.js";
import * as pythonModule from "./python.js";
import * as cModule from "./clessons.js";
import * as cppModule from "./cpplessons.js";
import * as goModule from "./golessons.js";
import * as sqlModule from "./sqllessons.js";
import * as rModule from "./Rlessons.js";

// This helper function finds the first array in each file so you don't have to worry about variable names
const extractLessons = (module) => {
  const key = Object.keys(module).find(k => Array.isArray(module[k]));
  return module[key] || [];
};

export const htmlLessons = extractLessons(htmlModule);
export const cssLessons = extractLessons(cssModule);
export const pythonLessons = extractLessons(pythonModule);
export const clLessons = extractLessons(cModule);
export const cppLessons = extractLessons(cppModule);
export const goLessons = extractLessons(goModule);
export const sqlLessons = extractLessons(sqlModule);
export const rLessons = extractLessons(rModule);
