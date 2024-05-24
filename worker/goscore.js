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
      const pos = new Pos(x, y);
      if (board.isEmpty(pos)) {
        tally = {};
        DFS(pos, xy4way, followEmpty);
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
    GO_BLACK: B,
    GO_WHITE: W,
    GO_STONE: S,
  }
}

function scoring(input) {
  const board = parseBoard2D(input);
  const size = board.size;
  const enclosed = createNested(size, ".");
  const stoneArr = createNested(size, ".");
  let score = scoreBoard(board, enclosed, stoneArr);
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