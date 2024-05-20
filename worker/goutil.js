importScripts("lodash.min.js"); // _.shuffle(), _.sample()

const GO_EMPTY = 0;
const GO_BLACK = 1;
const GO_WHITE = 2;
const GO_STONE = 3;
const GO_OOB = 4;
const GO_CHARS = [".", "B", "W", "?", "#"];
const GO_CODES = { ".": 0, "B": 1, "W": 2, "?": 3, "#": 4 };

const defaultInput = ".......\n".repeat(7);

const badge = (success) => success ?
  '<mark>PASS</mark>' : '<mark warn>FAIL</mark>';

function xLabel(col) { // ABCDEFGH_JKLM... skip "I"
  return String.fromCharCode(col + (col < 8 ? 65 : 66));
}

function yLabel(row) { // 1,2,3...
  return `${1 + row}`;
}

function text2nested(text, flip = true) {
  const lines = text.replaceAll(" ", "").split("\n");
  const array = lines.map(r => r.split(""));
  array.length = array[0].length; // make square
  if (flip) array.reverse();
  return array;
}

function createNested(size, fill) {
  return Array(size).fill(0)
    .map(() => Array(size).fill(fill));
}

function printNested(nested, flip = true) {
  let array = nested.map(row => row.join(" "));
  if (flip) array.reverse();
  return array.join("\n").trim();
}
