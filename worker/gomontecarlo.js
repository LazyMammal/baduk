function monteCarlo(input) {
  const board = parseBoard2D(input);
  const maxTurns = 3 * Math.pow(board.size + 3, 2);
  const wins = ({"0": 0, "-1": 0, "1": 0});
  const t0 = performance.now();
  const endTime = t0 + 3e3;
  let rollouts = 0;
  while (endTime > performance.now()) {
    const state = new GoState(_.cloneDeep(board));
    let pass = 0;
    for (let turn = 0; pass < 2 && turn < maxTurns; turn++) {
      pass = state.playRandom() ? 0 : pass + 1;
    }
    let score = scoreBoard(state.board);
    let win = _.clamp(score.B - score.W, -1, 1);
    wins[win] = 1 + (wins[win] ?? 0);
    rollouts++;
  }
  let duration = performance.now() - t0;
  let rps = rollouts / duration * 1e3;
  return [
    `Rollouts: ${rollouts}`,
    `   Black: ${wins[1]}`,
    `   White: ${wins[-1]}`,
    `    Ties: ${wins[0]}`,
    `    /sec: ${rps.toFixed(1)}`,
  ].join("\n");
}
