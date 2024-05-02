function parse(text) { // text -> array[][]
  return text.split("\n") // split rows into array
    .map(row => row.split(" ")); // make cols sub-array
}

// col -> 'A','B','C'
const xLabel = (col) => String.fromCharCode(65 + col);

// row -> '1','2','3'
const yLabel = (row) => `${1 + row}`;

function addAxisLabels(data) {
  let size = data.length; // board size
  data.reverse(); // invert y-axis
  data.push([]); // add row for x-axis labels
  for (let i = 0; i < size; i++) {
    data[size][i] = xLabel(i);
    data[i][size] = `:${yLabel(i)}`;
  }
  data[size][size] = "  "; // spacing
  data.reverse(); // restore y-axis
  return data;
}

function data2text(data) { // add spaces, flatten array
  return data.map(row => row.join(" ")).join("\n");
}

function board7x7(input) { // final output
  return data2text(addAxisLabels(parse(input)));
}