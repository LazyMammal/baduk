/*
    <figure>
      <pre preload-code="board.txt"></pre>
      <figcaption>board.txt</figcaption>
    </figure>
*/
$("[preload-code]")
  .each((i, e) => jQuery.get(e.getAttribute("preload-code"),
    (data) => { e.innerText = data }
  ));

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
