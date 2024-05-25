function DFS2(size, start,
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
  const Q = [start];
  const visited = Array(size).fill(0);
  visited[start]++;
  callback(start);
  while (Q.length) {
    let cur = Q.pop();
    if (earlyexit(cur))
      break;
    for (let adj of adjacent(cur)) {
      if (!visited[adj]) {
        visited[adj]++;
        if (callback(adj))
          Q.push(adj);
      }
    }
  }
}
