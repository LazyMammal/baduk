class GoChains extends GoKoHack {
  chains;
  id2libs;
  constructor(board, toPlay, turn = 0) {
    super(board, toPlay, turn);
    this.chains = new Board2D(this.board.size, -1, -1);
    this.id2libs = [];
  }

  countLibs(x, y) {
    let stoneType = this.board.get(x, y);
    if (stoneType !== "B" && stoneType !== "W")
      return 0;
    let id = this.chains.get(x, y);
    if (id >= 0) {
      return this.id2libs[id];
    }
    return this._countLibs(x, y, -1, stoneType);
  }

  _countLibs(x, y, id, stoneType) {
    if (id < 0) {
      id = this.id2libs.length;
    }
    let libs = 0;
    const followChainWrite = ([x, y]) => {
      const piece = this.board.get(x, y);
      if (piece === stoneType) {
        this.chains.set(x, y, id);
        return true;
      }
      libs += piece === ".";
      return false;
    }
    DFS([x, y], xy4way, followChainWrite);
    this.id2libs[id] = libs;
    return libs;
  }

  eraseChain(x, y) {
    const stoneType = this.board.get(x, y);
    if (stoneType !== "B" && stoneType !== "W")
      return 0;
    let old = this.chains.get(x, y);
    if (old === this.id2libs.length - 1) // at end
      this.id2libs.length = old; // truncate
    let caps = 0;
    const followChainErase = ([x, y]) => {
      const piece = this.board.get(x, y);
      if (piece !== stoneType)
        return false;
      this.board.set(x, y, ".");
      this.chains.set(x, y, -1);
      caps++;
      return true;
    }
    DFS([x, y], xy4way, followChainErase);
    return caps;
  }

  playMove(x, y) {
    const enemyType = this.nextToPlay();
    this.board.set(x, y, this.toPlay);
    let id = -1;
    let caps = 0;
    let dec = {};
    for (let [i, j] of xy4way([x, y])) {
      const adjId = this.chains.get(i, j);
      if (this.board.get(i, j) === enemyType) {
        if (adjId < 0) {
          if (!this._countLibs(i, j, -1, enemyType))
            caps += this.eraseChain(i, j);
        } else {
          if (!(adjId in dec)) {
            dec[adjId] = true;
            if (--this.id2libs[adjId] === 0)
              caps += this.eraseChain(i, j);
          }
        }
      } else {
        id = adjId >= 0 ? adjId : id;
      }
    }
    this._countLibs(x, y, id, this.toPlay); // merge chains
    this.toPlay = enemyType;
    this.turn++;
    return caps;
  }
}

function move_tests_chains7x7(input) {
  return move_tests(input, GoChains);
}

function rolloutReport_chains7x7(input, button, parent) {
  montecarlo7x7(input, button, parent, GoChains);
}

function versus_tests_chains7x7(input) {
  let state1 = inputState(input, GoKoHack);
  let state2 = inputState(input, GoChains);
  // TODO: compare .countLibs

}

function chains7x7(input) {
  return kohack7x7(input, GoChains);
}