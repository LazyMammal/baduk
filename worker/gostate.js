console.assert(GO_BLACK !== undefined);
console.assert(makeBoard !== undefined);

class GoState {
  size;
  board;
  player;
  constructor(size, board, player = GO_BLACK) {
    this.size = size;
    this.board = board;
    this.player = player;
  }

  clone() {
    return new this.constructor(this.size, cloneBoard(this.board));
  }

  swapPlayer() { this.player ^= GO_STONE }

  toString() {
    return printBoard(this.board, this.size, { addLabels: false });
  }
}

function parse(text) {
  const nested = Array.isArray(text) ? text : text2nested(text);
  const size = nested[0].length;
  const board = makeBoard(size);
  loadNested(board, nested, size);
  return new GoState(size, board);
}
