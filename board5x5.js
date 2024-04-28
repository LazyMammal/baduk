function parse(text) { // text -> array[][]
  return text.split("\n") // split rows into array
    .map(row => row.split("")); // make cols sub-array
}

function xLabel(col) { // col -> 'A','B','C'
  return String.fromCharCode(65 + col);
}

function yLabel(row) { // row -> '1','2','3'
  return `${1 + row}`;
}

function board5x5(input) {
  let data = parse(input);
  let size = data.length; // board size
  data.push([]); // add row for x-axis labels
  for (let i = 0; i < size; i++) {
    data[size][i] = xLabel(i);
    data[i][size] = yLabel(i);
  }
  return data.map(row => row.join(" ")).join("\n");
}
