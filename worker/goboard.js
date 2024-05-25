const passAction = 21 * 21;

class GoBoard2D {
  size;
  board;
  constructor(size) {
    this.size = size;
    this.board = Array(size * size).fill(GO_EMPTY);
  }
  allMoves() {
    const moves = [];
    for (let pos = 0; pos < this.board.length; pos++) {
      moves.push(pos);
    }
    return moves;
  }
  allEmpty() {
    const moves = [];
    for (let pos = 0; pos < this.board.length; pos++) {
      if (this.board[pos] === GO_EMPTY)
        moves.push(pos);
    }
    return moves;
  }
  adjacent(pos) {
    const max = this.size - 1;
    const x = pos % this.size;
    const moves = [];
    if (pos >= this.size)
      moves.push(pos - this.size);
    if (x !== 0)
      moves.push(pos - 1);
    if (x !== max)
      moves.push(pos + 1);
    if (pos + this.size < this.board.length)
      moves.push(pos + this.size);
    return moves;
  }
  diagonal(pos) {
    const max = this.size - 1;
    const x = pos % this.size;
    const moves = [];
    const ysub = pos >= this.size;
    const xsub = x !== 0;
    const xinc = x !== max;
    const yinc = pos + this.size < this.board.length;
    if (xsub && ysub)
      moves.push(pos - this.size - 1);
    if (xinc && ysub)
      moves.push(pos - this.size + 1);
    if (xsub && yinc)
      moves.push(pos + this.size - 1);
    if (xinc && yinc)
      moves.push(pos + this.size + 1);
    return moves;
  }
  patch3x3(pos) {
    const max = this.size - 1;
    const x = pos % this.size;
    const moves = [pos];
    const ysub = pos >= this.size;
    const xsub = x !== 0;
    const xinc = x !== max;
    const yinc = pos + this.size < this.board.length;
    if (ysub)
      moves.push(pos - this.size);
    if (xsub)
      moves.push(pos - 1);
    if (xinc)
      moves.push(pos + 1);
    if (yinc)
      moves.push(pos + this.size);
    if (xsub && ysub)
      moves.push(pos - this.size - 1);
    if (xinc && ysub)
      moves.push(pos - this.size + 1);
    if (xsub && yinc)
      moves.push(pos + this.size - 1);
    if (xinc && yinc)
      moves.push(pos + this.size + 1);
    return moves;
  }
  nthLine(num) { // num = 0 to size-1
    // "ring of positions" along Nth line from edge
    const flip = this.size - 1 - num;
    const count = flip - num;
    const moves = [];
    for (let i = 0; i < count; i++) {
      moves.push(this.xy2pos(num, num + i));
      moves.push(this.xy2pos(num + i, flip));
      moves.push(this.xy2pos(flip, flip - i));
      moves.push(this.xy2pos(flip - i, num));
    }
    return moves;
  }
  xy2pos(x, y) {
    return this.size * y + x;
  }
  pos2xy(pos) {
    return {
      x: pos % this.size,
      y: ~~(pos / this.size)
    };
  }
  firstPos() { return 0 }
  _xyValid(pos) {
    const { x, y } = pos;
    return x >= 0 && x < this.size
      && y >= 0 && y < this.size;
  }
  setCode(pos, val) {
    this.board[pos] = val;
  }
  getCode(pos) {
    return this.board[pos];
  }
  getColour(pos) { return GO_CHARS[this.board[pos]] }
  isEmpty(pos) { return this.board[pos] === GO_EMPTY }
  isBlack(pos) { return this.board[pos] === GO_BLACK }
  isWhite(pos) { return this.board[pos] === GO_WHITE }
  isStone(pos) { return this.board[pos] & GO_STONE }
  isOOB(pos) { return this.board[pos] === GO_OOB }
  setEmpty(pos) { this.board[pos] = GO_EMPTY }
  setBlack(pos) { this.board[pos] = GO_BLACK }
  setWhite(pos) { this.board[pos] = GO_WHITE }

  loadNested(nested) {
    for (let y = 0; y < nested.length && y < this.size; y++) {
      for (let x = 0; x < nested[y].length && x < this.size; x++) {
        this.board[this.size * y + x] = GO_CODES[nested[y][x]] ?? GO_EMPTY;
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
        let char = this.getColour(this.xy2pos(x, y));
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

function theFirstStep(input) {
  const board = parseBoard2D(input);
  return board.printBoard();
}