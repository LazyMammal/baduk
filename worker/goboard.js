const key = (pos) => pos;

const passAction = 0;

class GoBoard2D {
  size;
  board;
  constructor(size) {
    this.size = size;
    const W = this.size + 1;
    const length = (W + 1) * W + 1;
    this.board = new Int32Array(length);
    for (let i = 0; i < W; i++) {
      this.board[i] = GO_OOB; // Out-Of-Bounds
      this.board[(i + 1) * W] = GO_OOB;
      this.board[length - i - 1] = GO_OOB;
    }
  }

  clone() {
    return new this.constructor(this.size, this.board.slice());
  }

  allMoves() {
    const last = this.lastPos();
    const moves = [];
    for (let pos = this.firstPos(); pos <= last; pos++) {
      if (this.board[pos] === GO_EMPTY)
        moves.push(pos);
    }
    return moves;
  }

  setCode(pos, val) { if (this.board[pos] !== GO_OOB) this.board[pos] = val }
  getCode(pos) { return this.board[pos] }

  isEmpty(pos) { return this.board[pos] === GO_EMPTY }
  isBlack(pos) { return this.board[pos] === GO_BLACK }
  isWhite(pos) { return this.board[pos] === GO_WHITE }
  isStone(pos) { return this.board[pos] & GO_STONE }
  getColour(pos) { return GO_CHARS[this.board[pos]] }

  setEmpty(pos) { this.setCode(pos, GO_EMPTY) }

  xy2pos(x, y) {
    return (x + 1) + (y + 1) * (this.size + 1);
  }

  pos2xy(pos) {
    const W = this.size + 1;
    return {
      x: (pos % W) - 1,
      y: Math.floor(pos / W) - 1
    }
  }

  firstPos() {
    return this.xy2pos(0, 0);
  }

  lastPos() {
    const L = this.size - 1;
    return this.xy2pos(L, L);
  }

  _xyValid(pos) {
    const { x, y } = this.pos2xy(pos);
    return x >= 0 && x < this.size
      && y >= 0 && y < this.size;
  }

  adjacent(pos) { // cardinal neighbours
    const W = this.size + 1;
    return [-W, -1, 1, W].map(i => i + pos);
  }

  diagonal(pos) { // diagonal neighbours
    const W = this.size + 1;
    return [-W - 1, -W + 1, W - 1, W + 1]
      .map(i => i + pos);
  }

  patch3x3(pos) { // 3x3 patch
    const W = this.size + 1;
    return [
      -W - 1, -W, -W + 1,
      -1, 0, 1,
      W - 1, W, W + 1,
    ].map(i => i + pos);
  }

  donut3x3(pos) { // 3x3 donut (8 adjacent)
    const W = this.size + 1;
    return [
      -W - 1, -W, -W + 1,
      -1, 1, // skip self
      W - 1, W, W + 1,
    ].map(i => i + pos);
  }

  nthLine(num) { // num = 0 to size-1
    // "ring of positions" along Nth line from edge
    const flip = this.size - 1 - num;
    const count = flip - num;
    const coord = [];
    for (let i = 0; i < count; i++) {
      coord.push(this.xy2pos(num, num + i));
      coord.push(this.xy2pos(num + i, flip));
      coord.push(this.xy2pos(flip, flip - i));
      coord.push(this.xy2pos(flip - i, num));
    }
    return coord;
  }

  loadNested(nested) {
    for (let y = 0; y < nested.length && y < this.size; y++) {
      for (let x = 0; x < nested[y].length && x < this.size; x++) {
        this.board[this.xy2pos(x, y)] = GO_CODES[nested[y][x]];
      }
    }
  }

  printBoard({
    addLabels = true, // axis labels
    pad = 1           // column width
  } = {}) {
    const res = [];
    if (addLabels) {
      let line = [];
      for (let x = 0; x < this.size; x++) {
        line[x] = xLabel(x).padStart(pad, " ");
      }
      res.push(line.join(" "));
    }
    for (let y = this.size - 1; y >= 0; y--) {
      const row = [];
      for (let x = 0; x < this.size; x++) {
        const pos = this.xy2pos(x, y)
        const char = GO_CHARS[this.board[pos]];
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