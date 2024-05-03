window.baduk = { data: {}, bench: {}, gobo: {} };

var Gobo = window["gobo"].Gobo;
var BLACK = 0, WHITE = 1, EMPTY = -1;

Array.from(document.querySelectorAll(".goban"))
  .forEach((e) => {
    let id = e.getAttribute("id");
    let size = Number(e.getAttribute("size")) ?? 7;

    let gobo = window.baduk.gobo[id] = new Gobo({
      gobanSize: size,
      noCoords: false,
      widthPx: 320,
      background: "#e0aa52",
      pixelRatio: window.devicePixelRatio,
    });
    
    gobo.render();
    e.append(gobo.canvas);
  });

function updateGoban(id, input) {
  const board = parse(input);
  const gobo = window.baduk.gobo[id];
  const lookup = {"B": BLACK, "W": WHITE, ".": EMPTY};

  for (let y = 0; y < board.size; y++) {
    for (let x = 0; x < board.size; x++) {
      const piece = board.get(x, y);
      gobo.clearVertexAt(x, y);
      gobo.setStoneAt(x, y, lookup[piece]);
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

Array.from(document.querySelectorAll("[preload-txt]"))
  .forEach(async (e) => {
    let url = e.getAttribute("data-url");
    let data = await cacheFetch(url);
    if (data !== null) {
      e.innerText = data;
    }
  });

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
async function buttonSetup(e) {
  let parent = e.parentElement;
  while (parent && !parent.hasAttribute("run")) {
    parent = parent.parentElement;
  }
  let run = parent.getAttribute("run");
  let url = parent.getAttribute("data-url");
  let id = parent.getAttribute("data-id");
  let data;
  if (url) data = await cacheFetch(url);
  if (id) data = document.getElementById(id)?.innerText;
  return [parent, run, data];
}

Array.from(document.querySelectorAll("button[run]"))
  .forEach((e) => {
    e.addEventListener("click", async () => {
      let [parent, run, data] = await buttonSetup(e);
      let goban = parent.querySelector(".goban")?.getAttribute("id");
      let output = parent.querySelector("[output]");
      output.innerText = "";
      let text = window[run](data);
      output.insertAdjacentHTML("afterbegin", text);
      if (goban) updateGoban(goban, text);
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
