function scoreBoard(board) {
  const size = board.size;
  const enclosed = new Board2D(size);
  const stoneArr = new Board2D(size);
  let tally;
  const followEmpty = ([x, y]) => {
    const piece = board.get(x, y);
    tally[piece] = 1 + (tally[piece] ?? 0);
    return piece === ".";
  }
  const empty = {};
  const stone = {};
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const piece = board.get(x, y);
      if (piece === ".") {
        tally = {};
        DFS([x, y], xy4way, followEmpty);
        let result = "?";
        if (tally["W"] && !tally["B"]) {
          result = "w";
        }
        if (tally["B"] && !tally["W"]) {
          result = "b";
        }
        stoneArr.set(x, y, result);
        enclosed.set(x, y, result);
        empty[result] = 1 + (empty[result] ?? 0);
      } else {
        stoneArr.set(x, y, piece);
        stone[piece] = 1 + (stone[piece] ?? 0);
      }
    }
  }
  return {
    Enclosed: enclosed,
    Score: stoneArr,
    empty: empty,
    stone: stone,
    B: (empty["b"] ?? 0)
      + (stone["B"] ?? 0),
    W: (empty["w"] ?? 0)
      + (stone["W"] ?? 0),
    "?": empty["?"] ?? 0,
  }
}

function score7x7(input) {
  let board = parse(input);
  let score = scoreBoard(board);
  return [
    printBoard(score.Enclosed),
    `Enclosed: b: ${score.empty["b"]}`,
    `          w: ${score.empty["w"]}`,
    `Stones:   B: ${score.stone["B"]}`,
    `          W: ${score.stone["W"]}`,
    printBoard(score.Score),
    `B: ${score.B}`,
    `W: ${score.W}`,
    `?: ${score["?"]}`,
  ].join("\n");
}