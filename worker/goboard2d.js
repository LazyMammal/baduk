class Pos {
  x;
  y;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const key = (pos) => pos.x << 5 | pos.y;

const passAction = new Pos(-1, -1);

class GoBoard2D {
  size;
  board;
  constructor(size) {
    this.size = size;
    this.board = Array(size * size).fill(GO_EMPTY);
  }
  allMoves() {
    const moves = [];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        moves.push(new Pos(x, y));
      }
    }
    return moves;
  }
  adjacent(pos) {
    const max = this.size - 1;
    const { x, y } = pos;
    const moves = [];
    if (y > 0)
      moves.push(new Pos(x, y - 1));
    if (x > 0)
      moves.push(new Pos(x - 1, y));
    if (x < max)
      moves.push(new Pos(x + 1, y));
    if (y < max)
      moves.push(new Pos(x, y + 1));
    return moves;
  }
  diagonal(pos) {
    const max = this.size - 1;
    const { x, y } = pos;
    const moves = [];
    const ysub = y > 0;
    const xsub = x > 0;
    const xinc = x < max;
    const yinc = y < max;
    if (xsub && ysub)
      moves.push(new Pos(x - 1, y - 1));
    if (xinc && ysub)
      moves.push(new Pos(x + 1, y - 1));
    if (xsub && yinc)
      moves.push(new Pos(x - 1, y + 1));
    if (xinc && yinc)
      moves.push(new Pos(x + 1, y + 1));
    return moves;
  }
  xy2pos(x, y) {
    return new Pos(x, y);
  }
  pos2xy(pos) {
    return pos; // {x, y}
  }
  firstPos() { return new Pos(0, 0) }
  _xyValid(pos) {
    const { x, y } = pos;
    return x >= 0 && x < this.size
      && y >= 0 && y < this.size;
  }
  setCode(pos, val) {
    this.board[this.size * pos.y + pos.x] = val;
  }
  getCode(pos) {
    return this.board[this.size * pos.y + pos.x];
  }
  getColour(pos) { return GO_CHARS[this.getCode(pos)] }
  isEmpty(pos) { return this.getCode(pos) === GO_EMPTY }
  isBlack(pos) { return this.getCode(pos) === GO_BLACK }
  isWhite(pos) { return this.getCode(pos) === GO_WHITE }
  isStone(pos) { return this.getCode(pos) & GO_STONE }
  isOOB(pos) { return this.getCode(pos) === GO_OOB }
  setEmpty(pos) { this.setCode(pos, GO_EMPTY) }
  setBlack(pos) { this.setCode(pos, GO_BLACK) }
  setWhite(pos) { this.setCode(pos, GO_WHITE) }

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
        let char = this.getColour(new Pos(x, y));
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