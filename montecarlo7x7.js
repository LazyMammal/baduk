function doRollouts(input, wins, reps, maxReps, TYPE = GoEyes) {
  for (; reps < maxReps; reps++) {
    const state = inputState(input, TYPE);
    let pass = 0;
    while (pass < 2) {
      pass = playRandom(state) ? 0 : pass + 1;
    }
    let score = scoreBoard(state.board);
    let win = _.clamp(score.B - score.W, -1, 1);
    wins[win] = 1 + (wins[win] ?? 0);
  }
  let duration = performance.now() - window.baduk.start;
  let rps = reps / duration * 1e3;
  const text = [
    `Rollouts: ${reps}`,
    `   Black: ${wins[1]}`,
    `   White: ${wins[-1]}`,
    `    Ties: ${wins[0]}`,
    `    /sec: ${rps.toFixed(1)}`,
    "\n"
  ];
  return [reps, text];
}

function doRolloutReport(input, button, output, wins, reps, maxReps, TYPE) {
  let text;
  [reps, text] = doRollouts(input, wins, reps, maxReps, TYPE);
  output.innerText += text.join("\n");
  maxReps += 100;
  if (maxReps <= 300) {
    setTimeout(() => {
      doRolloutReport(input, button, output, wins, reps, maxReps, TYPE);
    }, 1);
  } else {
    button.removeAttribute("disabled");
  }
}

function montecarlo7x7(input, button, parent, TYPE = GoEyes) {
  window.baduk.start = performance.now();
  let output = parent.querySelector("[output]");
  output.innerText = "";
  let wins = Object.fromEntries([[1, 0], [-1, 0], [0, 0]]);
  setTimeout(() => {
    doRolloutReport(input, button, output, wins, 0, 100, TYPE);
  }, 1);
}