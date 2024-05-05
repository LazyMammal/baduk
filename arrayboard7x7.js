class ArrayBoard2D extends GoBoard2D {
  constructor(size,
    empty = ".",
    oob = "#",
    black = "B",
    white = "W") {
    super(size, empty, oob, black, white);
    this._data = createNested(size, empty);
  }
  _get(x, y) {
    if (this._xyValid(x, y))
      return this._data[y][x];
    return this._oob;
  }
  _set(x, y, val) {
    if (this._xyValid(x, y))
      this._data[y][x] = val;
  }
}

function arrayboard7x7(input) {
  return printBoard(parse(input, ArrayBoard2D));
}

function move_tests_arrayboard7x7(input) {
  return move_tests(input, GoEarlyExit, ArrayBoard2D);
}

function rolloutReport_arrayboard7x7(input, button, parent) {
  montecarlo7x7(input, button, parent, GoEarlyExit, ArrayBoard2D);
}
