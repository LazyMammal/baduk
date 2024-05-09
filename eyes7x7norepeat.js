class GoEyes_noRepeat extends GoLegal {
  isEye(x, y) {
    const enemyType = this.nextToPlay();
    for (let [i, j] of xy4way([x, y])) {
      if (this.isColour(i, j, enemyType)
        || this.board.isEmpty(i, j)) {
        return false; // not a single-point eye
      }
    }
    let edgeCount = 0;
    let enemyCount = 0;
    for (let a = -1; a <= 1; a += 2) {
      for (let b = -1; b <= 1; b += 2) {
        enemyCount += this.isColour(x + a, y + b, enemyType);
        edgeCount += this.board.isOOB(x + a, y + b);
      }
    }
    if ((edgeCount && enemyCount)
      || enemyCount > 1)
      return false; // false eye (diagonal)
    return true; // probably an eye!
  }
}