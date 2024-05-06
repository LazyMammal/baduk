class GoEarlyExit extends GoKoHack {
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
}

function move_tests_earlyexit7x7(input) {
  return move_tests(input, GoEarlyExit);
}

function rolloutReport_earlyexit7x7(input, button, parent) {
  montecarlo7x7(input, button, parent, GoEarlyExit);
}

function earlyexit7x7(input) {
  return kohack7x7(input, GoEarlyExit);
}