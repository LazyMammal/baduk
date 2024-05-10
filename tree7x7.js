window.baduk.EX = 1.0;

class UCTNode {
  action;
  children;
  _visits;
  _sumRewards;
  constructor(action) {
    this.action = action;
    this.children = [];
    this._visits = 0;
    this._sumRewards = 0;
  }

  get visits() { return this._visits }
  get value() { return this._sumRewards / this._visits }

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
    this._sumRewards += reward;
    this._visits++;
  }

  selectChild() { // argmax( children, key:ucb )
    if (!this.hasChild())
      return null;
    const LogN = Math.log(this._visits) * window.baduk.EX;
    let bestChild = null;
    let bestUCB = -Infinity;
    for (let child of this.children) {
      if (!child._visits)
        return child;
      const ucb = child._sumRewards / child._visits
        + Math.sqrt(LogN / child._visits);
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

function treeSearch(root, gamestate, reps = 1) {
  const state = gamestate.simClone();
  let nodes = 0;
  for (let x = 0; x < reps; x++) {
    nodes += searchCore(root, state);
  }
  return nodes;
}

function mockSearch(reps) {
  const root = new UCTNode(0);
  const state = {
    moveList: () => _.range(15),
    replayMove: () => { },
    doRollout: () => 2 * Math.random() - 1,
    simClone: () => state,
  };
  const t0 = performance.now();
  let nodes = treeSearch(root, state, reps);
  const T = performance.now() - t0;
  const res = [
    `value ${root.value.toFixed(12)}`,
    `visits ${root.visits} `
    + `${(root.visits / T * 1e3).toFixed(2)} visits/s`,
    `nodes ${nodes} `
    + `${(nodes / T * 1e3).toFixed(2)} nodes/s`,
    "\n"
  ];
  return [T < 1e3, T > 350 ? res : []];
}

function stepReport(input, button, output, reps) {
  let [flag, res] = mockSearch(reps);
  let text = res.join("\n");
  if (text.length)
    output.innerText += text;
  if (flag) {
    reps *= 2;
    setTimeout(() => {
      stepReport(input, button, output, reps)
    }, 1);
  } else {
    button.removeAttribute("disabled");
  }
}

function tree7x7(input, options, button, parent) {
  let output = parent.querySelector("[output]");
  output.innerText = "Mock data test.\n\n";
  setTimeout(() => {
    stepReport(input, button, output, 1)
  }, 1);
}
