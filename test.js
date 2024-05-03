var gobo7x7 = new Gobo({
  gobanSize: 7,
  noCoords: false,
  widthPx: 320,
  background: "#e0aa52",
  pixelRatio: window.devicePixelRatio,
});

gobo7x7.setStoneAt(2, 2, WHITE);
gobo7x7.setStoneAt(2, 3, BLACK);
gobo7x7.setStoneAt(3, 1, WHITE);
gobo7x7.setStoneAt(3, 3, BLACK);
//gobo.setStoneAt(3, 1, EMPTY); // removes stone

gobo7x7.render();
document.querySelector("#rollout7x7").append(gobo7x7.canvas);
