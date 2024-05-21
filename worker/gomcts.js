function printRootArray(size, root, callback = () => 0) {
  const valueArr = createNested(size, 0);
  for (let child of root.children) {
    let [x, y] = child.action;
    valueArr[y][x] = callback(child);
  }
  return valueArr;
}

function mcts(runtime) {
  const t0 = performance.now();
  const endT = t0 + runtime * 1e3;
  let nodes = 0;
  while (performance.now() < endT) {
    nodes += treeSearch(self.root, self.state, 100);
  }
  const dT = performance.now() - t0;
  const size = state.board.size;
  const visitsArr = printRootArray(size, self.root, (node) => node.visits);
  const valueArr = printRootArray(size, self.root, (node) => `${node.value}`
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
    `visit ${self.root.visits} `
    + `${(self.root.visits / dT * 1e3).toFixed(2)} visits/s`,
    `nodes ${nodes} `
    + `${(nodes / dT * 1e3).toFixed(2)} nodes/s`,
    `seconds ${runtime}`,
    `explore ${self.EX}`,
  ].join("\n");
}