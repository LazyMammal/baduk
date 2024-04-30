function nestedWords(text) {
  return text.split("\n")
    .map(line => line.split("|")
      .map(seg => seg.trim().split(" "))
    );
}

function extractBoards(lines) {
  let tests = [], labels = [], boards = [], extras = [];
  for (let line of [...lines, ""]) {
    const text = _.flatten(line).join(" ");
    if (!text) { // blank line
      if (boards.length) {
        tests.push({
          labels: labels,
          boards: _.unzip(boards),
          extras: extras,
        });
      }
      boards = [];
      extras = [];
    }
    else if (text.startsWith("Board")) { // category
      labels = line.map(b => b.join(" ")); // rejoin words
    } else {
      let size = line[0].length; // input board size
      let trunc = line.map(b => b.slice(0, size));
      boards.push(trunc);

      for (let b = 0; b < line.length; b++) { // boards
        let n = extras[b] ??= {};
        let extra = line[b].slice(size); // comments
        for (let w = 0; w < extra.length; w++) {
          let word = extra[w];
          if (word.endsWith(":")) { // named output value
            n[word.slice(0, -1)] = extra[w + 1];
          }
        }
      }
    }
  }
  return tests;
}

function parallelPrint(boards) {
  return _.zip(...boards)
    .map(line => line.join("  |  "))
    .join("\n");
}

function testPrint(test) {
  let boards = parallelPrint(test.boards
    .map(addAxisLabels)
    .map(board => board.map(row => row.join(" ")))
  );
  let width = boards.indexOf("  |  ");
  let labels = test.labels
    .map(b => b.padEnd(width, " ")).join("  |  ");

  let named = test.extras //key:val pairs
    .map(b => Object.entries(b)
      .map(([k, v]) => `${k}: ${v}`)
    );
  let max = Math.max(...named.map(b => b.length));
  for (let board of named) {
    for (let n = 0; n < max; n++) {
      board[n] = (board[n] ?? "").padEnd(width, " ");
    }
  }
  let extras = _.zip(...named)  // transpose
    .map(b => b.join("     "))
    .join("\n");
  return [labels, boards, extras].flat().join("\n");
}

function extract_tests(input) {
  let lines = nestedWords(input);
  let tests = extractBoards(lines);
  let res = [];
  for (let test of tests) {
    res.push(testPrint(test));
  }
  return res.join("\n");
}