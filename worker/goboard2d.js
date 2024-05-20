class GoBoard2D {
  size;
  board;
  constructor(size) {
    this.size = size;
    this.board = createNested(size, GO_EMPTY);
  }
  _xyValid(x, y) {
    return x >= 0 && x < this.size
      && y >= 0 && y < this.size;
  }
  setCode(x, y, val) {
    if (this._xyValid(x, y))
      this.board[y][x] = val;
  }
  getCode(x, y) {
    if (this._xyValid(x, y))
      return this.board[y][x];
    return GO_OOB;
  }
  getColour(x, y) { return GO_CHARS[this.getCode(x, y)] }
  isEmpty(x, y) { return this.getCode(x, y) === GO_EMPTY }
  isBlack(x, y) { return this.getCode(x, y) === GO_BLACK }
  isWhite(x, y) { return this.getCode(x, y) === GO_WHITE }
  isStone(x, y) { return this.getCode(x, y) & GO_STONE }
  isOOB(x, y) { return this.getCode(x, y) === GO_OOB }
  setEmpty(x, y) { this.setCode(x, y, GO_EMPTY) }
  setBlack(x, y) { this.setCode(x, y, GO_BLACK) }
  setWhite(x, y) { this.setCode(x, y, GO_WHITE) }

  loadNested(nested) {
    for (let y = 0; y < nested.length && y < this.size; y++) {
      for (let x = 0; x < nested[y].length && x < this.size; x++) {
        this.board[y][x] = GO_CODES[nested[y][x]] ?? GO_EMPTY;
      }
    }
  }

  printBoard({
    addLabels = true, // axis labels
    pad = 1           // column width
  } = {}) {
    let res = [];
    if (addLabels) {
      let line = [];
      for (let x = 0; x < this.size; x++) {
        line[x] = xLabel(x).padStart(pad, " ");
      }
      res.push(line.join(" "));
    }
    for (let y = this.size - 1; y >= 0; y--) {
      let row = [];
      for (let x = 0; x < this.size; x++) {
        let char = this.getColour(x, y);
        row.push(`${char}`.padStart(pad, " "));
      }
      if (addLabels)
        row.push(`:${yLabel(y)}`); // ":yLabel"
      res.push(row.join(" "));
    }
    return res.join("\n");
  }
}

function parseBoard2D(input) {
  const text = input.length ? input : defaultInput;
  const nested = text2nested(text);
  const size = nested[0].length;
  const board = new GoBoard2D(size);
  board.loadNested(nested);
  return board;
}