class GoMCTS extends GoValid {
  doRollout() {
    const player = this.toPlay;
    const enemy = this.nextToPlay();
    let passTurn = 0;
    for (let t = 0; t < 100 && passTurn < 2; t++) {
      passTurn = playRandom(this) ? 0 : passTurn + 1;
    }
    const score = scoreBoard(this.board);
    const komi = this.komi ?? 0;
    return score[player] > score[enemy] + komi;
  }

  replayMove(action) {
    let [x, y] = action;
    this.playMove(x, y);
  }

  simClone() {
    const board = parse(printBoard(this.board, { addLabels: false }));
    return new this.constructor(board, this.toPlay, this.turn);
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

function mcts7x7(input,
  STATE = GoMCTS,
  BOARD = GoBoard2D,
  NODE = UCTNode
) {
  let clean = cleanInput(input);
  let state = inputState(clean, STATE, BOARD);
  const size = state.board.size;
  const root = new NODE('root');
  const t0 = performance.now();
  const endT = t0 + 10e3;
  let rollouts = 0;
  while(performance.now() < endT) {
    rollouts += tree_search(root, state, 1e3);
  }
  const dT = performance.now() - t0;
  const visitsArr = printRootArray(size, root, (node) => node.visits);
  const valueArr = printRootArray(size, root, (node) => node.value.toFixed(2));
  return [
    `Visits:`,
    printPadded(visitsArr, true, 3),
    `Value:`,
    printPadded(valueArr, true, 3),
    `root value ${root.value.toFixed(6)}`,
    `visits ${root.visits}`,
    `${(root.visits / dT * 1e3).toFixed(2)} visits/s`,
    `rollouts ${rollouts}`,
    `${(rollouts / dT * 1e3).toFixed(2)} rollouts/s`
  ].join("\n");
}