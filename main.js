window.baduk = { data: {}, bench: {} };

const preload_txt = "preload-txt";
$(`[${preload_txt}]`)
  .each((i, e) => {
    let filename = e.getAttribute(preload_txt);
    jQuery.get(filename, (data) => {
      window.baduk.data[filename] = e.innerText = data;
    })
  });

const preload_js = "preload-javascript";
$(`[${preload_js}]`)
  .each((i, e) => {
    let filename = e.getAttribute(preload_js);
    jQuery.get(filename, (data) => {
      window.baduk.data[filename] = data;
      e.insertAdjacentHTML("afterbegin",
        hljs.highlight(data, { language: 'javascript' }).value
      );
    })
  });

/*
  <script src="board5x5.js" defer></script>
  <figure data="board5x5.txt" run="board5x5">
    <button run>Run</button> <button time>Time</button> <mark hidden></mark>
    <pre><code output></code></pre>
    <figcaption><code>output</code></figcaption>
  </figure>
*/
$("button[run]").on("click", function () {
  let parent = $(this).parent();
  let run = parent.attr("run");
  let output = parent.find("[output]");
  let data = window.baduk.data[parent.attr("data")];
  output.text(window[run](data));
});
$("button[time]").on("click", function () {
  let parent = $(this).parent();
  let run = parent.attr("run");
  let data = window.baduk.data[parent.attr("data")];
  let result = parent.find("mark");
  result.toggleClass("loading");
  result.text("...");
  result.prop("hidden", false);
  $(this).prop("disabled", true);
  let bench = new Benchmark(() => {
    window[run](data)
  }, {
    'onComplete': (evt) => {
      result.text(`${evt.currentTarget}`);
      result.toggleClass("loading");
      $(this).prop("disabled", false);
      console.log(`${evt.currentTarget}`);
    },
  }).run({ 'async': true });
});
