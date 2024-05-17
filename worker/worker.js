importScripts(
  "goutil.js",
  "goboard.js",
  "goshuffle.js",
  "gostate.js"
);

function test1() {
  const blank = parse(".......\n".repeat(7));
  const size = blank.size;
  const half = Math.floor(size / 2);
  const tengen = xy2pos(half, half, size);
  console.log(printBoard(blank.board, size));
  for (let n = 0; n < half; n++) {
    const state = blank.clone();
    for (let pos of nthLine(n, size)) {
      if (isPlayable(state.board, pos))
        state.board[pos] = GO_BLACK;
    }
    console.log(printBoard(state.board, size));
  }
  const state = blank.clone();
  for (let pos of patch3x3(tengen, size)) {
    if (isPlayable(state.board, pos))
      state.board[pos] = GO_BLACK;
  }
  console.log(printBoard(state.board, size));
  for (let pos of adjacent(tengen, size)) {
    if (isPlayable(state.board, pos))
      state.board[pos] = GO_WHITE;
  }
  console.log(printBoard(state.board, size));
  for (let pos of diagonal(tengen, size)) {
    if (isPlayable(state.board, pos))
      state.board[pos] = GO_WHITE;
  }
  console.log(printBoard(state.board, size));
  for (let pos of diagonal(xy2pos(0, 0, size), size)) {
    if (isPlayable(state.board, pos))
      state.board[pos] = GO_WHITE;
  }
  console.log(printBoard(state.board, size));
  for (let pos of adjacent(xy2pos(0, 0, size), size)) {
    if (isPlayable(state.board, pos))
      state.board[pos] = GO_WHITE;
  }
  console.log(printBoard(state.board, size));
  const shuffle = new ShuffleRings(size);
  console.log(shuffle.getMoveOrder());
}
test1();

self.onmessage = (event) => {
  let [gobanId, ...args] = event.data;
  let result = "";
  self.postMessage([gobanId, result]);
};