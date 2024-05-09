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

function tree_search(root, gamestate, reps = 1) {
  const state = gamestate.simClone();
  let nodes = 0;
  for (let x = 0; x < reps; x++) {
    let node = root;
    const path = [node];
    const traverse = () => {
      while (node.hasChild()) {
        node = node.selectChild();
        state.replayMove(node.action);
        path.push(node);
      }
    };
    traverse();
    if (!node.hasChild()) {
      for (let action of state.moveList()) {
        node.addChild(action);
        nodes++;
      }
      traverse();
    }
    let reward = state.doRollout();
    while (path.length) { // backprop
      node = path.pop();
      node.addReward(reward);
      reward = -reward;
    }
  }
  return nodes;
}

function doTreeSearch(reps, NODE, SEARCH) {
  const root = new NODE(0);
  const state = {
    moveList: () => _.range(15),
    replayMove: () => { },
    doRollout: () => 2 * Math.random() - 1,
    simClone: () => state,
  };
  const t0 = performance.now();
  let nodes = SEARCH(root, state, reps);
  const T = performance.now() - t0;
  const res = [
    `value ${root.value.toFixed(12)}`,
    `visits ${root.visits} `
    + `${(root.visits / T * 1e3).toFixed(2)} visits/s`,
    `nodes ${nodes} `
    + `${(nodes / T * 1e3).toFixed(2)} nodes/s`,
    "\n"
  ];
  return [T < 5e3, T > 500 ? res : []];
}

function doReport(input, button, output, reps, NODE, SEARCH) {
  let [flag, res] = doTreeSearch(reps, NODE, SEARCH);
  let text = res.join("\n");
  if (text.length)
    output.innerText += text;
  if (flag) {
    reps *= 2;
    setTimeout(() => {
      doReport(input, button, output, reps, NODE, SEARCH)
    }, 1);
  } else {
    button.removeAttribute("disabled");
  }
}

function tree7x7(input, options, button, parent,
  NODE = UCTNode,
  SEARCH = tree_search
) {
  let output = parent.querySelector("[output]");
  output.innerText = "Mock data test.\n\n";
  setTimeout(() => {
    doReport(input, button, output, 1, NODE, SEARCH)
  }, 1);
}
