const badge = (success) => success ?
  '<mark>PASS</mark>' : '<mark warn>FAIL</mark>';

function createLookup(data) {
  const board = parse(data);
  const enclosed = createNested(board.size, ".");
  const stoneArr = createNested(board.size, ".");
  let score = scoreBoard(board, enclosed, stoneArr);
  return Object.assign(score, {
    Enclosed: printNested(enclosed, false),
    Score: printNested(stoneArr, false),
    'LibertyCount': printNested(buildLibs(board), false),
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