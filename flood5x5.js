function DFS(start, data,
  adjacent = (cur, data) => [],
  callback = (adj, data) => true,
  earlyexit = (cur, data) => false,
) {
  let Q = [start];
  let visited = {};
  visited[start] = start;
  callback(start, data);
  while (Q.length) {
    let cur = Q.pop();
    if (earlyexit(cur, data)) break;
    for (let adj of adjacent(cur, data)) {
      if (!(adj in visited)) {
        visited[adj] = cur;
        if (callback(adj, data)) Q.push(adj);
      }
    }
  }
  return visited;
}

function adj4way(cur, data) {
  let max = data.length - 1;
  let [x, y] = cur;
  let adj = [];
  if (x > 0) adj.push([x - 1, y]);
  if (y > 0) adj.push([x, y - 1]);
  if (x < max) adj.push([x + 1, y]);
  if (y < max) adj.push([x, y + 1]);
  return adj;
}

function flood5x5(input) {
  let data = parse(input);
  let size = data.length;
  let black = 0;
  let libs = 0;
  let visits = Array(size).fill(0)
    .map(() => Array(size).fill(0));
  const countFunc = ([x, y], data) => {
    let piece = data[y][x];
    black += (piece === 'X');
    libs += (piece === '.');
    visits[y][x]++;
    return (piece === 'X');
  }
  DFS([0, 0], data, adj4way, countFunc);
  let text = data2text(addAxisLabels(visits));
  text += '\n' + `Black stones: ${black}`;
  text += '\n' + `Liberty count: ${libs}`;
  return text;
}