export class Baduk {
  data;
  size;
  constructor(size = 0) {
    if (size) this.data = Array(size).fill(0)
      .map(() => Array(size).fill("."));
    this.size = size;
  }

  parse(text) { // text -> array[][]
    this.data = text.split("\n") // split rows
      .map(row => row.split(" ")); // split cols
    this.size = this.data.length; // board size
  }

  buildLibs() {
    let libCount = Array(this.size).fill(0)
      .map(() => Array(this.size).fill("."));
    let stoneType = '', count = 0;
    const libFunc = ([x, y], data) => {
      let piece = data[y][x];
      count += piece === '.';
      return (piece === stoneType);
    }
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.data[y][x] !== '.') {
          stoneType = this.data[y][x];
          count = 0;
          DFS([x, y], this.data, adj4way, libFunc);
          libCount[y][x] = count;
        }
      }
    }
    return libCount;
  }

  scoreBoard() {
    let encloseArr = Array(this.size).fill(0)
      .map(() => Array(this.size).fill("."));
    let scoreArr = Array(this.size).fill(0)
      .map(() => Array(this.size).fill("."));
    let adjCount;
    const scoreFunc = ([x, y], data) => {
      let piece = data[y][x];
      adjCount[piece]++;
      return (piece === ".");
    }
    let emptyCount = { "b": 0, "w": 0, "?": 0 };
    let stoneCount = { "B": 0, "W": 0, ".": 0 };
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let piece = this.data[y][x];
        if (piece === ".") {
          adjCount = { "B": 0, "W": 0, ".": 0 };
          DFS([x, y], this.data, adj4way, scoreFunc);
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
    return {
      Enclosed: encloseArr,
      empty: emptyCount,
      stone: stoneCount,
      Score: scoreArr,
      B: emptyCount["b"] + stoneCount["B"],
      W: emptyCount["w"] + stoneCount["W"],
      "?": emptyCount["?"],
    }
  }
}

export function DFS(start, data,
  adjacent = (cur, data) => [],
  callback = (adj, data) => true,
  earlyexit = (cur, data) => false,
) {
  let Q = [start];
  let visited = {};
  visited[start] = start;
  callback(start, data);
  while (Q.length) {
    let cur = Q.pop();
    if (earlyexit(cur, data)) break;
    for (let adj of adjacent(cur, data)) {
      if (!(adj in visited)) {
        visited[adj] = cur;
        if (callback(adj, data)) Q.push(adj);
      }
    }
  }
  return visited;
}

export function adj4way(cur, data) {
  let max = data.length - 1;
  let [x, y] = cur;
  let adj = [];
  if (x > 0) adj.push([x - 1, y]);
  if (y > 0) adj.push([x, y - 1]);
  if (x < max) adj.push([x + 1, y]);
  if (y < max) adj.push([x, y + 1]);
  return adj;
}

export function xLabel(col) { // A,B,C,D,E,F,G,H,J,K...
  // return String.fromCharCode(65 + col); // incl "I"
  return String.fromCharCode(col + (col < 8 ? 65 : 66));
}

export function yLabel(row) { // 1,2,3 ...
  return `${1 + row}`;
}

export function data2text(data) { // add spaces, newlines
  return data.map(row => row.join(" ")).join("\n");
}

export function addAxisLabels(data) {
  let size = data.length; // board size
  data.reverse(); // invert y-axis
  data.push([]); // add row for x-axis labels
  for (let i = 0; i < size; i++) {
    data[size][i] = xLabel(i);
    data[i][size] = `:${yLabel(i)}`;
  }
  data[size][size] = "  "; // print spacing
  data.reverse(); // restore y-axis
  return data;
}

export function all_board7x7(input) { // final output
  let board = new Baduk();
  board.parse(input);
  return data2text(addAxisLabels(board.data));
}

export function all_flood7x7(input) {
  let board = new Baduk();
  board.parse(input);
  let black = 0;
  let libs = 0;
  let visits = Array(board.size).fill(0)
    .map(() => Array(board.size).fill(0));
  const countFunc = ([x, y], data) => {
    let piece = data[y][x];
    black += (piece === "B");
    libs += (piece === ".");
    visits[y][x]++;
    return (piece === "B");
  }
  DFS([0, 0], board.data, adj4way, countFunc);
  let text = data2text(addAxisLabels(visits));
  text += "\n" + `Black stones: ${black}`;
  text += "\n" + `Liberty count: ${libs}`;
  return text;
}

export function all_liberty7x7(input) {
  let board = new Baduk();
  board.parse(input);
  let libCount = board.buildLibs();
  return data2text(addAxisLabels(libCount));
}

export function all_score7x7(input) {
  let board = new Baduk();
  board.parse(input);
  let score = board.scoreBoard();
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

export function all_createLookup(data) {
  let board = new Baduk();
  board.size = data.length;
  board.data = data;
  return Object.assign(board.scoreBoard(), {
    'LibertyCount': board.buildLibs()
  });
}

export function all_test7x7(input) {
  return test7x7(input, all_createLookup);
}
