// preload code blocks that request a code url
const preTags = document.querySelectorAll(':is(code,pre)[preload-code]');
for (const pre of preTags) {
  fetch(new Request(pre.getAttribute("preload-code")))
    .then((response) => response.text())
    .then((text) => {
      pre.innerText = text;
    });
}
