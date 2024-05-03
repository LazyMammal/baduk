function rollout7x7(input) {
  const board = input ? parse(input) : new Board2D(7);

  const rndPos = () => Math.floor(Math.random() * board.size);

  let [x, y] = [rndPos(), rndPos()];
  board.set(x, y, Math.random() > .5 ? 'B' : 'W');

  return [
    printBoard(board, { addLabels: false }),
    ...(_.range(5).map(n => `Line ${n}`))
  ].join("\n");
}