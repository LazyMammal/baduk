function board(data, output) {
  // split text data by row and by col
  let array = data.split("\n")
    .map(row => row.split(""));

  // get board size from data size
  let size = array.length;

  // x-axis coordinates
  let header = [];
  for (let col = 0; col < size; col++) {
    header.push(String.fromCharCode(65 + col));
  }

  // y-axis coordinates
  for (let row = size, y = 0; row > 0; row--, y++) {
    array[y].push(`${row}`);
  }

  // arrange board
  let text = [header, ...array]
    .map(row => row.join(" ")).join("\n")

  // output board
  output.text(text);
}
