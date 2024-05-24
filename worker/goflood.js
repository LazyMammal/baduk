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
  const _key = ({ x, y }) => `${x}|${y}`;
  let Q = [start];
  let visited = {};
  visited[_key(start)] = start;
  callback(start);
  while (Q.length) {
    let cur = Q.pop();
    if (earlyexit(cur))
      break;
    for (let adj of adjacent(cur)) {
      const k = _key(adj);
      if (!(k in visited)) {
        visited[k] = cur;
        if (callback(adj))
          Q.push(adj);
      }
    }
  }
  return visited;
}

function xy4way(pos) {
  /*
  - generic for {x, y} 
  - doesn't know board.size
  */
  const { x, y } = pos;
  return [
    { x: x - 1, y: y },
    { x: x + 1, y: y },
    { x: x, y: y - 1 },
    { x: x, y: y + 1 },
  ];
}

function floodFill(input) {
  const board = parseBoard2D(input);

  let black = 0;
  let libs = 0;
  let total = 0;
  let visits = createNested(board.size, 0);
  const followBlack = ({ x, y }) => {
    const isStone = board.isBlack(x, y);
    black += isStone;
    libs += board.isEmpty(x, y);
    if (board._xyValid(x, y))
      visits[y][x]++;
    total++;
    return isStone;
  }
  DFS({ x: 0, y: 0 }, xy4way, followBlack);
  return [
    printNested(visits),
    `Black stones:  ${black}`,
    `Liberty count: ${libs}`,
    `Total visits:  ${total}`,
    `Out of bounds: ${total - black - libs}`
  ].join("\n");
}
