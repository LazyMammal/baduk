class GoLegal extends GoCaptures {
  validToPlay(x, y, toPlay = this.toPlay) {
    // check for empty spot
    if (this.board.get(x, y) !== ".")
      return false;

    // simulate adding stone
    const board = parse(printBoard(this.board, {
      addLabels: false
    }));
    const state = new GoLegal(board, toPlay);
    state.playMove(x, y);

    // non-zero liberties?
    return state.countLibs(x, y) > 0;
  }
}

function legal7x7(input) {
  return state7x7(input, GoLegal);
}