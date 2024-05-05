class GoState {
  board;
  toPlay;
  turn;
  isColour;
  setColour;
  constructor(board, toPlay, turn = 0) {
    this.board = board;
    this.toPlay = toPlay;
    this.turn = turn;
    this.isColour = {
      "B": (x, y) => this.board.isBlack(x, y),
      "W": (x, y) => this.board.isWhite(x, y),
    };
    this.setColour = {
      "B": (x, y) => this.board.setBlack(x, y),
      "W": (x, y) => this.board.setWhite(x, y),
    };
  }

  nextToPlay() {
    return this.toPlay === "B" ? "W" : "B";
  }

  validToPlay(x, y) {
    return this.board.isEmpty(x, y);
  }

  moveList() {
    const moves = [];
    for (let y = 0; y < this.board.size; y++) {
      for (let x = 0; x < this.board.size; x++) {
        if (this.validToPlay(x, y))
          moves.push([x, y]);
      }
    }
    return moves;
  }

  playMove(x, y) {
    this.setColour[this.toPlay](x, y);
    this.toPlay = this.nextToPlay();
    this.turn++;
  }
}

function inputState(input, TYPE = GoState) {
  // retrieve current game state from input
  const board = input ? parse(input) : new GoBoard2D(7);
  const lines = input.split("\n").slice(board.size);
  const toPlay = lines.length ? lines[0].slice(-1) : "B";
  return new TYPE(board, toPlay);
}

function playRandom(state) {
  const moves = state.moveList();
  if (moves.length) {
    let [x, y] = _.sample(moves); // random
    state.playMove(x, y);
    return true;
  } else {
    state.playMove(-1, -1);
    return false;
  }
}

function state7x7(input, TYPE = GoState) {
  const state = inputState(input, TYPE);
  playRandom(state);
  return [
    printBoard(state.board, { addLabels: false }),
    `toPlay: ${state.toPlay}`
  ].join("\n");
}
