function board5x5(data) {
  // split text data by row and col
  let array = data.split("\n")
    .map(row => row.split(""));

  // get board size from data length
  let size = array.length;

  // x-axis coordinate labels
  let header = [];
  for (let col = 0; col < size; col++) {
    header.push(String.fromCharCode(65 + col));
  }

  // y-axis coordinate labels
  for (let row = size, y = 0; row > 0; row--, y++) {
    array[y].push(`${row}`);
  }

  // arrange board with spaces and labels
  let text = [header, ...array]
    .map(row => row.join(" ")).join("\n")

  return text;
}
