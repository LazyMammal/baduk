class GoState {
  board;
  turn;
  playerCode;
  enemyCode;
  constructor(board, playerCode = GO_BLACK, turn = 0) {
    this.board = board;
    this.turn = turn;
    this.playerCode = playerCode;
    this.enemyCode = playerCode ^ GO_STONE;
  }

  moveList() {
    const moves = [];
    for (let pos of this.board.allMoves()) {
      if (this.validToPlay(pos))
        moves.push(pos);
    }
    return moves;
  }

  eraseChain(pos) {
    if ((this.board.board[pos] & GO_STONE) === 0)
      return 0;
    const followBlack = (pos) => {
      if (this.board.board[pos] !== GO_BLACK)
        return false;
      this.board.board[pos] = GO_EMPTY;
      caps++;
      return true;
    }
    const followWhite = (pos) => {
      if (this.board.board[pos] !== GO_WHITE)
        return false;
      this.board.board[pos] = GO_EMPTY;
      caps++;
      return true;
    }
    let caps = 0;
    DFS2(this.board.size, pos, (pos) => this.board.adjacent(pos),
      (this.board.board[pos] === GO_BLACK) ? followBlack : followWhite
    );
    return caps;
  }

  isSingleStone(pos) {
    if ((this.board.board[pos] & GO_STONE) === 0)
      return 0;
    let stones = 0;
    const followBlack = (pos) => {
      const isStone = this.board.board[pos] === GO_BLACK;
      stones += isStone;
      return isStone;
    }
    const followWhite = (pos) => {
      const isStone = this.board.board[pos] === GO_WHITE;
      stones += isStone;
      return isStone;
    }
    const earlyExit = () => {
      return stones > 1; // found refutation
    }
    DFS2(this.board.size, pos, (pos) => this.board.adjacent(pos),
      (this.board.board[pos] === GO_BLACK) ? followBlack : followWhite,
      earlyExit
    );
    return stones === 1;
  }

  libsLimit(pos, limit = 0) {
    if ((this.board.board[pos] & GO_STONE) === 0)
      return 0;
    let libs = 0;
    const followBlack = (pos) => {
      libs += this.board.board[pos] === GO_EMPTY;
      return this.board.board[pos] === GO_BLACK;
    }
    const followWhite = (pos) => {
      libs += this.board.board[pos] === GO_EMPTY;
      return this.board.board[pos] === GO_WHITE;
    }
    const earlyExit = () => {
      return libs > limit; // found refutation
    }
    DFS2(this.board.size, pos, (pos) => this.board.adjacent(pos),
      (this.board.board[pos] === GO_BLACK) ? followBlack : followWhite,
      earlyExit
    );
    return libs <= limit;
  }

  playMove(pos) {
    if(this.board.board[pos] !== GO_EMPTY) {
      console.log("ERROR: playing illegal move");
    }
    this.board.board[pos] = this.playerCode;
    let caps = 0;
    for (let adj of this.board.adjacent(pos)) {
      if (this.board.board[adj] === this.enemyCode
        && this.libsLimit(adj)) { // capture
        caps += this.eraseChain(adj);
      }
    }
    this.advanceTurn();
    return caps;
  }

  advanceTurn() {
    this.playerCode ^= GO_STONE;
    this.enemyCode ^= GO_STONE;
    this.turn++;
  }

  validToPlay(pos) {
    if (this.board.board[pos] !== GO_EMPTY) {
      return false; // not empty
    }

    let enemyCount = 0; // prep for eye check
    let playerCount = 0;
    let cache4way = [];
    for (let adj of this.board.adjacent(pos)) {
      const code = this.board.board[adj];
      if (code === GO_EMPTY) {
        return true; // adjacent liberty
      }
      enemyCount += code === this.enemyCode;
      playerCount += code === this.playerCode;
      cache4way.push([adj, code]);
    }
    if (!(enemyCount || this._falseEye(pos))) {
      return false; // self-eye
    }
    let caps = 0; // number of captures available
    for (let [adj, code] of cache4way) {
      if (code === this.playerCode
        && !this.libsLimit(adj, 1)) { // > 1
        return true; // safely merge
      }
      if (code === this.enemyCode
        && this.libsLimit(adj, 1) // atari == 1
      ) {
        const isOne = this.isSingleStone(adj);
        if (!isOne || ++caps > 1) {
          return true; // safely capture two+
        }
      }
    }

    if (caps && !playerCount) { // ko-like
      return this.turn % 3 === 0; // valid every 3rd turn
    }
    return caps > 0; // valid if capture
  }

  _falseEye(pos) {
    let edgeCount = 0;
    let enemyCount = 0;
    for (let diag of this.board.diagonal(pos)) {
      const code = this.board.board[diag];
      enemyCount += code === this.enemyCode;
      edgeCount += code === GO_OOB;
    }
    if ((edgeCount && enemyCount)
      || enemyCount > 1)
      return true; // false eye (diagonal)
    return false; // probably an eye!
  }

  playRandom() {
    const moves = this.moveList();
    if (moves.length) {
      this.playMove(_.sample(moves)); // random
      return true;
    } else {
      this.advanceTurn();
      return false;
    }
  }

  doRollout() {
    const enemy = this.playerCode; // already played
    const player = this.enemyCode;
    let passTurn = 0;
    for (let t = 0; t < 100 && passTurn < 2; t++) {
      passTurn = this.playRandom() ? 0 : passTurn + 1;
    }
    const score = scoreBoard(this.board);
    const win = score[player] > score[enemy]; // TODO: komi
    return win * 2 - 1; // -1 or +1
  }

  replayMove(pos) {
    if (pos !== passAction) {
      this.playMove(pos);
    } else {
      this.advanceTurn(); // pass
    }
  }

  simClone() {
    return _.cloneDeep(this);
  }
}

function markLegal(state) {
  const moves = state.moveList();
  const warn = "V";
  const board = text2nested(
    state.board.printBoard({ addLabels: false })
      .replaceAll(".", warn)
  );
  for (let pos of moves) {
    const { x, y } = state.board.pos2xy(pos);
    if (board[y][x] === warn)
      board[y][x] = ".";
  }
  return printNested(board);
}