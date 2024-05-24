function printRootArray(size, root, state, callback = () => 0) {
  const valueArr = createNested(size, 0);
  for (let child of root.children) {
    let { x, y } = state.board.pos2xy(child.action);
    valueArr[y][x] = callback(child);
  }
  return valueArr;
}

function mcts(runtime) {
  const t0 = performance.now();
  const endT = t0 + runtime * 1e3;
  const reps = 50;
  let nodes = 0;
  let rollouts = 0;
  while (performance.now() < endT) {
    nodes += treeSearch(self.root, self.state, reps);
    rollouts += reps;
  }
  const dT = performance.now() - t0;
  const size = state.board.size;
  const visitsArr = printRootArray(size, self.root, self.state, (node) => node.visits);
  const valueArr = printRootArray(size, self.root, self.state, (node) => `${node.value}`
    .replace(/^0./, ".")
    .replace(/^-0./, "-.")
    .slice(0, 5)
  );
  return [
    `Visits:`,
    printPadded(visitsArr, true, 5),
    `Value:`,
    printPadded(valueArr, true, 5),
    `root value ${self.root.value.toFixed(6)}`,
    `nodes selected ${nodes}, `
    + `${(nodes / dT * 1e3).toFixed(0)}/s`,
    `new visits +${rollouts}, `
    + `${(rollouts / dT * 1e3).toFixed(0)}/s`,
    `total visits ${self.root.visits}`,
    `seconds ${runtime}`,
    `explore ${self.EX}`,
  ].join("\n");
}