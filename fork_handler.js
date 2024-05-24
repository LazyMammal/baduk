Array.from(document.querySelectorAll("button[fork]"))
  .forEach((elem) => {
    elem.addEventListener("click", async () => {
      window[elem.getAttribute("fork")](elem); // "fork_run", "fork_time"
    })
  });

async function fork_run(elem) {
  const fork = await setupFork(elem);
  elem.setAttribute("disabled", true);

  const worker = new Worker(fork.run);
  worker.postMessage(fork.options);

  worker.onmessage = (event) => {
    worker.terminate();
    let result = event.data;
    updateTextbox(fork.output, result)
    if (fork.goban) updateGoban(fork.goban, fork.parent);
    elem.removeAttribute("disabled");
  };

  worker.postMessage(fork.options.board);
}

async function fork_time(elem) {
  const fork = await setupFork(elem);

  fork.mark.classList.add("loading");
  fork.mark.innerText = "...";
  fork.mark.removeAttribute("hidden");
  elem.setAttribute("disabled", true);

  const worker = new Worker(fork.run);
  worker.postMessage(fork.options);

  let samples = 0;
  const t0 = performance.now();
  worker.onmessage = () => {
    const seconds = (performance.now() - t0) / 1e3;
    if (++samples < 20 || seconds < 3.0) {
      worker.postMessage(fork.options.board);
    } else {
      worker.terminate();
      const ops = samples / seconds;
      const result = `${ops.toFixed(0)} ops/sec`;
      fork.mark.innerText = result;
      fork.mark.classList.remove("loading");
      elem.removeAttribute("disabled");
    }
  };

  worker.postMessage(fork.options.board);
}

async function setupFork(elem) {
  const parent = findParent(elem);
  const data = await getData(parent);
  const options = workerOptions(parent);
  return {
    parent: parent,
    options: Object.assign(options, { board: data }),
    run: parent.getAttribute("run"),
    goban: parent.querySelector(".goban")?.getAttribute("id"),
    output: parent.querySelector("[output]"),
    mark: parent.querySelector("mark"),
  };
}

function workerOptions(parent) {
  let options = {};
  Array.from(parent.querySelectorAll("[options] input")).forEach(elem => {
    options[elem.name] ??= [];
    options[elem.name].push(elem.value);
  })
  return options;
}

async function getData(parent) {
  let url = parent.getAttribute("data-url");
  let dataId = parent.getAttribute("data-id");
  let data = "";
  if (dataId) {
    const elem = document.getElementById(dataId);
    data = elem?.value ?? elem?.innerText;
  }
  else if (url) data = await cacheFetch(url);
  return data;
}

async function resetButton(elem) {
  const parent = findParent(elem);
  const goban = parent.querySelector(".goban")?.getAttribute("id");
  const dataId = parent.getAttribute("data-id");
  const input = document.getElementById(dataId);
  if (goban && input) {
    updateTextbox(input, "");
    if (input.hasAttribute("preload-txt"))
      await preloadTxt(input);
    updateGoban(goban, parent);
  }
}

Array.from(document.querySelectorAll("button[reset]"))
  .forEach((elem) => {
    elem.addEventListener("click", async () => resetButton(elem));
  });

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

window.baduk.fork_mcts_worker = null;

async function fork_mcts_worker(elem) {
  const fork = await setupFork(elem);
  if (window.baduk.fork_mcts_worker) {
    window.baduk.fork_mcts_worker.terminate();
  }
  const worker = new Worker(fork.run);
  window.baduk.fork_mcts_worker = worker;

  fork.options.cmd = "worker";
  worker.postMessage(fork.options);
}

async function fork_mcts_config(elem) {
  const fork = await setupFork(elem);

  if (!window.baduk.fork_mcts_worker) {
    await fork_mcts_worker(elem);
    await sleep(100);
  }
  const worker = window.baduk.fork_mcts_worker;

  fork.options.cmd = "config";
  worker.postMessage(fork.options);
}

async function fork_mcts_run(elem) {
  const fork = await setupFork(elem);

  if (!window.baduk.fork_mcts_worker) {
    await fork_mcts_worker(elem);
    await sleep(100);
  }
  const worker = window.baduk.fork_mcts_worker;

  elem.setAttribute("disabled", true);
  worker.onmessage = (event) => {
    let result = event.data;
    updateTextbox(fork.output, result)
    elem.removeAttribute("disabled");
  };

  fork.options.cmd = "mcts";
  worker.postMessage(fork.options);
}
