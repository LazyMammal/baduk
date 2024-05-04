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
  const text = [
    `Rollouts: ${reps}`,
    `   Black: ${wins[1]}`,
    `   White: ${wins[-1]}`,
    `   Ties:  ${wins[0]}`,
    ""
  ];
  output.innerText += text.join("\n");
  maxReps *= 5;
  if (maxReps <= 160) {
    setTimeout(() => {
      doRollouts(input, button, output, wins, reps, maxReps);
    }, 1);
  } else {
    button.removeAttribute("disabled");
  }
}

function montecarlo7x7(input, button, parent) {
  let output = parent.querySelector("[output]");
  output.innerText = "";
  let wins = Object.fromEntries([[1, 0], [-1, 0], [0, 0]]);
  setTimeout(() => {
    doRollouts(input, button, output, wins, 0, 5);
  }, 1);
}