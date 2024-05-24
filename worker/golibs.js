function buildLibs(board) {
  const libCount = createNested(board.size, 0);
  let libs = 0;
  const followBlack = (pos) => {
    libs += board.isEmpty(pos);
    return board.isBlack(pos);
  }
  const followWhite = (pos) => {
    libs += board.isEmpty(pos);
    return board.isWhite(pos);
  }
  for (let y = 0; y < board.size; y++) {
    for (let x = 0; x < board.size; x++) {
      const pos = board.xy2pos(x, y);
      if (board.isStone(pos)) {
        libs = 0;
        DFS(pos, (pos) => board.adjacent(pos),
          board.isBlack(pos) ? followBlack : followWhite);
        libCount[y][x] = libs;
      } else {
        libCount[y][x] = ".";
      }
    }
  }
  return libCount;
}

function libertyCount(input) {
  const board = parseBoard2D(input);
  const libCount = buildLibs(board);
  return printNested(libCount);
}