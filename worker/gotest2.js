function moveTests() {
  const output = [];
  for (let t = 0; t < testPlayMove.length; t++) {
    const test = testPlayMove[t];
    const res = [];
    const board = parseBoard2D(test.input.join("\n"));
    const state = new GoState(board, GO_CODES[test.toPlay]);
    let passTurn = 0;
    for (let b = 0; b < test.boards.length; b++) {
      const expected = test.boards[b].join("\n");
      if (passTurn >= 2) {
        res.push(`Test ${t + 1}.${b + 1}:`
          + ` Game finished before expected.`);
      }
      passTurn = state.playRandom() ? 0 : passTurn + 1;
      const actual = state.board.printBoard({ addLabels: false });
      const testPass =
        `${actual}`.trim() == `${expected}`.trim();
      if (!testPass) {
        res.push([
          `Test ${t + 1}.${b + 1}:`,
          `${actual}`,
          `!=`,
          `${expected}`
        ].join("\n"));
      }
    }
    const msg = [
      badge(!res.length),
      `Test ${t + 1}/${testPlayMove.length}:`,
      test.name,
    ].join(" ");
    res.unshift(msg);
    output.push(res.join("\n"));
  }
  return output.join("\n");
}