class GoKoHack extends GoEyes_noRepeat {
  countStones(x, y) {
    if (!this.board.isStone(x, y))
      return 0;
    const followBlack = ([x, y]) => {
      const isStone = this.board.isBlack(x, y);
      stones += isStone;
      return isStone;
    }
    const followWhite = ([x, y]) => {
      const isStone = this.board.isWhite(x, y);
      stones += isStone;
      return isStone;
    }
    let stones = 0;
    DFS([x, y], xy4way,
      this.board.isBlack(x, y) ? followBlack : followWhite);
    return stones;
  }

  isSingleStone(x, y) {
    return this.countStones(x, y) === 1;
  }

  validToPlay(x, y) {
    if (!this.board.isEmpty(x, y)
      || this.isEye(x, y))
      return false;
    return this.simValid(x, y);
  }

  simValid(x, y) {
    // simulate adding stone
    const sim = this.simClone();
    let caps = sim.playMove(x, y);
    let libs = sim.countLibs(x, y);

    if (!libs) // self-capture
      return false;

    if (libs === 1
      && caps === 1
      && this.turn % 3 !== 0 // every-3rd-turn Ko hack
      && sim.isSingleStone(x, y)) {
      return false;
    }
    return true;
  }
}

function move_tests_kohack7x7(input) {
  return move_tests(input, GoKoHack);
}

function rolloutReport_kohack7x7(input, button, parent) {
  montecarlo7x7(input, button, parent, GoKoHack);
}

function kohack7x7(input, STATE = GoKoHack, BOARD = GoBoard2D) {
  let clean = cleanInput(input);
  let state = inputState(clean, STATE, BOARD);
  state.turn = window.baduk.turn ?? 0; // global variable
  playRandom(state);
  window.baduk.turn = state.turn;
  return [
    markLegal(state),
    `toPlay: ${state.toPlay}`,
    `Turn: ${state.turn}`
  ].join("\n");
}