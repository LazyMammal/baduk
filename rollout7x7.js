function rollout7x7(input) {
  const board = input ? parse(input) : new Board2D(7);

  board.set(2, 3, 'B');
  board.set(2, 1, 'W');

  return printBoard(board, {addLabels: false});
}