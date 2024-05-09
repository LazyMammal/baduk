class GoRepeat extends GoLegal {
  history;
  constructor(board, toPlay, turn = 0, history = {}) {
    super(board, toPlay, turn);
    this.history = history;
    this.addHistory();
  }

  simClone() { // disable history in clone
    const board = parse(printBoard(this.board, { addLabels: false }));
    return new this.constructor(board, this.toPlay, this.turn, null);
  }

  addHistory() {
    if (this.history) {
      this.history[hash(this.board)] = this.turn;
    }
  }

  isRepeat(state) {
    if (!this.history)
      return false;
    const stateHash = hash(state.board);
    const isRep = stateHash in this.history;
    return isRep;
  }

  playMove(x, y) {
    super.playMove(x, y);
    this.addHistory();
  }
}

function hash(board) {
  return printBoard(board, { addLabels: false })
    .replaceAll(/[ \n]/g, "");
}

function repetition7x7(input, options, STATE = GoRepeat, BOARD = GoBoard2D) {
  const clean = cleanInput(input);
  const state = inputState(clean, STATE, BOARD);
  state.history = Object.assign(
    window.baduk.history, // persist between [Run] clicks
    state.history
  );
  playRandom(state);
  return [
    markLegal(state),
    `toPlay: ${state.toPlay}`
  ].join("\n");
}