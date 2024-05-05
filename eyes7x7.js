class GoEyes extends GoRepeat {
  isEye(x, y) {
    const enemyType = this.nextToPlay();
    for (let [i, j] of xy4way([x, y])) {
      if (this.isColour[enemyType](i, j)
        || this.board.isEmpty(i, j)) {
        return false; // not a single-point eye
      }
    }
    let edgeCount = 0;
    let enemyCount = 0;
    for (let a = -1; a <= 1; a += 2) {
      for (let b = -1; b <= 1; b += 2) {
        enemyCount += this.isColour[enemyType](x + a, y + b);
        edgeCount += this.board.isOOB(x + a, y + b);
      }
    }
    if ((edgeCount && enemyCount)
      || enemyCount > 1)
      return false; // false eye (diagonal)
    return true; // probably an eye!
  }
}

function eyes7x7(input) {
  return repetition7x7(input, GoEyes);
}