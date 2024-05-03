class Board2D {
  /* 
  Board2D
  - intentionally abstracted
  - can be extended or used as template
  */
  #_size;
  #_data;
  constructor(size) {
    this.#_size = size;
    this.#_data = {}; // not an array!
  }
  get size() {
    return this.#_size;
  }
  _key(x, y) {
    return `${x}|${y}`;
  }
  _xyValid(x, y) {
    return x >= 0 && x < this.#_size
      && y >= 0 && y < this.#_size;
  }
  get(x, y) {
    if (this._xyValid(x, y))
      return this.#_data[this._key(x, y)] ?? ".";
    return "#";
  }
  set(x, y, val) {
    if (this._xyValid(x, y))
      this.#_data[this._key(x, y)] = val;
  }
}

function parse(text, TYPE = Board2D) {
  /*
  parse()
  - knows the internal structure of `text`
  - cannot know the internals of TYPE
  */
  const arr = text.split("\n").map(r => r.split(" "));
  const board = new TYPE(arr.length);
  for (let y = 0; y < arr.length; y++) {
    const row = arr[y];
    for (let x = 0; x < row.length; x++) {
      board.set(x, y, row[x]);
    }
  }
  return board;
}

function xLabel(col) { // ABCDEFGH_JKLM... skip "I"
  return String.fromCharCode(col + (col < 8 ? 65 : 66));
}

function yLabel(row) { // 1,2,3...
  return `${1 + row}`;
}

function printBoard(board, addLabels = false) {
  let res = [];
  if (addLabels)
    res.push(_.range(board.size).map(xLabel).join(" "));
  for (let y = 0; y < board.size; y++) {
    let row = [];
    for (let x = 0; x < board.size; x++) {
      row.push(board.get(x, y));
    }
    if (addLabels)
      row.push(`:${board.size - y}`); // ":yLabel"
    res.push(row.join(" "));
  }
  return res.join("\n");
}

function board7x7(input) { // final output
  return printBoard(parse(input), true);
}