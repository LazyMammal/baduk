self.onmessage = (event) => {
  if (Object.hasOwn(event.data, "worker")) {
    importScripts(...event.data.worker); // first run
  } else {
    const board = parseBoard2D(event.data.trim());
    const libCount = buildLibs(board);
    self.postMessage(printNested(libCount));
  }
};
