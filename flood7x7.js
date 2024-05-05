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
  visited[start] = start;
  callback(start);
  while (Q.length) {
    let cur = Q.pop();
    if (earlyexit(cur))
      break;
    for (let adj of adjacent(cur)) {
      if (!(adj in visited)) {
        visited[adj] = cur;
        if (callback(adj))
          Q.push(adj);
      }
    }
  }
  return visited;
}

function xy4way(pos) {
  /*
  - generic for [x, y] 
  - doesn't know board.size
  */
  const [x, y] = pos;
  return [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1]
  ];
}

function flood7x7(input) {
  const board = parse(input, GoBoard2D);
  let black = 0;
  let libs = 0;
  let total = 0;
  let visits = createNested(board.size, 0);
  const followBlack = ([x, y]) => {
    const isStone = board.isBlack(x, y);
    black += isStone;
    libs += board.isEmpty(x, y);
    visits[y][x]++;
    total++;
    return isStone;
  }
  DFS([0, 0], xy4way, followBlack);
  return [
    printBoard(visits),
    `Black stones:  ${black}`,
    `Liberty count: ${libs}`,
    `Total visits:  ${total}`,
    `Out of bounds: ${total - black - libs}`
  ].join("\n");
}