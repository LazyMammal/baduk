function buildLibs(board) {
  const libCount = createNested(board.size, 0);
  let libs = 0;
  const followBlack = ([x, y]) => {
    libs += board.isEmpty(x, y);
    return board.isBlack(x, y);
  }
  const followWhite = ([x, y]) => {
    libs += board.isEmpty(x, y);
    return board.isWhite(x, y);
  }
  for (let y = 0; y < board.size; y++) {
    for (let x = 0; x < board.size; x++) {
      if (board.isStone(x, y)) {
        libs = 0;
        DFS([x, y], xy4way,
          board.isBlack(x, y) ? followBlack : followWhite);
        libCount[y][x] = libs;
      } else {
        libCount[y][x] = ".";
      }
    }
  }
  return libCount;
}

function liberty7x7(input) {
  const board = parse(input);
  const libCount = buildLibs(board);
  return printNested(libCount);
}