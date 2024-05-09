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
    if (!this.children.length) return null;
    const LogN = Math.log(this._visits);
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

function tree_search(root, state, reps = 1) {
  let rollouts = 0;
  if (!root.children.length) {
    for (let action of state.moveList()) {
      root.addChild(action);
    }
  }
  for (let x = 0; x < reps; x++) {
    let node = root;
    const path = [node];
    while (node.children.length) {
      node = node.selectChild();
      state.playMove(node.action);
      path.push(node);
    }
    if (node) { // expand all child actions
      let rewardSum = 0;
      let visitSum = 0;
      for (let action of state.moveList()) {
        let child = node.addChild(action);
        let sim = state.simClone();
        sim.playMove(action);
        const reward = sim.doRollout();
        rollouts++;
        child.addReward(reward);
        rewardSum += reward;
        visitSum++;
      }
      rewardSum /= visitSum;
      if (visitSum) {
        while (path.length) { // backprop
          const pNode = path.pop();
          rewardSum = -rewardSum;
          pNode.addReward(rewardSum);
        }
      } else {
        // TODO: terminal node
      }
    }
  }
  return rollouts;
}

function doTreeSearch(reps, NODE, SEARCH) {
  const root = new NODE(0);
  const state = {
    moveList: () => _.range(15),
    playMove: () => { },
    simClone: () => state,
    doRollout: () => 2 * Math.random() - 1,
  };
  const t0 = performance.now();
  let rollouts = SEARCH(root, state, reps);
  const T = performance.now() - t0;
  const res = [
    `value ${root.value.toFixed(12)}`,
    `visits ${root.visits} `
    + `${(root.visits / T * 1e3).toFixed(2)} visits/s`,
    `rollouts ${rollouts} `
    + `${(rollouts / T * 1e3).toFixed(2)} rollout/s`,
    "\n"
  ];
  return [T < 5e3, T > 500 ? res : []];
}

function doTreeSearchReport(input, button, output, reps, NODE, SEARCH) {
  let [flag, res] = doTreeSearch(reps, NODE, SEARCH);
  let text = res.join("\n");
  if (text.length)
    output.innerText += text;
  if (flag) {
    reps *= 2;
    if (reps < 1e6) {
      setTimeout(() => {
        doTreeSearchReport(input, button, output, reps, NODE, SEARCH)
      }, 1);
    }
  } else {
    button.removeAttribute("disabled");
  }
}

function tree7x7(input, button, parent, NODE = UCTNode, SEARCH = tree_search) {
  let output = parent.querySelector("[output]");
  output.innerText = "Mock data test.\n\n";
  setTimeout(() => {
    doTreeSearchReport(input, button, output, 1, NODE, SEARCH)
  }, 1);
}
