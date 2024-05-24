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
      const { x, y } = pos;
      if (this.validToPlay(x, y))
        moves.push(pos);
    }
    return moves;
  }

  eraseChain(x, y) {
    if (!this.board.isStone(x, y))
      return 0;
    const followBlack = ({ x, y }) => {
      if (!this.board.isBlack(x, y))
        return false;
      this.board.setEmpty(x, y);
      caps++;
      return true;
    }
    const followWhite = ({ x, y }) => {
      if (!this.board.isWhite(x, y))
        return false;
      this.board.setEmpty(x, y);
      caps++;
      return true;
    }
    let caps = 0;
    DFS({ x: x, y: y }, xy4way,
      this.board.isBlack(x, y) ? followBlack : followWhite);
    return caps;
  }

  isSingleStone(x, y) {
    if (!this.board.isStone(x, y))
      return 0;
    let stones = 0;
    const followBlack = ({ x, y }) => {
      const isStone = this.board.isBlack(x, y);
      stones += isStone;
      return isStone;
    }
    const followWhite = ({ x, y }) => {
      const isStone = this.board.isWhite(x, y);
      stones += isStone;
      return isStone;
    }
    const earlyExit = () => {
      return stones > 1; // found refutation
    }
    DFS({ x: x, y: y }, xy4way,
      this.board.isBlack(x, y) ? followBlack : followWhite,
      earlyExit
    );
    return stones === 1;
  }

  libsLimit(x, y, limit = 0) {
    if (!this.board.isStone(x, y))
      return 0;
    let libs = 0;
    const followBlack = ({ x, y }) => {
      libs += this.board.isEmpty(x, y);
      return this.board.isBlack(x, y);
    }
    const followWhite = ({ x, y }) => {
      libs += this.board.isEmpty(x, y);
      return this.board.isWhite(x, y);
    }
    const earlyExit = () => {
      return libs > limit; // found refutation
    }
    DFS({ x: x, y: y }, xy4way,
      this.board.isBlack(x, y) ? followBlack : followWhite,
      earlyExit
    );
    return libs <= limit;
  }

  playMove(x, y) {
    this.board.setCode(x, y, this.playerCode);
    let caps = 0;
    for (let adj of xy4way({ x: x, y: y })) {
      if (this.board.getCode(adj.x, adj.y) === this.enemyCode
        && this.libsLimit(adj.x, adj.y)) { // capture
        caps += this.eraseChain(adj.x, adj.y);
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

  validToPlay(x, y) {
    if (!this.board.isEmpty(x, y)) {
      return false; // not empty
    }

    let enemyCount = 0; // prep for eye check
    let playerCount = 0;
    let cache4way = [];
    for (let adj of xy4way({ x: x, y: y })) {
      if (this.board.isEmpty(adj.x, adj.y)) {
        return true; // adjacent liberty
      }
      const code = this.board.getCode(adj.x, adj.y);
      cache4way.push({ adj: adj, code: code });
      enemyCount += code === this.enemyCode;
      playerCount += code === this.playerCode;
    }
    if (!(enemyCount || this._falseEye(x, y))) {
      return false; // self-eye
    }

    let caps = 0; // number of captures available
    for (let { adj, code } of cache4way) {
      if (code === this.playerCode
        && !this.libsLimit(adj.x, adj.y, 1)) { // > 1
        return true; // safely merge
      }
      if (code === this.enemyCode
        && this.libsLimit(adj.x, adj.y, 1) // atari == 1
      ) {
        const isOne = this.isSingleStone(adj.x, adj.y);
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

  _falseEye(x, y) {
    let edgeCount = 0;
    let enemyCount = 0;
    for (let a = -1; a <= 1; a += 2) {
      for (let b = -1; b <= 1; b += 2) {
        const code = this.board.getCode(x + a, y + b);
        enemyCount += code === this.enemyCode;
        edgeCount += code === GO_OOB;
      }
    }
    if ((edgeCount && enemyCount)
      || enemyCount > 1)
      return true; // false eye (diagonal)
    return false; // probably an eye!
  }

  playRandom() {
    const moves = this.moveList();
    if (moves.length) {
      let { x, y } = _.sample(moves); // random
      this.playMove(x, y);
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

  replayMove(action) {
    let { x, y } = action;
    if (this.board._xyValid(x, y)) {
      this.playMove(x, y);
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
  return markInverse(state, moves);
}

function markInverse(state, moves) {
  const warn = "V";
  const board = text2nested(
    state.board.printBoard({ addLabels: false })
      .replaceAll(".", warn)
  );
  for (let { x, y } of moves) {
    if (board[y][x] === warn)
      board[y][x] = ".";
  }
  return printNested(board);
}