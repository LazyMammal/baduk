class GoCaptures extends GoState {
  countLibs(x, y) {
    if (!this.board.isStone(x, y))
      return 0;
    const followBlack = ([x, y]) => {
      libs += this.board.isEmpty(x, y);
      return this.board.isBlack(x, y);
    }
    const followWhite = ([x, y]) => {
      libs += this.board.isEmpty(x, y);
      return this.board.isWhite(x, y);
    }
    let libs = 0;
    DFS([x, y], xy4way,
      this.board.isBlack(x, y) ? followBlack : followWhite);
    return libs;
  }

  libsLimit(x, y) {
    return !this.countLibs(x, y);
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

  playMove(x, y) {
    const enemyType = this.nextToPlay();
    this.setColour(x, y, this.toPlay);
    let caps = 0;
    for (let [i, j] of xy4way([x, y])) {
      if (this.isColour(i, j, enemyType)
        && this.libsLimit(i, j)) {
        caps += this.eraseChain(i, j);
      }
    }
    this.toPlay = enemyType;
    this.turn++;
    return caps;
  }
}

function captures7x7(input) {
  return state7x7(input, GoCaptures);
}