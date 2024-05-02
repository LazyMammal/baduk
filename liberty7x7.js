function buildLibs(data) {
  let size = data.length;
  let libCount = Array(size).fill(0)
    .map(() => Array(size).fill("."));
  let stoneType = '', count = 0;
  const libFunc = ([x, y], data) => {
    let piece = data[y][x];
    count += piece === '.';
    return (piece === stoneType);
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (data[y][x] !== '.') {
        stoneType = data[y][x];
        count = 0;
        DFS([x, y], data, adj4way, libFunc);
        libCount[y][x] = count;
      }
    }
  }
  return libCount;
}

function liberty7x7(input) {
  let data = parse(input);
  let libCount = buildLibs(data);
  return data2text(addAxisLabels(libCount));
}