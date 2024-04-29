function buildChains(data, chains, libs) {
  let size = data.length;
  let chainId = 0;
  let stoneType = '';
  const chainFunc = ([x, y], data) => {
    let piece = data[y][x];
    if (piece === stoneType) chains[y][x] = chainId;
    libs[chainId] += (piece === '.');
    return (piece === stoneType);
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!chains[y][x] && data[y][x] != '.') {
        chainId++;
        libs[chainId] = 0;
        stoneType = data[y][x];
        DFS([x, y], data, adj4way, chainFunc);
      }
    }
  }
}

function chain5x5(input) {
  let data = parse(input);
  let size = data.length;

  let chains = Array(size).fill(0)
    .map(() => Array(size).fill(0));
  let libs = [null]; // index zero is invalid
  buildChains(data, chains, libs);
  let libsArr = Array(size).fill(0)
    .map(() => Array(size).fill(0));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let id = chains[y][x];
      libsArr[y][x] = id ? libs[id] : '.';
    }
  }
  let text = data2text(addAxisLabels(chains));
  text += '\n' + data2text(addAxisLabels(libsArr));
  return text;
}