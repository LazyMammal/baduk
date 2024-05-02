function getTokens(text) {
  return text.split("\n")
    .map(line => line.trim().split(" "));
}

function parseTest(lines) {
  let test = [];
  let label = '';
  let board = [];
  for (let line of lines) {
    if (!line[0].length) { // blank line
      if (board.length) {
        test.push([label, board]);
      }
      board = [];
    }
    else if (line.length === 1) { // label
      label = line[0];
    } else if (line[1] === "=") { // named
      test.push([line[0], line[2]]);
    } else {
      board.push(line);
    }
  }
  return test;
}

function testPrint(test) {
  let res = [];
  for(let [label, data] of test) {
    if(Array.isArray(data)) {
      res.push(label);
      res.push(data2text(addAxisLabels(data)));
    } else {
      res.push(`${label} = ${data}`);
    }
  }
  return res.join("\n");
}

function extract_tests(input) {
  let lines = getTokens(input);
  let test = parseTest(lines);
  return testPrint(test);
}