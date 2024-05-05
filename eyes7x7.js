class GoEyes extends GoRepeat {
  isEye(x, y) {
    const enemyType = this.nextToPlay();
    for (let [i, j] of xy4way([x, y])) {
      const piece = this.board.get(i, j);
      if (piece === enemyType || piece === ".")
        return false; // not a single point eye
    }
    let edgeCount = 0;
    let enemyCount = 0;
    for (let a = -1; a <= 1; a += 2) {
      for (let b = -1; b <= 1; b += 2) {
        const piece = this.board.get(x + a, y + b);
        enemyCount += piece === enemyType;
        edgeCount += piece === "#";
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