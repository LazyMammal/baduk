console.assert(GO_OOB !== undefined);

function makeBoard(size) {
  const W = size + 1;
  const length = (W + 1) * W + 1;
  const board = new Int32Array(length);
  for (let i = 0; i < W; i++) {
    board[i] = GO_OOB; // Out-Of-Bounds
    board[i * W] = GO_OOB;
    board[board.length - i - 1] = GO_OOB;
  }
  return board;
}

const cloneBoard = (board) => board.slice();

const isPlayable = (board, pos) => board[pos] === GO_EMPTY;
const hasStone = (board, pos) => board[pos] & GO_STONE;

const xy2pos = (x, y, size) => (x + 1) + (y + 1) * (size + 1);
const pos2xy = (pos, size) => ({
  x: (pos % (size + 1)) - 1,
  y: Math.floor(pos / (size + 1)) - 1
});

const firstPos = (size) => xy2pos(0, 0, size);
const lastPos = (size) => xy2pos(size - 1, size - 1, size);

function adjacent(pos, size) { // cardinal neighbours
  const W = size + 1;
  return [-W, -1, 1, W].map(i => i + pos);
}

function diagonal(pos, size) { // diagonal neighbours
  const W = size + 1;
  return [-W - 1, -W + 1, W - 1, W + 1]
    .map(i => i + pos);
}

function patch3x3(pos, size) { // 3x3 patch
  const W = size + 1;
  return [
    -W - 1, -W, -W + 1,
    -1, 0, 1,
    W - 1, W, W + 1,
  ].map(i => i + pos);
}

function donut3x3(pos, size) { // 3x3 donut (8 adjacent)
  const W = size + 1;
  return [
    -W - 1, -W, -W + 1,
    -1, 1, // skip self
    W - 1, W, W + 1,
  ].map(i => i + pos);
}

function nthLine(num, size) { // num = 0 to size-1
  // "ring of positions" along Nth line from edge
  const flip = size - 1 - num;
  const count = flip - num;
  const coord = [];
  for (let i = 0; i < count; i++) {
    coord.push(xy2pos(num, num + i, size));
    coord.push(xy2pos(num + i, flip, size));
    coord.push(xy2pos(flip, flip - i, size));
    coord.push(xy2pos(flip - i, num, size));
  }
  return coord;
}

function loadNested(board, nested, size) {
  for (let y = 0; y < nested.length && y < size; y++) {
    for (let x = 0; x < nested[y].length && x < size; x++) {
      board[xy2pos(x, y, size)] = GO_CODES[nested[y][x]];
    }
  }
}

function printBoard(board, size, {
  addLabels = true, // axis labels
  pad = 1           // column width
} = {}) {
  const res = [];
  if (addLabels) {
    let line = [];
    for (let x = 0; x < size; x++) {
      line[x] = xLabel(x).padStart(pad, " ");
    }
    res.push(line.join(" "));
  }
  for (let y = size - 1; y >= 0; y--) {
    const row = [];
    for (let x = 0; x < size; x++) {
      const pos = xy2pos(x, y, size)
      const char = GO_CHARS[board[pos]];
      row.push(`${char}`.padStart(pad, " "));
    }
    if (addLabels)
      row.push(`:${yLabel(y)}`); // ":yLabel"
    res.push(row.join(" "));
  }
  return res.join("\n");
}
