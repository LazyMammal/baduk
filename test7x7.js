const badge = (success) => success ?
  '<mark>PASS</mark>' : '<mark warn>FAIL</mark>';

function createLookup(data) {
  const board = parse(data);
  const score = scoreBoard(board);
  return Object.assign(score, {
    Enclosed: printBoard(score.Enclosed, false),
    Score: printBoard(score.Score, false),
    'LibertyCount': printBoard(buildLibs(board), false, 1, false),
  });
}

function test7x7(input, callback = createLookup) {
  let res = [];
  let test = parseTest(getTokens(input));
  let [label, caseData] = test[0]; // testcase data
  let lookup = callback(caseData); // run
  for (let t = 1; t < test.length; t++) {
    let [label, data] = test[t];
    let pass = `${data}` == `${lookup[label]}`;
    let data2;
    if (Array.isArray(data)) {
      data2 = printBoard(parse(data), false);
      pass = `${data2}` == `${lookup[label]}`;
    }
    let msg = [
      badge(pass),
      `Test ${t}/${test.length - 1}`,
      label,
    ];
    res.push(msg.join(" "));
    if (!pass) { // feedback
      res.push(`${data2 ?? data} != ${lookup[label]}`);
    }
  }
  return res.join("\n");
}