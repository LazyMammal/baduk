class GoMCTS extends GoEarlyExit {
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

  simClone() {
    const board = parse(printBoard(this.board, { addLabels: false }));
    return new this.constructor(board, this.toPlay, this.turn);
  }
}

function rootValues(size, root) {
  const valueArr = createNested(size, 0);
  for (let child of root.children) {
    let [x, y] = child.action;
    valueArr[y][x] = Math.round(child.value * 100);
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
  const root = new NODE('root');
  tree_search(root, state, 10);
  console.log(root);
  return printNested(rootValues(state.board.size, root));

}