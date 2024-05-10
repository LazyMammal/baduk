class GoMCTS extends GoValid {
  doRollout() {
    const enemy = this.playerCode; // already played
    const player = this.enemyCode;
    let passTurn = 0;
    for (let t = 0; t < 100 && passTurn < 2; t++) {
      passTurn = playRandom(this) ? 0 : passTurn + 1;
    }
    const score = scoreBoard(this.board);
    const win = score[player] > score[enemy]; // TODO: komi
    return win * 2 - 1; // -1 or +1
  }

  swapPlayer() {
    this.playerCode ^= GO_STONE;
    this.enemyCode ^= GO_STONE;
    this.toPlay = GO_CHARS[this.playerCode];
  }

  replayMove(action) {
    let [x, y] = action;
    if (this.board._xyValid(x, y)) {
      this.playMove(x, y);
    } else {
      this.swapPlayer(); // pass
    }
  }

  simClone() {
    return _.cloneDeep(this);
  }
}

function printRootArray(size, root, callback = () => 0) {
  const valueArr = createNested(size, 0);
  for (let child of root.children) {
    let [x, y] = child.action;
    valueArr[y][x] = callback(child);
  }
  return valueArr;
}

function mcts7x7(input, options,
  STATE = GoMCTS,
  BOARD = GoBoard2D,
  NODE = UCTNode
) {
  const runtime = Number(options.time ?? 10);
  window.baduk.EX = Number(options.explore ?? 1.0);
  let clean = cleanInput(input);
  let state = inputState(clean, STATE, BOARD);
  const size = state.board.size;
  const root = new NODE([-1, -1]); // pass
  const t0 = performance.now();
  const endT = t0 + runtime * 1e3;
  let nodes = 0;
  while (performance.now() < endT) {
    nodes += tree_search(root, state, 100);
  }
  const dT = performance.now() - t0;
  const visitsArr = printRootArray(size, root, (node) => node.visits);
  const valueArr = printRootArray(size, root, (node) => `${node.value}`
    .replace(/^0./, ".")
    .replace(/^-0./, "-.")
    .slice(0, 5)
  );
  return [
    `Visits:`,
    printPadded(visitsArr, true, 5),
    `Value:`,
    printPadded(valueArr, true, 5),
    `root value ${root.value.toFixed(6)}`,
    `visit ${root.visits} `
    + `${(root.visits / dT * 1e3).toFixed(2)} visits/s`,
    `nodes ${nodes} `
    + `${(nodes / dT * 1e3).toFixed(2)} nodes/s`,
    `seconds ${runtime}`,
    `explore ${window.baduk.EX}`,
  ].join("\n");
}