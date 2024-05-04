class GoRepeat extends GoLegal {
  isRepeat(board = this.board) {
    return hash(board) in window.baduk.history;
  }
  playMove(x, y) {
    super.playMove(x, y);
    incHistory(this.board);
  }
}

window.baduk.history = {};

function hash(board) {
  return printBoard(board, { addLabels: false })
    .replaceAll(/[ \n]/g, "");
}

function incHistory(board) {
  window.baduk.history[hash(board)] = 1
    + (window.baduk.history[hash(board)] ?? 0);
}

function repetition7x7(input) {
  return legal7x7(input, GoRepeat);
}