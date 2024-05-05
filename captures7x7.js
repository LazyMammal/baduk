class GoCaptures extends GoState {
  countLibs(x, y) {
    let stoneType = this.board.get(x, y);
    if (stoneType !== "B" && stoneType !== "W")
      return 0;
    let libs = 0;
    const followStoneType = ([x, y]) => {
      const piece = this.board.get(x, y);
      libs += piece === ".";
      return piece === stoneType;
    }
    DFS([x, y], xy4way, followStoneType);
    return libs;
  }

  isCapture(x, y) {
    return !this.countLibs(x, y);
  }

  eraseChain(x, y) {
    const stoneType = this.board.get(x, y);
    if (stoneType !== "B" && stoneType !== "W")
      return 0;
    let caps = 0;
    const followStoneType = ([x, y]) => {
      const piece = this.board.get(x, y);
      if (piece !== stoneType)
        return false;
      this.board.set(x, y, ".");
      caps++;
      return true;
    }
    DFS([x, y], xy4way, followStoneType);
    return caps;
  }

  playMove(x, y) {
    const enemyType = this.nextToPlay();
    this.board.set(x, y, this.toPlay);
    let caps = 0;
    for (let [i, j] of xy4way([x, y])) {
      const piece = this.board.get(i, j);
      if (piece === enemyType
        && this.isCapture(i, j)) {
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