function buildLibs(board) {
  const libCount = new Board2D(board.size, 0, 0);
  let stoneType = "";
  let libs = 0;
  const followStoneType = ([x, y]) => {
    const piece = board.get(x, y);
    libs += piece === ".";
    return piece === stoneType;
  }
  for (let y = 0; y < board.size; y++) {
    for (let x = 0; x < board.size; x++) {
      const piece = board.get(x, y);
      if (piece !== ".") {
        stoneType = piece;
        libs = 0;
        DFS([x, y], xy4way, followStoneType);
        libCount.set(x, y, libs);
      } else {
        libCount.set(x, y, ".");
      }
    }
  }
  return libCount;
}

function liberty7x7(input) {
  const board = parse(input);
  const libCount = buildLibs(board);
  return printBoard(libCount, {dotZero: false});
}