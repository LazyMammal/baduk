function traverseMock(input, options) {
  let nodes = 0;
  const label = (num) => `node${num}`;
  const root = new UCTNode(label(nodes++));
  const state = {
    moveList: () => [label(nodes++), label(nodes++)],
    replayMove: () => { },
    doRollout: () => 2 * Math.round(Math.random()) - 1,
    simClone: () => state,
  };
  let res = [`root: ` + JSON.stringify(root, null, 2)];
  for (let reps = 0; reps < 3; reps++) {
    treeSearch(root, state, 1);
    res.push(`treeSearch(root, state, 1): `
      + JSON.stringify(root, null, 2));
  }
  return res.join("\n\n");
}
