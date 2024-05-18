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
    return new this.constructor(this.size, this.board.clone());
  }

  swapPlayer() { this.player ^= GO_STONE }

  toString() {
    return this.board.printBoard({ addLabels: false });
  }
}

function parse(text) {
  const nested = Array.isArray(text) ? text : text2nested(text);
  const size = nested[0].length;
  const board = new GoBoard2D(size);
  board.loadNested(nested);
  return new GoState(size, board);
}
