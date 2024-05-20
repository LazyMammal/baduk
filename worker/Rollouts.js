self.onmessage = (event) => {
  if (Object.hasOwn(event.data, "worker")) {
    importScripts(...event.data.worker); // first run
  } else {
    self.postMessage(
      unitTests(event.data.trim())
    );
  }
};

function move_tests_valid7x7(input, options) {
  return move_tests(input, options, GoValid, GoBoard2D);
}

function rolloutReport_valid7x7(input, options, button, parent) {
  montecarlo7x7(input, options, button, parent, GoValid, GoBoard2D);
}

function valid7x7(input, options) {
  return kohack7x7(input, options, GoValid, GoBoard2D);
}
