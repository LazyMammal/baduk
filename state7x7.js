class GoState {
  board;
  toPlay;
  turn;
  constructor(board, toPlay, turn = 0) {
    this.board = board;
    this.toPlay = toPlay;
    this.turn = turn;
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

  isColour(x, y, val) {
    return val === "B" ?
      this.board.isBlack(x, y)
      : this.board.isWhite(x, y);
  }

  setColour(x, y, val) {
    if (val === "B") {
      this.board.setBlack(x, y);
    } else if (val === "W") {
      this.board.setWhite(x, y);
    }
  }

  playMove(x, y) {
    this.setColour(x, y, this.toPlay);
    this.toPlay = this.nextToPlay();
    this.turn++;
  }
}

function inputState(input, STATE = GoState, BOARD = GoBoard2D) {
  // retrieve current game state from input
  const board = input ? parse(input, BOARD) : new BOARD(7);
  const lines = input.split("\n").slice(board.size);
  let toPlay = "B";
  if(lines.length && lines[0].startsWith("toPlay")) {
    toPlay = lines[0].slice(-1) === "B" ? "B" : "W";
  }
  return new STATE(board, toPlay);
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

function state7x7(input, options, STATE = GoState, BOARD = GoBoard2D) {
  const state = inputState(input, STATE, BOARD);
  playRandom(state);
  return [
    printBoard(state.board, { addLabels: false }),
    `toPlay: ${state.toPlay}`
  ].join("\n");
}
