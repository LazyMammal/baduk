class GoCaptures extends GoState {
  countLibs(x, y) {
    let stoneType = this.board.get(x, y);
    if (stoneType !== "B" && stoneType !== "W")
      return false;
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
      return false;
    const followStoneType = ([x, y]) => {
      const piece = this.board.get(x, y);
      if (piece !== stoneType)
        return false;
      this.board.set(x, y, ".");
      return true;
    }
    DFS([x, y], xy4way, followStoneType);
  }

  playMove(x, y) {
    const enemyType = this.nextToPlay();
    this.board.set(x, y, this.toPlay);
    for (let [i, j] of xy4way([x, y])) {
      const piece = this.board.get(i, j);
      if (piece === enemyType
        && this.isCapture(i, j)) {
        this.eraseChain(i, j);
      }
    }
    this.toPlay = this.nextToPlay();
  }
}

function captures7x7(input) {
  return state7x7(input, GoCaptures);
}