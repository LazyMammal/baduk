class GoBoard2D {
  /* 
  GoBoard2D
  - customized for Go stones
  - intentionally abstracted
  - can be extended or used as template
  */
  _size;
  _data;
  _empty;
  _oob;
  _black;
  _white;
  constructor(size,
    empty = ".",
    oob = "#",
    black = "B",
    white = "W") {
    this._size = size;
    this._data = {}; // not an array!
    this._empty = empty;
    this._oob = oob;
    this._black = black;
    this._white = white;
  }
  get size() {
    return this._size;
  }
  _key = (x, y) => `${x}|${y}`;

  _xyValid(x, y) {
    return x >= 0 && x < this._size
      && y >= 0 && y < this._size;
  }
  _get(x, y) {
    if (this._xyValid(x, y))
      return this._data[this._key(x, y)] ?? this._empty;
    return this._oob;
  }
  _set(x, y, val) {
    if (this._xyValid(x, y))
      this._data[this._key(x, y)] = val;
  }
  getColour = (x, y) => this._get(x, y);
  isOOB = (x, y) => this._get(x, y) === this._oob;
  isEmpty = (x, y) => this._get(x, y) === this._empty;
  isBlack = (x, y) => this._get(x, y) === this._black;
  isWhite = (x, y) => this._get(x, y) === this._white;
  isStone = (x, y) => {
    const piece = this._get(x, y);
    return piece === this._black || piece === this._white;
  }
  setEmpty(x, y) { this._set(x, y, this._empty) }
  setBlack(x, y) { this._set(x, y, this._black) }
  setWhite(x, y) { this._set(x, y, this._white) }

}

function parse(input, TYPE = GoBoard2D) {
  /*
  parse()
  - knows the internal structure of `input` (text)
  - cannot know the internals of TYPE
  */
  if (!Array.isArray(input)) {
    input = parseNested(input);
  }
  const board = new TYPE(input[0].length);
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
      let char = ".";
      if (board.isBlack(x, y))
        char = "B";
      if (board.isWhite(x, y))
        char = "W";
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