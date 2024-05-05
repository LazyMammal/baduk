const badge = (success) => success ?
  '<mark>PASS</mark>' : '<mark warn>FAIL</mark>';

function createLookup(data) {
  const board = parse(data);
  const score = scoreBoard(board);
  return Object.assign(score, {
    Enclosed: printNested(score.Enclosed),
    Score: printNested(score.Score),
    'LibertyCount': printNested(buildLibs(board)),
  });
}

function test7x7(input, callback = createLookup) {
  let res = [];
  let test = parseTest(getTokens(input));
  let [label, caseData] = test[0]; // testcase data
  let lookup = callback(caseData); // run
  for (let t = 1; t < test.length; t++) {
    let [label, data] = test[t];
    if (Array.isArray(data)) {
      data = printNested(data, false);
    }
    let pass = `${data}` == `${lookup[label]}`;
    let msg = [
      badge(pass),
      `Test ${t}/${test.length - 1}`,
      label,
    ];
    res.push(msg.join(" "));
    if (!pass) { // feedback
      res.push(`${data} != ${lookup[label]}`);
    }
  }
  return res.join("\n");
}