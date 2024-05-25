self.onmessage = (event) => {
  if (Object.hasOwn(event.data, "worker")) {
    importScripts(...event.data.worker);
    self.forkFunc = event.data.fork;
  } else {
    self.postMessage(
      self[self.forkFunc](event.data.trim())
    );
  }
};
