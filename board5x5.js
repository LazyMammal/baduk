function parse(text) { // text -> array[][]
  return text.split("\n") // split rows into array
    .map(row => row.split(" ")); // make cols sub-array
}

// col -> 'A','B','C'
const xLabel = (col) => String.fromCharCode(65 + col);

// row -> '1','2','3'
const yLabel = (row) => `${1 + row}`;

function addAxisLabels(data, trunc = false) {
  let size = data.length; // board size
  data.push([]); // add row for x-axis labels
  for (let i = 0; i < size; i++) {
    if (trunc) data[i].length = size;
    data[size][i] = xLabel(i);
    data[i][size] = `:${yLabel(i)}`;
  }
  data[size][size] = "  ";  // spacing
  return data;
}

function data2text(data) { // add spaces, flatten array
  return data.map(row => row.join(" ")).join("\n");
}

function board5x5(input) { // final output
  return data2text(addAxisLabels(parse(input)));
}