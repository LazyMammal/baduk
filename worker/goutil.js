importScripts("lodash.min.js"); // _.shuffle _.sample _.clamp

const GO_EMPTY = 0;
const GO_BLACK = 1;
const GO_WHITE = 2;
const GO_STONE = 3;
const GO_OOB = 4;
const GO_CHARS = {
  [GO_EMPTY]: ".",
  [GO_BLACK]: "B",
  [GO_WHITE]: "W",
  [GO_STONE]: "?",
  [GO_OOB]: "#"
};
const GO_CODES = {
  ".": GO_EMPTY,
  "B": GO_BLACK,
  "W": GO_WHITE,
  "?": GO_STONE,
  "#": GO_OOB
};

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

function parseProps(text) {
  text = text.replaceAll(" ", "").trim();
  if (!text.length) return {};
  const lines = text.split("\n");
  const extra = lines.slice(lines[0].length);
  if (!extra.length) return {};
  return Object.fromEntries(
    extra.map(line => line.split(":")
      .map(field => field.trim())
    )
  );
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

function printPadded(nested, flip = true, pad = 1) {
  let array = nested.map(row => row
    .map(col => `${col}`.padStart(pad, " "))
    .join(" "));
  if (flip) array.reverse();
  return array.join("\n");
}
