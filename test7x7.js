const badge = (success) => success ?
  '<mark>PASS</mark>' : '<mark warn>FAIL</mark>';

function createLookup(data) {
  const board = parse(data.join("\n"));
  const enclosed = createNested(board.size, ".");
  const stoneArr = createNested(board.size, ".");
  let score = scoreBoard(board, enclosed, stoneArr);
  return Object.assign(score, {
    Enclosed: printNested(enclosed, true),
    Score: printNested(stoneArr, true),
    'LibertyCount': printNested(buildLibs(board), true),
  });
}

function test7x7(input, options, callback = createLookup) {
  let res = [];
  let lookup = callback(libertyScoreTest["Board"]); // run
  let test = Object.entries(libertyScoreTest);
  for (let t = 0; t < test.length; t++) {
    let [label, data] = test[t];
    if(label === "Board")
      continue;
    if (Array.isArray(data)) {
      data = data.join("\n");
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