const sprites = new Set();
const art = new Map();

function preload() {
  for (const file of [
    'Slime-O-Matic 3000.png', 'redSlime.svg', 'blueSlime.svg',
    'greenSlime.svg', 'slimesEyes.svg', 'Vial.svg', 'Flask.svg', 'Florence Flask.svg',
  ]) {
    const path = 'assets/' + file;
    art.set(path, loadImage(path));
  }
}

// The original sketch used p5play sprites. These routines keep its draw order,
// easing and single falling pet independent of an external physics CDN.
class Sprite {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.w = 50;
    this.h = 50;
    this.color = 'white';
    this.vel = { x: 0, y: 0 };
    this.layer = 0;
    this.collider = 'none';
    this.size = { x: 1, y: 1 };
    sprites.add(this);
  }

  set scale(value) { this.size = { x: value, y: value }; }
  get scale() { return this.size; }

  set image(path) {
    this.picture = art.get(path);
    this.w = this.picture.width;
    this.h = this.picture.height;
  }

  moveTowards(point, amount) {
    this.x = lerp(this.x, point.x, amount);
    this.y = lerp(this.y, point.y, amount);
  }

  remove() { sprites.delete(this); }

  fall(floor) {
    this.vel.y += 0.35;
    this.x += this.vel.x;
    this.y += this.vel.y;
    if (floor) {
      const restingHeight = floor.y - floor.h / 2 - this.h * this.size.y / 2;
      if (this.y >= restingHeight) {
        this.y = restingHeight;
        this.vel.y = 0;
      }
    }
  }

  draw() {
    push();
    translate(this.x, this.y);
    scale(this.size.x, this.size.y);
    if (this.picture) {
      imageMode(CENTER);
      image(this.picture, 0, 0);
    } else {
      rectMode(CENTER);
      noStroke();
      fill(this.color);
      rect(0, 0, this.w, this.h);
    }
    if (this.text) {
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(15);
      fill(this.textColor || (this.labelOffset ? 'white' : '#141414'));
      text(this.text, 0, this.labelOffset || 0);
    }
    pop();
  }
}

function drawSlimeSprites() {
  const ordered = [...sprites].sort((first, second) => first.layer - second.layer);
  for (const sprite of ordered) {
    if (sprite.collider === 'dynamic') sprite.fall(screenManager.currentScreen.table);
    sprite.draw();
  }
}
