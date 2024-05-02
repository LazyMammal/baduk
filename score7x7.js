function scoreBoard(data, emptyIds, owner) {
  let size = data.length;
  let emptyId = 0;
  let adjCount;
  const scoreFunc = ([x, y], data) => {
    let piece = data[y][x];
    adjCount[piece]++;
    if (piece === ".") emptyIds[y][x] = emptyId;
    return (piece === ".");
  }
  let emptyCount = { "b": 0, "w": 0, "?": 0 };
  let stoneCount = { "B": 0, "W": 0, ".": 0 };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!emptyIds[y][x]) {
        let piece = data[y][x];
        if (piece === ".") {
          emptyId++;
          adjCount = { "B": 0, "W": 0, ".": 0 };
          DFS([x, y], data, adj4way, scoreFunc);
          owner[emptyId] = "?";
          if (adjCount["W"] && adjCount["B"] === 0) {
            owner[emptyId] = "w";
          }
          else if (adjCount["B"] && adjCount["W"] === 0) {
            owner[emptyId] = "b";
          }
          emptyCount[owner[emptyId]] += adjCount["."];
        } else {
          stoneCount[piece]++;
        }
      }
    }
  }
  return [emptyCount, stoneCount, owner];
}

const pairMax = (a, b) => a > b ? a : b;

function createLookup(data) {
  let size = data.length;
  let emptyIds = Array(size).fill(0)
    .map(() => Array(size).fill(0));
  let scoreArr = Array(size).fill(0)
    .map(() => Array(size).fill(0));
  let owner = [null]; // index zero is invalid
  let [empty, stone] = scoreBoard(data, emptyIds, owner);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let id = emptyIds[y][x];
      emptyIds[y][x] = id ? owner[id] : ".";
      scoreArr[y][x] = pairMax(data[y][x], emptyIds[y][x]);
    }
  }
  return {
    Enclosed: emptyIds,
    empty: empty,
    stone: stone,
    Score: scoreArr,
    B: empty["b"] + stone["B"],
    W: empty["w"] + stone["W"],
    "?": empty["?"],
    'LibertyCount': buildLibs(data)
  }
}

function score7x7(input) {
  let data = parse(input);
  let score = createLookup(data);
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