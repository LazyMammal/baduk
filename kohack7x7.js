class GoKoHack extends GoEyes_noRepeat {
  constructor(board, toPlay, turn = 0) {
    super(board, toPlay, turn);
  }

  countStones(x, y) {
    let stoneType = this.board.get(x, y);
    if (stoneType !== "B" && stoneType !== "W")
      return 0;
    let stones = 0;
    const followStoneType = ([x, y]) => {
      const piece = this.board.get(x, y);
      const isStone = piece === stoneType;
      stones += isStone;
      return isStone;
    }
    DFS([x, y], xy4way, followStoneType);
    return stones;
  }

  validToPlay(x, y) {
    // check for empty spot
    if (this.board.get(x, y) !== "."
      || this.isEye(x, y))
      return false;

    // simulate adding stone
    const state = this.simClone();
    let caps = state.playMove(x, y);
    let libs = state.countLibs(x, y);

    if (!libs) // self-capture
      return false;
    
    if (libs === 1
      && caps === 1
      && this.turn % 3 !== 0 // every-3rd-turn Ko hack
      && state.countStones(x, y) === 1) {
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

function kohack7x7(input, TYPE = GoKoHack) {
  let clean = cleanInput(input);
  let state = inputState(clean, TYPE);
  state.turn = window.baduk.turn ?? 0; // global variable
  playRandom(state);
  markLegal(state);
  window.baduk.turn = state.turn;
  return [
    printState(state),
    `Turn: ${state.turn}`
  ].join("\n");
}