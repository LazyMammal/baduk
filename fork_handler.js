Array.from(document.querySelectorAll("button[fork]"))
  .forEach((elem) => {
    elem.addEventListener("click", async () => {
      window[elem.getAttribute("fork")](elem); // "fork_run", "fork_time"
    })
  });

async function fork_run(elem) {
  const fork = await setupFork(elem);
  const callback = (result) => {
    if(fork.output.tagName === "TEXTAREA") {
      fork.output.value = result;
    } else {
      fork.output.innerText = "";
      fork.output.insertAdjacentHTML("afterbegin", result);
    }
    if (fork.goban) updateGoban(fork.goban, fork.parent);
    elem.removeAttribute("disabled");
  }
  elem.setAttribute("disabled", true);

  const worker = new Worker(fork.run);
  worker.postMessage(fork.options);

  worker.onmessage = (event) => {
    worker.terminate();
    let result = event.data;
    callback(result);
  };
  worker.postMessage(fork.data);
}

async function fork_time(elem) {
  const fork = await setupFork(elem);
  const callback = (result) => {
    fork.mark.innerText = result;
    fork.mark.classList.remove("loading");
    elem.removeAttribute("disabled");
  }
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
      worker.postMessage(fork.data);
    } else {
      worker.terminate();
      const ops = samples / seconds;
      const result = `${ops.toFixed(0)} ops/sec`;
      callback(result);
    }
  };
  worker.postMessage(fork.data);
}

async function setupFork(elem) {
  const parent = findParent(elem);
  return {
    parent: parent,
    data: await getData(parent),
    run: parent.getAttribute("run"),
    options: workerOptions(parent),
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
  const output = parent.querySelector("[output]");
  const goban = parent.querySelector(".goban")?.getAttribute("id");
  updateTextbox(output, "");
  if (output.hasAttribute("preload-txt"))
    await preloadTxt(output);
  if (goban)
    updateGoban(goban, parent);
}

Array.from(document.querySelectorAll("button[reset]"))
  .forEach((elem) => {
    elem.addEventListener("click", async () => resetButton(elem));
  });
