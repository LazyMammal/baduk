function playMove(input) {
  const board = parseBoard2D(input);
  const props = parseProps(input);
  const toPlay = props?.toPlay === "W" ? "W" : "B";
  const state = new GoState(board, GO_CODES[toPlay]);
  state.turn = props?.turn ?? 0;
  state.playRandom();
  return [
    // state.board.printBoard({ addLabels: false }),
    markLegal(state),
    `toPlay: ${GO_CHARS[state.playerCode]}`,
    `turn: ${state.turn}`,
  ].join("\n");
}