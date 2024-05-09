function doRollouts(input, wins, reps, maxReps, STATE, BOARD) {
  for (; reps < maxReps; reps++) {
    const state = inputState(input, STATE, BOARD);
    const maxTurns = 3 * Math.pow(state.board.size + 3, 2);
    let pass = 0;
    for(let turn = 0; pass < 2 && turn < maxTurns; turn++) {
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

function doRolloutReport(input, button, output, wins, reps, maxReps, STATE, BOARD) {
  let text;
  [reps, text] = doRollouts(input, wins, reps, maxReps, STATE, BOARD);
  output.innerText += text.join("\n");
  maxReps += 100;
  if (maxReps <= 300) {
    setTimeout(() => {
      doRolloutReport(input, button, output, wins, reps, maxReps, STATE, BOARD);
    }, 1);
  } else {
    button.removeAttribute("disabled");
  }
}

function montecarlo7x7(input, options, button, parent, STATE = GoEyes, BOARD = GoBoard2D) {
  window.baduk.start = performance.now();
  let output = parent.querySelector("[output]");
  output.innerText = "";
  let wins = Object.fromEntries([[1, 0], [-1, 0], [0, 0]]);
  setTimeout(() => {
    doRolloutReport(input, button, output, wins, 0, 100, STATE, BOARD);
  }, 1);
}