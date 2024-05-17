const worker = new Worker("worker/worker.js");

worker.onmessage = (event) => {
  let [gobanId, result] = event.data;
  console.log(result);
};

// worker.postMessage([gobanId, args]);
