function scoreBoard(data, enclosedArr) {
  let size = data.length;
  let emptyId = 0;
  let enclosed = [null]; // index zero is invalid
  let adjCount;
  const scoreFunc = ([x, y], data) => {
    let piece = data[y][x];
    adjCount[piece]++;
    if (piece === '.') enclosedArr[y][x] = emptyId;
    return (piece === '.');
  }
  let emptyCount = { 'X': 0, 'O': 0 };
  let stoneCount = { 'X': 0, 'O': 0 };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!enclosedArr[y][x]) {
        let piece = data[y][x];
        if (piece === '.') {
          emptyId++;
          adjCount = { 'X': 0, 'O': 0, '.': 0 };
          DFS([x, y], data, adj4way, scoreFunc);
          enclosed[emptyId] = '?';
          if (adjCount['O'] && adjCount['X'] === 0) {
            emptyCount['O'] += adjCount['.'];
            enclosed[emptyId] = 'o';
          }
          else if (adjCount['X'] && adjCount['O'] === 0) {
            emptyCount['X'] += adjCount['.'];
            enclosed[emptyId] = 'x';
          }
        } else {
          stoneCount[piece]++;
        }
      }
    }
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let id = enclosedArr[y][x];
      enclosedArr[y][x] = id ? enclosed[id] : '.';
    }
  }
  return [emptyCount, stoneCount];
}

function score5x5(input) {
  let data = parse(input);
  let size = data.length;

  let enclosedArr = Array(size).fill(0)
    .map(() => Array(size).fill(0));
  let [empty, stone] = scoreBoard(data, enclosedArr);
  let score = {};
  score['X'] = empty['X'] + stone['X'];
  score['O'] = empty['O'] + stone['O'];
  let text = data2text(addAxisLabels(enclosedArr))
    + `\nEnclose: X=${empty['X']} O=${empty['O']}`
    + `\nStones:  X=${stone['X']} O=${stone['O']}`
    + `\nScore:   X=${score['X']} O=${score['O']}`;
  return text;
}