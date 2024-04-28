const preload_txt = "preload-txt";
$(`[${preload_txt}]`)
  .each((i, e) => jQuery.get(e.getAttribute(preload_txt),
    (data) => { e.innerText = data }
  ));

const preload_js = "preload-javascript";
$(`[${preload_js}]`)
  .each((i, e) => jQuery.get(e.getAttribute(preload_js),
    (data) => {
      e.insertAdjacentHTML("afterbegin",
        hljs.highlight(data, { language: 'javascript' }).value
      );
    }));

/*
    <div data="board.txt" run="board">
      <button> Run </button>
      <pre output></pre>
    </div>

    onclick: board(get(board.txt), <pre>)
*/
$("[run]").on("click", "button", function () {
  let parent = $(this).parent();
  let output = parent.find("[output]");
  jQuery.get(parent.attr("data"), (data) => {
    output.text(window[parent.attr("run")](data));
  });
})
