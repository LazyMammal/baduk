self.onmessage = (event) => {
  if (Object.hasOwn(event.data, "worker")) {
    importScripts(...event.data.worker); // first run
  } else {
    self.postMessage(
      moveTests(event.data.trim())
    );
  }
};