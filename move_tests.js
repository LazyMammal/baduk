const testList = [{
  name: "Self-Capture",
  input: [
    "B B B .", // setup
    "W W W B", // no B moves (self-capture)
    "W . W B",
    ". W W B",
    "toPlay: B"
  ],
  boards: [[
    "B B B .", // B pass
    "W W W B", // W:D4 is only move
    "W . W B",
    ". W W B\n"
  ], [
    ". . . W", // W plays D4 for capture
    "W W W .",
    "W . W .",
    ". W W .\n"
  ]],
}, {
  name: "Capture",
  input: [
    "W W W", // setup
    "W . W", // no W moves (eyes|legal)
    "W W W",
    "toPlay: W",
  ],
  boards: [[
    "W W W", // W pass
    "W . W", // B:B2 is only move
    "W W W\n"
  ], [
    ". . .", // B plays B2 for capture
    ". B .",
    ". . .\n"
  ]],
}, {
  name: "Repetition",
  input: [
    ". B W . W", // setup
    "B B B W W", // B:D5 is only move
    ". B W W .",
    "B B B W W",
    ". B W W .",
    "toPlay: B",
  ],
  boards: [[
    ". B . B W", // B plays D5
    "B B B W W", // no W moves (repetition)
    ". B W W .",
    "B B B W W",
    ". B W W ."
  ], [
    ". B . B W", // W pass
    "B B B W W", // B:C5 is only move
    ". B W W .",
    "B B B W W",
    ". B W W ."
  ], [
    ". B B B W", // B plays C5
    "B B B W W", // no W moves (eyes)
    ". B W W .",
    "B B B W W",
    ". B W W ."
  ], [
    ". B B B W", // W pass
    "B B B W W", // no B moves (eyes)
    ". B W W .",
    "B B B W W",
    ". B W W ."
  ], [
    ". B B B W", // B pass
    "B B B W W", // end of game
    ". B W W .",
    "B B B W W",
    ". B W W ."
  ]],
}]

function move_tests(input, STATE = GoEyes, BOARD = GoBoard2D) {
  const output = [];
  for (let t = 0; t < testList.length; t++) {
    const test = testList[t];
    const res = [];
    const state = inputState(test.input.join("\n"), STATE, BOARD);
    let passTurn = 0;
    for (let b = 0; b < test.boards.length; b++) {
      const expected = test.boards[b].join("\n");
      if (passTurn >= 2) {
        res.push(`Test ${t + 1}.${b + 1}:`
          + ` Game finished before expected.`);
      }
      passTurn = playRandom(state) ? 0 : passTurn + 1;
      const actual = printBoard(state.board,
        { addLabels: false });
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
      `Test ${t + 1}/${testList.length}:`,
      test.name,
    ].join(" ");
    res.unshift(msg);
    output.push(res.join("\n"));
  }
  return output.join("\n");
}