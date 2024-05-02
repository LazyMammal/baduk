var Gobo = window['gobo'].Gobo;
var BLACK = 0, WHITE = 1, EMPTY = -1;

window.baduk = { data: {}, bench: {} };

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
    let url = e.getAttribute("preload-txt");
    let data = await cacheFetch(url);
    if(data !== null) {
      e.innerText = data;
    }
  });

Array.from(document.querySelectorAll("[preload-javascript]"))
  .forEach(async (e) => {
    let url = e.getAttribute("preload-javascript");
    let data = await cacheFetch(url);
    if(data !== null) {
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
Array.from(document.querySelectorAll("button[run]"))
  .forEach((e) => {
    e.addEventListener("click", () => {
      let parent = e.parentElement;
      let run = parent.getAttribute("run");
      let output = parent.querySelector("[output]");
      let url = parent.getAttribute("data");
      let data = window.baduk.data[url];
      let text = window[run](data);
      output.insertAdjacentHTML("afterbegin", text);
    });
  });

Array.from(document.querySelectorAll("button[time]"))
  .forEach((e) => {
    e.addEventListener("click", () => {
      let parent = e.parentElement;
      let run = parent.getAttribute("run");
      let data = window.baduk.data[parent.getAttribute("data")];
      let result = parent.querySelector(":scope > mark");
      console.log(result);
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
          e.setAttribute("disabled", false);
        },
      }).run({ "async": true });
    });
  });
