const badge = (success) => success ?
  '<mark>PASS</mark>' : '<mark warn>FAIL</mark>';

function test7x7(input, callback = createLookup) {
  let res = [];
  let test = parseTest(getTokens(input));
  let [label, data] = test[0]; // data to run
  let lookup = callback(data); // run

  for (let t = 1; t < test.length; t++) {
    let [label, data] = test[t];
    let pass = `${data}` == `${lookup[label]}`;
    let msg = [
      badge(pass),
      `Test ${t}/${test.length - 1}`,
      label,
    ];
    res.push(msg.join(" "));
    if (!pass) { // feedback
      if (Array.isArray(data)) {
        res.push(data2text(addAxisLabels(data)));
      } else {
        res.push(`${data} != ${lookup[label]}`);
      }
    }
  }
  return res.join("\n");
}