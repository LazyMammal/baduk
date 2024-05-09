class TreeNode {
  action;
  depth;
  parent;
  children;
  constructor(action) {
    this.action = action;
    this.depth = 0;
    this.parent = null;
    this.children = [];
  }

  addChild(action) {
    let child = new this.constructor(action);
    child.depth = this.depth + 1;
    child.parent = this;
    this.children.push(child);
    return child;
  }
}

class UCTNode extends TreeNode {
  _visits;
  _sumRewards;
  constructor() {
    super();
    this._visits = 0;
    this._sumRewards = 0;
  }

  addReward(reward = 0, visits = 1) {
    /* 
      - rewards & visits always update together
    */
    this._visits += visits;
    this._sumRewards += reward;
  }

  get visits() { return this._visits }
  get value() { return this._sumRewards / this._visits }

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

function tree_search(root, state, reps = 50e3) {
  if (!root.children.length) {
    for (let action of state.actions()) {
      root.addChild(action);
    }
  }
  for (let x = 0; x < reps; x++) {
    let node = root;
    while (node.children.length) {
      node = node.selectChild();
      state.play(node.action);
    }
    if (node) {
      let rewardSum = 0;
      let visitSum = 0;
      for (let action of state.actions()) {
        node.addChild(action);
        let sim = state.sim(node.action);
        const reward = sim.reward();
        node.addReward(reward);
        rewardSum += reward;
        visitSum++;
      }
      while (node) { // backprop
        node.addReward(rewardSum, visitSum);
        node = node.parent;
      }
    }
  }
}

function tree7x7(input, NODE = UCTNode) {
  let res = [];
  const root = new NODE('root');
  const state = {
    actions: () => _.range(10).map(c => `child:${c}`),
    play: () => true,
    sim: () => state,
    reward: () => Math.random(),
  };
  tree_search(root, state);
  res.push(`[root] visits ${root.visits} value ${root.value} `);
  return res.join("\n");
}
