class GoRepeat extends GoLegal {
  constructor(board, toPlay) {
    super(board, toPlay);
    addHistory(this.board, this.turn);
  }
  isRepeat(board = this.board) {
    const isRep = hash(board) in window.baduk.history;
    if (isRep) {
      const turn = window.baduk.history[hash(board)];
      const diff = this.turn - turn;
      const maxDiff = window.baduk.historyDepth ?? 0;
      if (diff > maxDiff) {
        window.baduk.historyDepth = diff;
      }
    }
    return isRep;
  }
  playMove(x, y) {
    super.playMove(x, y);
    addHistory(this.board, this.turn);
  }
}

window.baduk.history = {};

function hash(board) {
  return printBoard(board, { addLabels: false })
    .replaceAll(/[ \n]/g, "");
}

function addHistory(board, turn) {
  window.baduk.history[hash(board)] = turn;
}

function repetition7x7(input) {
  return legal7x7(input, GoRepeat);
}