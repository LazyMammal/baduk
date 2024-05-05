function doRollouts(input, button, output, wins, reps, maxReps) {
  for (; reps < maxReps; reps++) {
    window.baduk.history = {};
    const state = inputState(input, GoEyes);
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
    ` History: ${window.baduk.historyDepth}`,
    "\n"
  ];
  output.innerText += text.join("\n");
  maxReps += 100;
  if (maxReps <= 300) {
    setTimeout(() => {
      doRollouts(input, button, output, wins, reps, maxReps);
    }, 1);
  } else {
    button.removeAttribute("disabled");
  }
}

function montecarlo7x7(input, button, parent) {
  window.baduk.start = performance.now();
  let output = parent.querySelector("[output]");
  output.innerText = "";
  let wins = Object.fromEntries([[1, 0], [-1, 0], [0, 0]]);
  setTimeout(() => {
    doRollouts(input, button, output, wins, 0, 100);
  }, 1);
}