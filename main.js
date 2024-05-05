window.baduk = { data: {}, bench: {}, gobo: {} };
window.baduk.history = {};

var Gobo = window["gobo"].Gobo;
var BLACK = 0, WHITE = 1, EMPTY = -1;
var lookupPiece = {
  "B": BLACK,
  "W": WHITE,
  ".": EMPTY
};
var lookupStone = Object.fromEntries([
  [BLACK, "B"],
  [WHITE, "W"],
  [EMPTY, "."]
]);

Array.from(document.querySelectorAll(".goban"))
  .forEach((elem) => {
    let id = elem.getAttribute("id");
    let size = Number(elem.getAttribute("size")) ?? 7;
    let gobo = createGoban(id, size);
    elem.append(gobo.canvas);
    if (elem.classList.contains("clickable")) {
      elem.addEventListener("click",
        (event) => clickGoban(event, elem, id, size, gobo)
      );
    }
  });

function createGoban(id, size) {
  let gobo = window.baduk.gobo[id] = new Gobo({
    gobanSize: size,
    noCoords: false,
    widthPx: 320,
    background: "#e0aa52",
    /* pixelRatio: window.devicePixelRatio, */
  });
  gobo.render();
  return gobo;
}

function mouse2coord(event, gobo) {
  let bounds = gobo.canvas.getBoundingClientRect();
  let mx = event.clientX - bounds.left;
  let my = event.clientY - bounds.top;
  return gobo.pixelToGridCoordinates(mx, my);
}

function clickGoban(event, elem, id, size, gobo) {
  let [x, y] = mouse2coord(event, gobo);
  if (x >= 0 && x < size && y >= 0 && y < size) {
    let stone = gobo.getStoneColorAt(x, y);
    gobo.setStoneAt(x, y, stone > 0 ? -1 : stone + 1);
    gobo.render();
    const update = elem.getAttribute("update");
    if (update) {
      window[update](event, elem, id, size, gobo);
    }
  }
}

function copy2input(event, elem, id, size, gobo) {
  let parent = findParent(elem);
  let input_id = parent.getAttribute("data-id");
  if (input_id) {
    const board = new Board2D(size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const stone = gobo.getStoneColorAt(x, y);
        const piece = lookupStone[stone];
        board.set(x, y, piece);
      }
    }
    document.getElementById(input_id).innerText = printBoard(board, { addLabels: false });
  }
}

function updateGoban(id, input) {
  const board = input ? window?.parse(input) : null;
  const gobo = window.baduk.gobo[id];
  const size = document.getElementById(id).getAttribute("size");
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const piece = board ? board.get(x, y) : ".";
      gobo.clearVertexAt(x, y);
      if (piece in lookupPiece)
        gobo.setStoneAt(x, y, lookupPiece[piece]);
      else if (piece !== ".")
        gobo.setMarkAt(x, y, `${piece}:6,6`);
    }
  }
  gobo.render();
}

async function cacheFetch(url) {
  if (url in window.baduk.data) {
    return window.baduk.data[url];
  } else {
    try {
      const response = await fetch(url);
      const data = await response.text();
      window.baduk.data[url] = data;
      return data;
    } catch (error) {
      console.error(`Download error: ${url} - ${error.message}`);
    }
  }
  return null;
}

async function preloadTxt(e) {
  let url = e.getAttribute("data-url");
  let data = await cacheFetch(url);
  if (data !== null) {
    e.innerText = data;
  }
}

Array.from(document.querySelectorAll("[preload-txt]")).forEach(preloadTxt);

Array.from(document.querySelectorAll("[preload-javascript]"))
  .forEach(async (e) => {
    let url = e.getAttribute("data-url");
    let data = await cacheFetch(url);
    if (data !== null) {
      e.insertAdjacentHTML("afterbegin",
        hljs.highlight(data, { language: "javascript" }).value
      );
    }
  });
/*
  <script src="board7x7.js" defer></script>
  <div data="board7x7.txt" run="board7x7">
    <button run>Run</button> <button time>Time</button> <mark hidden></mark>
    <pre><summary>output</summary><code output></code></pre>
  </div>
*/
function findParent(e) {
  let parent = e.parentElement;
  while (parent && !parent.hasAttribute("run")) {
    parent = parent.parentElement;
  }
  return parent;
}

async function buttonSetup(e) {
  let parent = findParent(e);
  let run = parent.getAttribute("run");
  let url = parent.getAttribute("data-url");
  let id = parent.getAttribute("data-id");
  let data = "";
  if (url) data = await cacheFetch(url);
  if (id) data = document.getElementById(id)?.innerText;
  return [parent, run, data];
}

async function runButton(e) {
  let [parent, run, data] = await buttonSetup(e);
  let goban = parent.querySelector(".goban")?.getAttribute("id");
  let output = parent.querySelector("[output]");
  let text = window[run](data);
  output.innerText = "";
  output.insertAdjacentHTML("afterbegin", text);
  if (goban) updateGoban(goban, text);
}

async function startButton(elem) {
  let [parent, run, data] = await buttonSetup(elem);
  elem.setAttribute("disabled", true);
  setTimeout(
    () => { window[run](data, elem, parent) },
    100
  );
}

Array.from(document.querySelectorAll("button[run]"))
  .forEach((e) => {
    e.addEventListener("click", async () => runButton(e));
  });

Array.from(document.querySelectorAll("button[start]"))
  .forEach((elem) => {
    elem.addEventListener("click", async () => startButton(elem));
  });

Array.from(document.querySelectorAll("button[reset]"))
  .forEach((e) => {
    e.addEventListener("click", async () => {
      let parent = findParent(e);
      let output = parent.querySelector("[output]");
      output.innerText = "";
      if (output.hasAttribute("preload-txt")) await preloadTxt(output);
      await buttonSetup(e);
      let goban = parent.querySelector(".goban")?.getAttribute("id");
      if (goban) updateGoban(goban, output?.innerText);
    });
  });

Array.from(document.querySelectorAll("button[time]"))
  .forEach((e) => {
    e.addEventListener("click", async () => {
      let [parent, run, data] = await buttonSetup(e);
      let result = parent.querySelector("mark");
      result.classList.add("loading");
      result.innerText = "...";
      result.removeAttribute("hidden");
      e.setAttribute("disabled", true);
      new Benchmark(() => {
        window[run](data)
      }, {
        "onComplete": (evt) => {
          result.innerText = `${evt.currentTarget}`;
          result.classList.remove("loading");
          e.removeAttribute("disabled");
        },
      }).run({ "async": true });
    });
  });
