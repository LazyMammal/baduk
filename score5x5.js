function scoreBoard(data, emptyIds, owner) {
  let size = data.length;
  let emptyId = 0;
  let adjCount;
  const scoreFunc = ([x, y], data) => {
    let piece = data[y][x];
    adjCount[piece]++;
    if (piece === '.') emptyIds[y][x] = emptyId;
    return (piece === '.');
  }
  let emptyCount = { 'x': 0, 'o': 0, '?': 0 };
  let stoneCount = { 'X': 0, 'O': 0, '.': 0 };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!emptyIds[y][x]) {
        let piece = data[y][x];
        if (piece === '.') {
          emptyId++;
          adjCount = { 'X': 0, 'O': 0, '.': 0 };
          DFS([x, y], data, adj4way, scoreFunc);
          owner[emptyId] = '?';
          if (adjCount['O'] && adjCount['X'] === 0) {
            owner[emptyId] = 'o';
          }
          else if (adjCount['X'] && adjCount['O'] === 0) {
            owner[emptyId] = 'x';
          }
          emptyCount[owner[emptyId]] += adjCount['.'];
        } else {
          stoneCount[piece]++;
        }
      }
    }
  }
  return [emptyCount, stoneCount, owner];
}

const pairMax = (a, b) => a > b ? a : b;

function createScore(data) {
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
      emptyIds[y][x] = id ? owner[id] : '.';
      scoreArr[y][x] = pairMax(data[y][x], emptyIds[y][x]);
    }
  }
  return {
    Enclosed: emptyIds,
    empty: empty,
    stone: stone,
    Score: scoreArr,
    Black: empty['x'] + stone['X'],
    White: empty['o'] + stone['O'],
    '?????': empty['?']
  }
}

function score5x5(input) {
  let data = parse(input);
  let score = createScore(data);
  return [
    data2text(addAxisLabels(score.Enclosed)),
    `Enclose: x:${score.empty['x']} o:${score.empty['o']}`,
    `Stones:  X:${score.stone['X']} O:${score.stone['O']}`,
    data2text(addAxisLabels(score.Score)),
    `Black: ${score.Black}`,
    `White: ${score.White}`,
    `?????: ${score['?????']}`,
  ].join("\n");
}