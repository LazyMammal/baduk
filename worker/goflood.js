function DFS(start,
  adjacent = (pos) => [],
  callback = (pos) => true,
  earlyexit = (pos) => false,
) {
  /*
  Depth First Search (DFS)
  - generic with callbacks
  - no knowledge of TYPE
  - not optimized
  */
  let Q = [start];
  let visited = {};
  visited[key(start)] = start;
  callback(start);
  while (Q.length) {
    let cur = Q.pop();
    if (earlyexit(cur))
      break;
    for (let adj of adjacent(cur)) {
      const k = key(adj);
      if (!(k in visited)) {
        visited[k] = cur;
        if (callback(adj))
          Q.push(adj);
      }
    }
  }
  // return visited;
}

function floodFill(input) {
  const board = parseBoard2D(input);

  let black = 0;
  let libs = 0;
  let total = 0;
  let visits = createNested(board.size, 0);
  const followBlack = (pos) => {
    const isStone = board.isBlack(pos);
    black += isStone;
    libs += board.isEmpty(pos);
    const { x, y } = board.pos2xy(pos);
    if (board._xyValid(pos))
      visits[y][x]++;
    total++;
    return isStone;
  }
  DFS(board.firstPos(), (pos) => board.adjacent(pos), followBlack);
  return [
    printNested(visits),
    `Black stones:  ${black}`,
    `Liberty count: ${libs}`,
    `Total visits:  ${total}`,
    `Out of bounds: ${total - black - libs}`
  ].join("\n");
}
