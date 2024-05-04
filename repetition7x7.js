class GoRepeat extends GoLegal {
  isRepeat(board = this.board) {
    return false; // TODO: check history
  }
}

function repetition7x7(input) {
  return legal7x7(input, GoRepeat);
}