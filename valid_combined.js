class GoValidCombined {
  board;
  turn;
  playerCode;
  enemyCode;
  constructor(board, playerCode, turn = 0) {
    this.board = board;
    this.turn = turn;
    this.playerCode = playerCode;
    this.enemyCode = playerCode ^ GO_STONE;
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

  eraseChain(x, y) {
    if (!this.board.isStone(x, y))
      return 0;
    const followBlack = ([x, y]) => {
      if (!this.board.isBlack(x, y))
        return false;
      this.board.setEmpty(x, y);
      caps++;
      return true;
    }
    const followWhite = ([x, y]) => {
      if (!this.board.isWhite(x, y))
        return false;
      this.board.setEmpty(x, y);
      caps++;
      return true;
    }
    let caps = 0;
    DFS([x, y], xy4way,
      this.board.isBlack(x, y) ? followBlack : followWhite);
    return caps;
  }

  isSingleStone(x, y) {
    if (!this.board.isStone(x, y))
      return 0;
    let stones = 0;
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
    const earlyExit = () => {
      return stones > 1; // found refutation
    }
    DFS([x, y], xy4way,
      this.board.isBlack(x, y) ? followBlack : followWhite,
      earlyExit
    );
    return stones === 1;
  }

  libsLimit(x, y, limit = 0) {
    if (!this.board.isStone(x, y))
      return 0;
    let libs = 0;
    const followBlack = ([x, y]) => {
      libs += this.board.isEmpty(x, y);
      return this.board.isBlack(x, y);
    }
    const followWhite = ([x, y]) => {
      libs += this.board.isEmpty(x, y);
      return this.board.isWhite(x, y);
    }
    const earlyExit = () => {
      return libs > limit; // found refutation
    }
    DFS([x, y], xy4way,
      this.board.isBlack(x, y) ? followBlack : followWhite,
      earlyExit
    );
    return libs <= limit;
  }

  playMove(x, y) {
    this.board.setCode(x, y, this.playerCode);
    let caps = 0;
    for (let [i, j] of xy4way([x, y])) {
      if (this.board.getCode(i, j) === this.enemyCode
        && this.libsLimit(i, j)) { // capture
        caps += this.eraseChain(i, j);
      }
    }
    this.playerCode ^= GO_STONE;
    this.enemyCode ^= GO_STONE;
    this.turn++;
    return caps;
  }

  validToPlay(x, y) {
    if (!this.board.isEmpty(x, y)) {
      return false; // not empty
    }

    let enemyCount = 0; // prep for eye check
    let playerCount = 0;
    let cache4way = [];
    for (let [i, j] of xy4way([x, y])) {
      if (this.board.isEmpty(i, j)) {
        return true; // adjacent liberty
      }
      const code = this.board.getCode(i, j);
      cache4way.push([[i, j], code]);
      enemyCount += code === this.enemyCode;
      playerCount += code === this.playerCode;
    }
    if (!(enemyCount || this._falseEye(x, y))) {
      return false; // self-eye
    }

    let caps = 0; // number of captures available
    for (let [[i, j], code] of cache4way) {
      if (code === this.playerCode
        && !this.libsLimit(i, j, 1)) { // > 1
        return true; // safely merge
      }
      if (code === this.enemyCode
        && this.libsLimit(i, j, 1) // atari == 1
      ) {
        const isOne = this.isSingleStone(i, j);
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
}
