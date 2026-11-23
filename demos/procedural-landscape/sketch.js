function setup() {
  createCanvas(800, 500);
  background(230, 93, 30);
  noStroke();
  fill(252, 227, 149);
  circle(650, 100, 150);

  drawRidge([201, 58, 10], 150, 125);
  drawRidge([145, 20, 3], 220, 200);
  drawRidge([66, 7, 3], 305, 175);

  describe("Three orange and burgundy mountain ridges sit beneath a pale yellow sun.");
}

function drawRidge(color, height, endHeight) {
  fill(...color);
  beginShape();
  vertex(0, 500);

  for (let x = 0; x < 800; x += 15) {
    vertex(x, Math.floor(Math.random() * 20) + height);
  }

  vertex(800, endHeight);
  vertex(800, 500);
  endShape();
}
