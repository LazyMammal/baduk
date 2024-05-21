self.onmessage = (event) => {
  switch (event.data.cmd) {
    case "worker":
      importScripts(...event.data.worker);
    case "config":
      configureMCTS(event.data);
      break;
    case "mcts":
      self.postMessage(mcts());
      break;
    default:
      console.log(`ERROR: MCTS.js unknown cmd: ${event.data.cmd}`);
      break;
  }
};

function configureMCTS(options) {
  const board = parseBoard2D(options.board);
  const toPlay = options?.toPlay === "W" ? "W" : "B";
  self.state = new GoState(board, GO_CODES[toPlay]);
  self.state.turn = options?.turn ?? 0;
  self.runtime = Number(options.time ?? 1.0);
  self.EX = Number(options.explore ?? 2.0);
  self.root = new UCTNode([-1, -1]); // pass
}