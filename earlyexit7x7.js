class GoEarlyExit extends GoKoHack {
  isSingleStone(x, y) {
    let stoneType = this.board.get(x, y);
    if (stoneType !== "B" && stoneType !== "W")
      return 0;
    let stones = 0;
    const followStoneType = ([x, y]) => {
      const piece = this.board.get(x, y);
      const isStone = piece === stoneType;
      stones += isStone;
      return isStone;
    }
    const earlyExit = () => {
      return stones > 1; // found refutation
    }
    DFS([x, y], xy4way, followStoneType, earlyExit);
    return stones === 1;
  }

  isCapture(x, y) {
    let stoneType = this.board.get(x, y);
    if (stoneType !== "B" && stoneType !== "W")
      return 0;
    let libs = 0;
    const followStoneType = ([x, y]) => {
      const piece = this.board.get(x, y);
      libs += piece === ".";
      return piece === stoneType;
    }
    const earlyExit = () => {
      return libs > 0; // found refutation
    }
    DFS([x, y], xy4way, followStoneType, earlyExit);
    return !libs;
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