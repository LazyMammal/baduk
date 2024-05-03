class GoState {
  board;
  toPlay;
  constructor(board, toPlay) {
    this.board = board;
    this.toPlay = toPlay;
  }
  nextToPlay(toPlay = this.toPlay) {
    return toPlay === "B" ? "W" : "B";
  }
  validToPlay(x, y, toPlay = this.toPlay) {
    // check for empty spot
    const isEmpty = this.board.get(x, y) === ".";
    // TODO: simulate adding stone
    // TODO: any captures?
    // TODO: non-zero liberties?
    return isEmpty;
  }
  moveList(toPlay = this.toPlay) {
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
    this.board.set(x, y, this.toPlay);
    // TODO: check for captures
    // TODO: remove captured chains
    this.toPlay = this.nextToPlay();
  }
}

function state7x7(input) {
  // retrieve current game state from input
  const board = input ? parse(input) : new Board2D(7);
  const lines = input.split("\n").slice(board.size);
  const toPlay = input ? lines[0].slice(-1) : "B";

  // model game state
  const state = new GoState(board, toPlay);

  // play random move
  const moves = state.moveList(toPlay);
  let [x, y] = _.sample(moves);
  state.playMove(x, y);

  return [
    printBoard(board, { addLabels: false }),
    `toPlay: ${state.toPlay}`
  ].join("\n");
}