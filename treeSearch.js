window.baduk.EX = 2.0;

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
    const LogN = Math.log(this.visits);
    let bestChild = null;
    let bestUCB = -Infinity;
    for (let child of this.children) {
      if (!child.visits)
        return child;
      const ucb = child.value + window.baduk.EX
        * Math.sqrt(LogN / child.visits);
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

function treeMock(input, options, button, parent) {
  let output = parent.querySelector("[output]");
  output.innerText = "Mock data test.\n\n";
  setTimeout(() => {
    stepReport(input, button, output, 1)
  }, 1);
}
