function nestedWords(text) {
  return text.split("\n")
    .map(line => line.split("|")
      .map(seg => seg.trim().split(" "))
    );
}

function extractBoards(lines) {
  let tests = {}, board = [], category = "None";
  for (let line of lines) {
    const text = _.flatten(line).join(" ");
    if (!text) { // blank line
      if (board.length)
        tests[category].push(_.unzip(board));
      board = [];
    }
    else if (text.startsWith("Board")) { // category
      category = text.slice(6);
      tests[category] = [];
    } else {
      board.push(line);
    }
  }
  if (board.length)
    tests[category].push(_.unzip(board));
  return tests;
}

function parallelPrint(boards) {
  return _.zip(...boards
    .map(b => addAxisLabels(b, true))
    .map(b => b.map(row => row.join(" "))))
    .map(b => b.join("  |  "))
    .join("\n");
}

function extract_tests(input) {
  let lines = nestedWords(input);
  let tests = extractBoards(lines);
  let res = [];
  for (let category of Object.keys(tests)) {
    res.push(category);
    for (let boards of tests[category]) {
      res.push(parallelPrint(boards));
    }
  }
  return res.join("\n");
}