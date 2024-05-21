function test1() {
  const blank = parse(defaultInput);
  const size = blank.size;
  const half = Math.floor(size / 2);
  console.log(blank.board.printBoard());
  for (let n = 0; n < half; n++) {
    const state = blank.clone();
    for (let pos of state.board.nthLine(n)) {
      if (state.board.board[pos] !== GO_OOB)
        state.board.board[pos] = GO_BLACK;
    }
    console.log(state.board.printBoard());
  }
  const state = blank.clone();
  const tengen = state.board.xy2pos(half, half);
  for (let pos of state.board.patch3x3(tengen)) {
    if (state.board.board[pos] !== GO_OOB)
      state.board.board[pos] = GO_WHITE;
  }
  console.log(state.board.printBoard());
  for (let pos of state.board.adjacent(tengen)) {
    if (state.board.board[pos] !== GO_OOB)
      state.board.board[pos] = GO_BLACK;
  }
  console.log(state.board.printBoard());
  for (let pos of state.board.diagonal(tengen)) {
    if (state.board.board[pos] !== GO_OOB)
      state.board.board[pos] = GO_BLACK;
  }
  console.log(state.board.printBoard());
  const pos0 = state.board.xy2pos(0, 0);
  for (let pos of state.board.diagonal(pos0)) {
    if (state.board.board[pos] !== GO_OOB)
      state.board.board[pos] = GO_WHITE;
  }
  console.log(state.board.printBoard());
  for (let pos of state.board.adjacent(pos0)) {
    if (state.board.board[pos] !== GO_OOB)
      state.board.board[pos] = GO_WHITE;
  }
  console.log(state.board.printBoard());
  const shuffle = new ShuffleRings(state.board);
  console.log(shuffle.getMoveOrder());
}

self.onmessage = (event) => {
  if (Object.hasOwn(event.data, "worker")) {
    console.log(event.data.worker);
    importScripts(...event.data.worker); // first run
    test1();
  } else {
    const input = event.data.trim();
    const text = input.length ? input : defaultInput;
    const state = parse(text);
    self.postMessage(`size ${state.size}`);
  }
};