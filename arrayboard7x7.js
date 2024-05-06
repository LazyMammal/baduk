class ArrayBoard2D extends GoBoard2D {
  constructor(size) {
    super(size);
    this._data = createNested(size, GO_EMPTY);
  }
  getCode(x, y) {
    if (this._xyValid(x, y))
      return this._data[y][x];
    return GO_OOB;
  }
  setCode(x, y, val) {
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
