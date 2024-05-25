class GoState {
  board;
  turn;
  playerCode;
  enemyCode;
  constructor(board, playerCode = GO_BLACK, turn = 0) {
    this.board = board;
    this.turn = turn;
    this.playerCode = playerCode;
    this.enemyCode = playerCode ^ GO_STONE;
  }

  moveList() {
    const moves = [];
    for (let pos of this.board.allEmpty()) {
      if (this.validToPlay(pos))
        moves.push(pos);
    }
    return moves;
  }

  eraseChain(pos) {
    const stoneCode = this.board.board[pos] & GO_STONE;
    if (!stoneCode)
      return 0;

    const Q = [pos];
    const visited = {};
    visited[pos] = 1;

    this.board.board[pos] = GO_EMPTY;
    let caps = 1;
    while (Q.length) {
      let cur = Q.pop();
      for (let adj of this.board.adjacent(cur)) {
        if (!(adj in visited)) {
          visited[adj] = 1;
          if (this.board.board[adj] === stoneCode) {
            this.board.board[adj] = GO_EMPTY;
            caps++;
            Q.push(adj);
          }
        }
      }
    }
    return caps;
  }

  isSingleStone(pos) {
    const stoneCode = this.board.board[pos] & GO_STONE;
    if (!stoneCode)
      return false;
    for (let adj of this.board.adjacent(pos)) {
      if (this.board.board[adj] === stoneCode) {
        return false;
      }
    }
    return true;
  }

  libsLimit(pos, limit = 0) {
    const stoneCode = this.board.board[pos] & GO_STONE;
    if (!stoneCode)
      return 0;

    const Q = [pos];
    const visited = {};
    visited[pos] = 1;

    let libs = 0;
    while (Q.length) {
      let cur = Q.pop();
      for (let adj of this.board.adjacent(cur)) {
        if (!(adj in visited)) {
          visited[adj] = 1;
          const code = this.board.board[adj];
          if (code === stoneCode) {
            Q.push(adj);
          } else if (code === GO_EMPTY) {
            if (++libs > limit)
              return false;
          }
        }
      }
    }
    return libs <= limit;
  }

  playMove(pos) {
    this.board.board[pos] = this.playerCode;
    let caps = 0;
    for (let adj of this.board.adjacent(pos)) {
      if (this.board.board[adj] === this.enemyCode
        && this.libsLimit(adj)) { // capture
        caps += this.eraseChain(adj);
      }
    }
    this.advanceTurn();
    return caps;
  }

  advanceTurn() {
    this.playerCode ^= GO_STONE;
    this.enemyCode ^= GO_STONE;
    this.turn++;
  }

  validToPlay(pos) {
    const enemyStones = [];
    const playerStones = [];
    for (let adj of this.board.adjacent(pos)) {
      const code = this.board.board[adj];
      switch (code) {
        case GO_EMPTY: // adjacent liberty
          return true;
        case this.enemyCode:
          enemyStones.push(adj);
          break;
        case this.playerCode:
          playerStones.push(adj);
          break;
      }
    }
    if (!(enemyStones.length || this._falseEye(pos))) {
      return false; // self-eye
    }
    for (let adj of playerStones) {
      if (!this.libsLimit(adj, 1)) { // > 1
        return true; // safely merge
      }
    }
    let caps = 0; // number of captures available
    for (let adj of enemyStones) {
      if (this.libsLimit(adj, 1) // atari == 1
      ) {
        if (++caps > 1) {
          return true; // second adjacent capture
        }
        if (!this.isSingleStone(adj)) {
          return true; // chain has multiple stones
        }
      }
    }

    if (caps && !playerStones.length) { // ko-like
      return this.turn % 3 === 0; // valid every 3rd turn
    }
    return caps > 0; // valid if capture
  }

  _falseEye(pos) {
    const diagMoves = this.board.diagonal(pos);
    const edgeCount = 4 - diagMoves.length;
    let enemyCount = edgeCount > 0;
    for (let diag of diagMoves) {
      enemyCount += this.board.board[diag] === this.enemyCode;
      if (enemyCount > 1)
        return true; // false eye (diagonal)
    }
    return false; // probably an eye!
  }

  playRandom() {
    const moves = this.board.allEmpty();
    while(moves.length) {
      const idx = ~~(Math.random() * moves.length);
      const pos = moves[idx];
      if (this.validToPlay(pos)) {
        this.playMove(pos);
        return true;
      }
      moves.splice(idx, 1);
    }
    this.advanceTurn();
    return false;
  }

  doRollout() {
    const enemy = this.playerCode; // already played
    const player = this.enemyCode;
    let passTurn = 0;
    for (let t = 0; t < 100 && passTurn < 2; t++) {
      passTurn = this.playRandom() ? 0 : passTurn + 1;
    }
    const score = getScore(this.board);
    const win = score[player] > score[enemy]; // TODO: komi
    return win * 2 - 1; // -1 or +1
  }

  replayMove(pos) {
    if (pos !== passAction) {
      this.playMove(pos);
    } else {
      this.advanceTurn(); // pass
    }
  }

  simClone() {
    return _.cloneDeep(this);
  }
}

function markLegal(state) {
  const moves = state.moveList();
  const warn = "V";
  const board = text2nested(
    state.board.printBoard({ addLabels: false })
      .replaceAll(".", warn)
  );
  for (let pos of moves) {
    const { x, y } = state.board.pos2xy(pos);
    if (board[y][x] === warn)
      board[y][x] = ".";
  }
  return printNested(board);
}