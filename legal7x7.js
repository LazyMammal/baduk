class GoLegal extends GoCaptures {
  validToPlay(x, y, toPlay = this.toPlay) {
    // check for empty spot
    if (this.board.get(x, y) !== "."
      || this.isEye(x, y, toPlay))
      return false;

    // simulate adding stone
    const board = parse(printBoard(this.board, {
      addLabels: false
    }));
    const state = new GoLegal(board, toPlay);
    state.playMove(x, y);

    // zero liberties?
    if (!state.countLibs(x, y))
      return false;

    return !this.isRepeat(board);
  }

  isEye(x, y, toPlay = this.toPlay) {
    return false; // TODO: real or false eye?
  }

  isRepeat(board = this.board) {
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
