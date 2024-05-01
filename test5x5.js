const badge = (success) => success ? '<mark>PASS</mark>' : '<mark warn>FAIL</mark>';

function test5x5(input) {
  let tests = extractBoards(nestedWords(input));
  let res = [];
  for (let test of tests) {
    let data = test.boards[0]; // execute function
    let lookup = createLookup(data);
    Object.assign(lookup, createScore(data));
    for (let b = 1; b < test.boards.length; b++) {
      let label = test.labels[b];
      let board = test.boards[b];
      let compare = [board, lookup[label]];
      let success = `${compare[0]}` == `${compare[1]}`;
      res.push(`${badge(success)} ${label}`);
      if (!success) {
        res.push(parallelPrint(compare
          .map(addAxisLabels)
          .map(board => board.map(row => row.join(" ")))
        ));
      }
      let extra = test.extras[b];
      for (let named of Object.keys(extra)) {
        let compare = [extra[named], lookup[named]];
        let success = `${compare[0]}` == `${compare[1]}`;
        res.push(`${badge(success)} ${label}.${named}`);
        if (!success) {
          res.push(`  ${compare[0]} != ${compare[1]}`);
        }
      }
    }
  }
  return res.join("\n");
}