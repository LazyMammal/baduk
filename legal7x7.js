class GoLegal extends GoCaptures {
  validToPlay(x, y) {
    // check for empty spot
    if (!this.board.isEmpty(x, y)
      || this.isEye(x, y))
      return false;

    // simulate adding stone
    const sim = this.simClone();
    sim.playMove(x, y);

    // zero liberties?
    if (!sim.countLibs(x, y))
      return false;

    return !this.isRepeat(sim);
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
  return markInverse(state, moves);
}

function markInverse(state, moves) {
  const warn = "V";
  const board = parseNested(
   printBoard(state.board, { addLabels: false })
    .replaceAll(".", warn)
  );
  for (let [x, y] of moves) {
    if (board[y][x] === warn)
      board[y][x] = ".";
  }
  return printNested(board);
}

function legal7x7(input, STATE = GoLegal, BOARD = GoBoard2D) {
  const clean = cleanInput(input);
  const state = inputState(clean, STATE, BOARD);
  playRandom(state);
  return [
    markLegal(state),
    `toPlay: ${state.toPlay}`
  ].join("\n");
}
