function scoreBoard(data) {
  let size = data.length;
  let encloseArr = Array(size).fill(0)
    .map(() => Array(size).fill("."));
  let scoreArr = Array(size).fill(0)
    .map(() => Array(size).fill("."));
  let adjCount;
  const scoreFunc = ([x, y], data) => {
    let piece = data[y][x];
    adjCount[piece]++;
    return (piece === ".");
  }
  let emptyCount = { "b": 0, "w": 0, "?": 0 };
  let stoneCount = { "B": 0, "W": 0, ".": 0 };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let piece = data[y][x];
      if (piece === ".") {
        adjCount = { "B": 0, "W": 0, ".": 0 };
        DFS([x, y], data, adj4way, scoreFunc);
        scoreArr[y][x] = "?";
        if (adjCount["W"] && adjCount["B"] === 0) {
          scoreArr[y][x] = "w";
        }
        else if (adjCount["B"] && adjCount["W"] === 0) {
          scoreArr[y][x] = "b";
        }
        encloseArr[y][x] = scoreArr[y][x];
        emptyCount[scoreArr[y][x]]++;
      } else {
        scoreArr[y][x] = piece;
        stoneCount[piece]++;
      }
    }
  }
  return [emptyCount, stoneCount, encloseArr, scoreArr];
}

function calcScore(data) {
  let [empty, stone, enclosed, score] = scoreBoard(data);
  return {
    Enclosed: enclosed,
    empty: empty,
    stone: stone,
    Score: score,
    B: empty["b"] + stone["B"],
    W: empty["w"] + stone["W"],
    "?": empty["?"],
  }
}

function score7x7(input) {
  let data = parse(input);
  let score = calcScore(data);
  return [
    data2text(addAxisLabels(score.Enclosed)),
    `Enclose: b:${score.empty["b"]} w:${score.empty["w"]}`,
    `Stones:  B:${score.stone["B"]} W:${score.stone["W"]}`,
    data2text(addAxisLabels(score.Score)),
    `Black: ${score.B}`,
    `White: ${score.W}`,
    `?????: ${score["?"]}`,
  ].join("\n");
}