function parse(text) { // text -> array[][]
  return text.split("\n") // split rows into array
    .map(row => row.split(" ")); // make cols sub-array
}

export function xLabel(col) { // A,B,C,D,E,F,G,H,J,K...
  // return String.fromCharCode(65 + col); // incl "I"
  return String.fromCharCode(col + (col < 8 ? 65 : 66));
}

export function yLabel(row) { // 1,2,3 ...
  return `${1 + row}`;
}

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