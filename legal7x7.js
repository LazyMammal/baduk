class GoLegal extends GoCaptures {
  validToPlay(x, y) {
    // check for empty spot
    if (this.board.get(x, y) !== "."
      || this.isEye(x, y))
      return false;

    // simulate adding stone
    const state = this.simClone();
    state.playMove(x, y);

    // zero liberties?
    if (!state.countLibs(x, y))
      return false;

    return !this.isRepeat(state);
  }

  simClone() {
    const board = parse(printBoard(this.board, { addLabels: false }));
    return new this.constructor(board, this.toPlay, this.turn);
  }

  isEye(x, y) {
    return false; // TODO: real or false eye?
  }

  isRepeat(state) {
    return false; // TODO: check history
  }
}

function cleanInput(input) {
  return !input ? input :
    input.replaceAll(/[^BW#\n ]/g, ".");
}

function markLegal(state) {
  const moves = state.moveList();
  markInverse(state, moves);
}

function markInverse(state, moves) {
  const warn = "V";
  for (let y = 0; y < state.board.size; y++) {
    for (let x = 0; x < state.board.size; x++) {
      if (state.board.get(x, y) === ".")
        state.board.set(x, y, warn);
    }
  }
  for (let [x, y] of moves) {
    if (state.board.get(x, y) === warn)
      state.board.set(x, y, ".");
  }
}

function legal7x7(input, TYPE = GoLegal) {
  const clean = cleanInput(input);
  const state = inputState(clean, TYPE);
  playRandom(state);
  markLegal(state);
  return printState(state);
}
