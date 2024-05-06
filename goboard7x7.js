const GO_EMPTY = 0;
const GO_BLACK = 1;
const GO_WHITE = 2;
const GO_STONE = 3;
const GO_OOB = 4;
const GO_CHARS = [".", "B", "W", "?", "#"];
const GO_CODES = { ".": 0, "B": 1, "W": 2, "?": 3, "#": 4 };

class GoBoard2D {
  /* 
  GoBoard2D
  - customized for Go stones
  - intentionally abstracted
  - can be extended or used as template
  */
  _size;
  _data;
  constructor(size) {
    this._size = size;
    this._data = {}; // not an array!
  }
  get size() {
    return this._size;
  }
  _key = (x, y) => `${x}|${y}`;

  _xyValid(x, y) {
    return x >= 0 && x < this._size
      && y >= 0 && y < this._size;
  }
  setCode(x, y, val) {
    if (this._xyValid(x, y))
      this._data[this._key(x, y)] = val;
  }
  getCode(x, y) {
    if (this._xyValid(x, y))
      return this._data[this._key(x, y)] ?? GO_EMPTY;
    return GO_OOB;
  }
  getColour = (x, y) => GO_CHARS[this.getCode(x, y)];
  isEmpty = (x, y) => this.getCode(x, y) === GO_EMPTY;
  isBlack = (x, y) => this.getCode(x, y) === GO_BLACK;
  isWhite = (x, y) => this.getCode(x, y) === GO_WHITE;
  isStone = (x, y) => this.getCode(x, y) & GO_STONE;
  isOOB = (x, y) => this.getCode(x, y) === GO_OOB;
  setEmpty(x, y) { this.setCode(x, y, GO_EMPTY) }
  setBlack(x, y) { this.setCode(x, y, GO_BLACK) }
  setWhite(x, y) { this.setCode(x, y, GO_WHITE) }
}

function parse(input, BOARD = GoBoard2D) {
  /*
  parse()
  - knows the internal structure of `input` (text)
  - cannot know the internals of BOARD class
  */
  if (!Array.isArray(input)) {
    input = parseNested(input);
  }
  const board = new BOARD(input[0].length);
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      switch (input[y][x]) {
        case "B":
          board.setBlack(x, y);
          break;
        case "W":
          board.setWhite(x, y);
          break;
      }
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
  pad = 1           // column width
} = {}) {
  let res = [];
  if (addLabels)
    res.push(_.range(board.size).map(
      col => xLabel(col).padStart(pad, " ")
    ).join(" "));
  for (let y = board.size - 1; y >= 0; y--) {
    let row = [];
    for (let x = 0; x < board.size; x++) {
      let char = board.getColour(x, y);
      row.push(`${char}`.padStart(pad, " "));
    }
    if (addLabels)
      row.push(`:${yLabel(y)}`); // ":yLabel"
    res.push(row.join(" "));
  }
  return res.join("\n");
}

function goboard7x7(input) {
  return printBoard(parse(input, GoBoard2D));
}