var gobo = new Gobo({
  gobanSize: 7,
  noCoords: false,
  widthPx: 320,
  background: "#e0aa52",
  pixelRatio: window.devicePixelRatio,
});

gobo.setStoneAt(2, 2, WHITE);
gobo.setStoneAt(2, 3, BLACK);
gobo.setStoneAt(3, 1, WHITE);
gobo.setStoneAt(3, 3, BLACK);
//gobo.setStoneAt(3, 1, EMPTY); // removes stone

gobo.render();
document.querySelector("#section1_gobo").append(gobo.canvas);
