class Board2D {
  /* 
  Board2D
  - intentionally abstracted
  - can be extended or used as template
  */
  #_size;
  #_data;
  #_empty;
  #_oob;
  constructor(size, empty = ".", oob = "#") {
    this.#_size = size;
    this.#_data = {}; // not an array!
    this.#_empty = empty;
    this.#_oob = oob;
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
      return this.#_data[this._key(x, y)] ?? this.#_empty;
    return this.#_oob;
  }
  set(x, y, val) {
    if (this._xyValid(x, y))
      this.#_data[this._key(x, y)] = val;
  }
}

function parse(input, TYPE = Board2D) {
  /*
  parse()
  - knows the internal structure of `text`
  - cannot know the internals of TYPE
  */
  if (!Array.isArray(input)) {
    input = input.split("\n").map(r => r.split(" "));
  }
  const board = new TYPE(input[0].length);
  for (let y = 0; y < input.length; y++) {
    const row = input[y];
    for (let x = 0; x < row.length; x++) {
      board.set(x, board.size - y - 1, row[x]);
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

function printBoard(board, {
  addLabels = true, // axis labels
  pad = 1,          // column width
  dotZero = true    // replace /0/,"."
} = {}) {
  let res = [];
  if (addLabels)
    res.push(_.range(board.size).map(
      col => xLabel(col).padStart(pad, " ")
    ).join(" "));
  for (let y = board.size - 1; y >= 0; y--) {
    let row = [];
    for (let x = 0; x < board.size; x++) {
      const piece = board.get(x, y);
      const char = dotZero && piece === 0 ? "." : piece;
      row.push(`${char}`.padStart(pad, " "));
    }
    if (addLabels)
      row.push(`:${yLabel(y)}`); // ":yLabel"
    res.push(row.join(" "));
  }
  return res.join("\n");
}

function board7x7(input) { // final output
  return printBoard(parse(input));
}