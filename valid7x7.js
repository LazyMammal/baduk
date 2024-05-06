class GoValid extends GoEarlyExit {
  playerCode;
  enemyCode;
  constructor(board, toPlay, turn = 0) {
    super(board, toPlay, turn);
    this.playerCode = GO_CODES[toPlay];
    this.enemyCode = this.playerCode ^ GO_STONE;
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
    [this.playerCode, this.enemyCode]
      = [this.enemyCode, this.playerCode];
    this.toPlay = GO_CHARS[this.playerCode];
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

function move_tests_valid7x7(input) {
  return move_tests(input, GoValid, ArrayBoard2D);
}

function rolloutReport_valid7x7(input, button, parent) {
  montecarlo7x7(input, button, parent, GoValid, ArrayBoard2D);
}

function valid7x7(input) {
  return kohack7x7(input, GoValid, ArrayBoard2D);
}
