function fork_run(input, run, callback, options) {
  const worker = new Worker(run);
  worker.postMessage(options);
  worker.onmessage = (event) => {
    worker.terminate();
    let result = event.data;
    callback(result);
  };
  worker.postMessage(input);
}

function fork_time(input, run, callback, options) {
  const worker = new Worker(run);
  worker.postMessage(options);
  let samples = 0;
  let t0 = performance.now();
  worker.onmessage = () => {
    const seconds = (performance.now() - t0) / 1e3;
    samples++;
    if (samples >= 5 && seconds >= 1.0) {
      worker.terminate();
      const ops = samples / seconds;
      const result = `${ops.toFixed(0)} ops/sec`;
      callback(result);
    } else {
      worker.postMessage(input);
    }
  };
  worker.postMessage(input);
}
