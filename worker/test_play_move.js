const testPlayMove = [{
  name: "Self-Capture I",
  toPlay: "B",
  input: [
    "B B B .", // setup
    "W W W B", // no B moves (self-capture)
    "W . W B",
    ". W W B",
  ],
  boards: [[
    "B B B .", // B pass
    "W W W B", // W:D4 is only move
    "W . W B",
    ". W W B",
  ], [
    ". . . W", // W plays D4 for capture
    "W W W .",
    "W . W .",
    ". W W .",
  ]],
}, {
  name: "Self-Capture II",
  toPlay: "B",
  input: [
    "B W W .",
    "B W . W",
    "B W W W", // no B moves (self-capture)
    "B . B B", // setup
  ],
  boards: [[
    "B W W .",
    "B W . W",
    "B W W W", // W:B4 is only move
    "B . B B", // B pass
  ], [
    ". W W .",
    ". W . W",
    ". W W W",
    ". W . .", // W plays B4 for capture
  ]],
}, {
  name: "Capture",
  toPlay: "W",
  input: [
    "W W W", // setup
    "W . W", // no W moves (eyes|legal)
    "W W W",
  ],
  boards: [[
    "W W W", // W pass
    "W . W", // B:B2 is only move
    "W W W",
  ], [
    ". . .", // B plays B2 for capture
    ". B .",
    ". . .",
  ]],
}, {
  name: "Repetition",
  toPlay: "B",
  input: [
    ". B W . W", // setup
    "B B B W W", // B:D5 is only move
    ". B W W .",
    "B B B W W",
    ". B W W .",
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
