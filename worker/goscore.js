function getScore(board) {
  const visitEmpty = Array(board.board.length).fill(0);
  const score = {
    [GO_BLACK]: 0,
    [GO_WHITE]: 0,
    [GO_STONE]: 0
  };

  for (let pos of board.allMoves()) {
    const piece = board.board[pos];
    if (piece) {
      score[piece]++;
      continue;
    }
    if (visitEmpty[pos]++) {
      continue;
    }
    const Q = [pos];
    let countEmpty = 1;
    let stoneTypes = 0;
    while (Q.length) {
      const cur = Q.pop();
      for (let adj of board.adjacent(cur)) {
        const piece = board.board[adj] & GO_STONE;
        stoneTypes |= piece;
        if (piece === GO_EMPTY && !visitEmpty[adj]++) {
          Q.push(adj);
          countEmpty++;
        }
      }
    }
    score[stoneTypes] += countEmpty;
  }
  return score;
}

function scoreBoard(board, enclosed, stoneArr) {
  const size = board.size;
  let tally;
  const followEmpty = (pos) => {
    let piece = board.getColour(pos);
    tally[piece] = 1 + (tally[piece] ?? 0);
    return board.isEmpty(pos);
  }
  const empty = {};
  const stone = {};
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const pos = board.xy2pos(x, y);
      if (board.isEmpty(pos)) {
        tally = {};
        DFS(pos, (pos) => board.adjacent(pos), followEmpty);
        let result = "?";
        if (tally["W"] && !tally["B"]) {
          result = "w";
        }
        if (tally["B"] && !tally["W"]) {
          result = "b";
        }
        if (stoneArr) stoneArr[y][x] = result;
        if (enclosed) enclosed[y][x] = result;
        empty[result] = 1 + (empty[result] ?? 0);
      } else {
        const piece = board.getColour(pos);
        if (stoneArr) stoneArr[y][x] = piece;
        stone[piece] = 1 + (stone[piece] ?? 0);
      }
    }
  }
  const B = (empty["b"] ?? 0) + (stone["B"] ?? 0);
  const W = (empty["w"] ?? 0) + (stone["W"] ?? 0);
  const S = empty["?"] ?? 0;
  return {
    empty: empty,
    stone: stone,
    B: B,
    W: W,
    "?": S,
  }
}

function scoring(input) {
  const board = parseBoard2D(input);
  const size = board.size;
  const enclosed = createNested(size, ".");
  const stoneArr = createNested(size, ".");
  const score = scoreBoard(board, enclosed, stoneArr);
  return [
    printNested(enclosed),
    `Enclosed: b: ${score.empty["b"]}`,
    `          w: ${score.empty["w"]}`,
    `Stones:   B: ${score.stone["B"]}`,
    `          W: ${score.stone["W"]}`,
    printNested(stoneArr),
    `B: ${score.B}`,
    `W: ${score.W}`,
    `?: ${score["?"]}`,
  ].join("\n");
}

function fastScoring(input) {
  const board = parseBoard2D(input);
  const score = getScore(board);
  return [
    `GO_BLACK: ${score[GO_BLACK]}`,
    `GO_WHITE: ${score[GO_WHITE]}`,
    `GO_STONE: ${score[GO_STONE]} (contested)`,
  ].join("\n");
}