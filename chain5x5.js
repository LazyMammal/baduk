function buildChains(data, chains, id2libs) {
  let size = data.length;
  let chainId = 0;
  let stoneType = '';
  const chainFunc = ([x, y], data) => {
    let piece = data[y][x];
    if (piece === stoneType) chains[y][x] = chainId;
    id2libs[chainId] += (piece === '.');
    return (piece === stoneType);
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!chains[y][x] && data[y][x] !== '.') {
        chainId++;
        id2libs[chainId] = 0;
        stoneType = data[y][x];
        DFS([x, y], data, adj4way, chainFunc);
      }
    }
  }
}

function buildLibs(data, chains, id2libs, libCount) {
  let size = data.length;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let id = chains[y][x];
      libCount[y][x] = id ? id2libs[id] : '.';
    }
  }
}

function createLookup(data) {
  let size = data.length;
  let chains = Array(size).fill(0)
    .map(() => Array(size).fill(0));
  let id2libs = [null]; // index zero is invalid
  buildChains(data, chains, id2libs);
  let libCount = Array(size).fill(0)
    .map(() => Array(size).fill(0));
  buildLibs(data, chains, id2libs, libCount);
  return {
    chains: chains,
    id2libs: id2libs,
    libCount: libCount,
    'Liberty Count': libCount,
  }
}

function chain5x5(input) {
  let data = parse(input);
  let lookup = createLookup(data);
  return [
    data2text(addAxisLabels(lookup.chains)),
    data2text(addAxisLabels(lookup.libCount))
  ].join("\n");
}