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

function parseNested(input, flip = true) {
  let array = input.split("\n");
  let board = array.map(r => r.split(" "));
  let size = board[0].length;
  board = board.slice(0, size);
  if (flip) board.reverse();
  return board;
}

function createNested(size, fill) {
  return Array(size).fill(0)
    .map(() => Array(size).fill(fill));
}

function printNested(nested, flip = true) {
  let array = nested.map(row => row.join(" "));
  if (flip) array.reverse();
  return array.join("\n").trim();
}

function printPadded(nested, flip = true, pad = 1) {
  let array = nested.map(row => row
    .map(col => `${col}`.padStart(pad, " "))
    .join(" "));
  if (flip) array.reverse();
  return array.join("\n");
}

function findParent(elem) {
  let parent = elem.parentElement;
  while (parent && !parent.hasAttribute("run")) {
    parent = parent.parentElement;
  }
  return parent;
}

Array.from(document.querySelectorAll(".goban"))
  .forEach((elem) => {
    let id = elem.getAttribute("id");
    let size = Number(elem.getAttribute("size")) ?? 7;
    let gobo = createGoban(id, size);
    elem.append(gobo.canvas);
    const update = elem.getAttribute("update");
    if (elem.classList.contains("clickable")) {
      if (update) {
        elem.addEventListener("click",
          (event) => {
            clickGoban(event, elem, id, size, gobo);
            window[update](event, elem, id, size, gobo);
          }
        );
        let parent = findParent(elem);
        let dataId = parent.getAttribute("data-id");
        let input = document.getElementById(dataId);
        if (input.tagName === "TEXTAREA") {
          input.addEventListener("change",
            (event) => {
              updateGoban(id, parent);
            }
          );
        }
      } else {
        elem.addEventListener("click",
          (event) => clickGoban(event, elem, id, size, gobo)
        );
      }
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
  }
}

function updateTextbox(elem, text) {
  if (elem.tagName === "TEXTAREA") {
    elem.value = text;
  } else {
    elem.innerText = "";
    elem.insertAdjacentHTML("afterbegin", text);
  }
}

function copy2input(event, elem, id, size, gobo) {
  let parent = findParent(elem);
  let input_id = parent.getAttribute("data-id");
  if (input_id) {
    const board = createNested(size, ".");
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const stone = gobo.getStoneColorAt(x, y);
        const piece = lookupStone[stone];
        board[y][x] = piece;
      }
    }
    let text = printNested(board);
    let input = document.getElementById(input_id);
    updateTextbox(input, text);
  }
}

function updateGoban(id, parent) {
  const dataId = parent.getAttribute("data-id");
  const input = document.getElementById(dataId);
  const text = input?.innerText || input?.value;
  const board = text ? parseNested(text) : null;
  const gobo = window.baduk.gobo[id];
  const size = document.getElementById(id).getAttribute("size");
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const piece = board ? board[y][x] : ".";
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

async function preloadTxt(elem) {
  let url = elem.getAttribute("data-url");
  let data = await cacheFetch(url);
  if (data !== null) {
    elem.innerText = data;
  }
}

Array.from(document.querySelectorAll("[preload-txt]")).forEach(preloadTxt);

Array.from(document.querySelectorAll("[preload-javascript]"))
  .forEach(async (elem) => {
    let url = elem.getAttribute("data-url");
    let data = await cacheFetch(url);
    if (data !== null) {
      elem.insertAdjacentHTML("afterbegin",
        hljs.highlight(data, { language: "javascript" }).value
      );
    }
  });

Array.from(document.querySelectorAll("button[copy]"))
  .forEach((elem) => {
    elem.addEventListener("click", async () => {
      let input = elem.parentElement.querySelector("textarea");
      await navigator.clipboard.writeText(input.value);
    });
  });