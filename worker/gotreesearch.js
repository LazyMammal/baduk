class UCTNode {
  action;
  visits;
  reward;
  children;
  constructor(action) {
    this.action = action;
    this.children = [];
    this.visits = 0;
    this.reward = 0;
  }

  get value() { return this.reward / this.visits }

  hasChild() {
    return this.children.length;
  }

  addChild(action) {
    let child = new this.constructor(action);
    this.children.push(child);
    return child;
  }

  addReward(reward = 0) {
    // rewards & visits always update together
    this.reward += reward;
    this.visits++;
  }

  selectChild() { // argmax( children, key:ucb )
    if (!this.hasChild())
      return null;
    const EXlogN = self.EX * self.EX
      * Math.log(this.visits);
    let bestChild = null;
    let bestUCB = -Infinity;
    for (let child of this.children) {
      if (!child.visits)
        return child;
      const ucb = child.value +
        Math.sqrt(EXlogN / child.visits);
      if (ucb > bestUCB) {
        bestChild = child;
        bestUCB = ucb;
      }
    }
    return bestChild;
  }
}

function traverseTree(node, state, path) {
  while (node.hasChild()) {
    node = node.selectChild();
    state.replayMove(node.action);
    path.push(node);
  }
  return node;
}

function backprop(path, reward) {
  while (path.length) {
    let node = path.pop();
    node.addReward(reward);
    reward = -reward;
  }
}

function searchCore(root, state) {
  let nodes = 0;
  let node = root;
  const path = [node];
  node = traverseTree(node, state, path);
  if (!node.hasChild()) {
    for (let action of state.moveList()) {
      node.addChild(action);
      nodes++;
    }
    node = traverseTree(node, state, path);
  }
  let reward = state.doRollout();
  backprop(path, reward);
  return nodes;
}

function treeSearch(root, state, reps = 1) {
  let nodes = 0;
  for (let x = 0; x < reps; x++) {
    nodes += searchCore(root, state.simClone());
  }
  return nodes;
}

function treeMock() {
  const root = new UCTNode(0);
  const state = {
    moveList: () => _.range(15),
    replayMove: () => { },
    doRollout: () => 2 * Math.random() - 1,
    simClone: () => state,
  };
  const t0 = performance.now();
  const endTime = t0 + 3e3;
  let nodes = 0;
  while (endTime > performance.now()) {
    nodes += treeSearch(root, state, 16);
  }
  const seconds = (performance.now() - t0) / 1e3;
  return [
    `value ${root.value.toFixed(12)}`,
    `visits ${root.visits}, `
    + `${(root.visits / seconds).toFixed(0)}/s`,
    `nodes ${nodes}, `
    + `${(nodes / seconds).toFixed(0)}/s`
  ].join("\n")
}

function traverseMock() {
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
