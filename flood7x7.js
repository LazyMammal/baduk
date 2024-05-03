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
  const board = parse(input);
  let black = 0;
  let libs = 0;
  let total = 0;
  let visits = new Board2D(board.size, 0, 0);
  const followStone = ([x, y]) => {
    const piece = board.get(x, y);
    const isStone = piece === "B";
    black += isStone;
    libs += piece === ".";
    visits.set(x, y, visits.get(x, y) + 1);
    total++;
    return isStone;
  }
  DFS([0, 0], xy4way, followStone);
  return [
    printBoard(visits),
    `Black stones:  ${black}`,
    `Liberty count: ${libs}`,
    `Total visits:  ${total}`,
    `Out of bounds: ${total - black - libs}`
  ].join("\n");
}