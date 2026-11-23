let screenManager;

class ScreenManager {
  constructor() {
    this.currentScreen;
    this.pressedColorButton = 'green';
    this.slimeSize = 100;
    this.nameField = '';
    this.happinessBarX = 100;
    this.slimeBarX = 100;
  }

  setup() {
    this.ww = windowWidth;
    this.wh = windowHeight;
    createCanvas(this.ww, this.wh);
    this.switchToScreen(new SlimeOMaticScreen(this));
  }

  switchToScreen(screen) {
    if (this.currentScreen) {
      this.currentScreen.remove();
    }
    this.currentScreen = screen;
    this.currentScreen.setup();
  }

  draw() {
    background(20);
    if (this.currentScreen) {
      this.currentScreen.draw();
      drawSlimeSprites();
    }
  }
}

class SlimeOMaticScreen {
  constructor(manager) {
    this.manager = manager;
  }

  setup() {
    this.som = new Sprite();
    this.som.image = "assets/Slime-O-Matic 3000.png";
    this.som.scale = 0.5;
    this.som.collider = 'none';

    this.sizeSlider = createSlider(70, 130);
    this.sizeSlider.attribute('aria-label', 'Slime size');
    this.sizeSlider.position(this.manager.ww / 2 - 55, this.manager.wh / 2 - 130);
    this.sizeSlider.size(187);

    this.somColorButtons = [];
    this.somColorButtonLEDs = [];
    const colors = ['red', 'blue', 'green'];
    for (let i = 0; i < colors.length; i++) {
      const button = createButton('');
      button.addClass('art-control');
      button.attribute('aria-label', colors[i] + ' slime');
      button.attribute('aria-pressed', String(colors[i] === this.manager.pressedColorButton));
      button.position(this.manager.ww / 2 - 78 + i * 89, this.manager.wh / 2 - 50);
      button.size(65, 100);
      button.elt.addEventListener('click', () => this.selectColor(colors[i], i));
      this.somColorButtons.push(button);

      let led = new Sprite();
      led.x = this.manager.ww / 2 - 45 + i * 89;
      led.y = this.manager.wh / 2 + 70;
      led.w = 50;
      led.h = 10;
      led.color = colors[i] === this.manager.pressedColorButton ? 'lightgreen' : 'grey';
      led.collider = 'none';
      this.somColorButtonLEDs.push(led);
    }

    this.nameField = createInput('');
    this.nameField.attribute('aria-label', 'Slime name');
    this.nameField.attribute('maxlength', '24');
    this.nameField.style('font-size', '19px');
    this.nameField.position(this.manager.ww / 2 - 78, this.manager.wh / 2 + 90);

    this.somCreateButton = createButton('');
    this.somCreateButton.addClass('art-control');
    this.somCreateButton.attribute('aria-label', 'Create slime');
    this.somCreateButton.position(this.manager.ww / 2 - 154, this.manager.wh / 2 + 151);
    this.somCreateButton.size(308, 64);
    this.somCreateButton.elt.addEventListener('click', () => {
      this.manager.slimeSize = this.sizeSlider.value();
      this.manager.nameField = this.nameField.value().trim() || 'Slime';
      this.manager.switchToScreen(new SlimeScreen(this.manager));
    });
  }

  draw() {}

  selectColor(colorName, selectedIndex) {
    this.manager.pressedColorButton = colorName;
    this.somColorButtons.forEach((button, index) => button.attribute('aria-pressed', String(index === selectedIndex)));
    this.somColorButtonLEDs.forEach((led, index) => led.color = index === selectedIndex ? 'lightgreen' : 'grey');
  }

  remove() {
    this.som.remove();
    this.somColorButtons.forEach(button => button.remove());
    this.somColorButtonLEDs.forEach(led => led.remove());
    this.somCreateButton.remove();
    this.sizeSlider.remove();
    this.nameField.remove();
  }
}

class SlimeScreen {
  constructor(manager) {
    this.manager = manager;
    this.slimeVelX = -3
    this.eyeOffset = { x: 0, y: 0 };
  }

  setup() {
    let sizeMultiplier = this.manager.slimeSize / 100;

    this.slime = new Sprite();
    this.slime.y = -this.manager.wh / 2;

    if (this.manager.pressedColorButton == 'red') {
      this.slime.image = "assets/redSlime.svg";
    } else if (this.manager.pressedColorButton == 'blue') {
      this.slime.image = "assets/blueSlime.svg";
    } else if (this.manager.pressedColorButton == 'green') {
      this.slime.image = "assets/greenSlime.svg";
    }
    else {
      this.slime.image = "assets/greenSlime.svg";
    }

    this.slime.collider = 'dynamic';
    this.slime.scale = 0.25 * sizeMultiplier;
    this.slime.layer = 2;
    this.slime.vel.y = 5;

    this.slimesEyes = new Sprite();
    this.slimesEyes.image = "assets/slimesEyes.svg";
    this.slimesEyes.scale = 0.25 * sizeMultiplier;
    this.eyeHeight = this.slimesEyes.scale.y;
    this.slimesEyes.x = this.slime.x;
    this.slimesEyes.y = this.slime.y;
    this.slimesEyes.collider = 'none';
    this.slimesEyes.layer = 2;
    this.isBlinking = false;

    this.nameTag = new Sprite();
    this.nameTag.w = 50;
    this.nameTag.h = 10;
    this.nameTag.color = color(20);
    this.nameTag.stroke = color(20);
    this.nameTag.collider = 'none';
    this.nameTag.layer = 3;
    this.nameTag.text = this.manager.nameField;
    this.nameTag.textColor = 'white';


    this.table = new Sprite();
    this.table.x = this.manager.ww / 2;
    this.table.y = this.manager.wh;
    this.table.w = this.manager.ww + 500;
    this.table.h = this.manager.wh / 3;
    this.table.color = 'grey';
    this.table.collider = 'static';
    this.table.layer = 1;

    this.happinessBar = new Sprite();
    this.happinessBar.x = this.manager.happinessBarX;
    this.happinessBar.y = 15;
    this.happinessBar.w = 400;
    this.happinessBar.h = 20;
    this.happinessBar.color = 'yellow';
    this.happinessBar.collider = 'none';
    this.happinessBar.layer = 2;
    this.happinessBar.text = "Happiness";
   

    this.slimeBar = new Sprite();
    this.slimeBar.x = this.manager.slimeBarX;
    this.slimeBar.y = 40;
    this.slimeBar.w = 400;
    this.slimeBar.h = 20;
    if (this.manager.pressedColorButton == 'red') {
      this.slimeBar.color = 'red';
    } else if (this.manager.pressedColorButton == 'blue') {
      this.slimeBar.color = 'blue';
    }
    else if (this.manager.pressedColorButton == 'green') {
      this.slimeBar.color = 'green';
    }
    else {
      this.slimeBar.color = 'green';
    }
    this.slimeBar.collider = 'none';
    this.slimeBar.layer = 2;
    this.slimeBar.text = "Hunger";
    this.slimeBar.textColor = 'white';

    this.food = createButton("Food");
    this.food.position(12, 65);
    this.food.elt.addEventListener('click', () => this.manager.switchToScreen(new FoodMiniGame(this.manager)));

    this.removeHappiness = createButton("Lower happiness");
    this.removeHappiness.position(12, 105);
    this.removeHappiness.elt.addEventListener('click', () => this.happinessBar.x = max(-100, this.happinessBar.x - random(10, 50)));

    this.removeSlime = createButton("Make hungry");
    this.removeSlime.position(12, 145);
    this.removeSlime.elt.addEventListener('click', () => this.slimeBar.x = max(-100, this.slimeBar.x - random(10, 50)));

  }

  draw() {

    this.nameTag.x = this.slime.x;
    this.nameTag.y = this.slime.y - 100;
  
    if (this.isBlinking) {
      this.slimesEyes.scale.y = 0.05;
    } else {
      this.slimesEyes.scale.y = this.eyeHeight;
    }

    if (frameCount % 180 === 0) {
      this.isBlinking = true;
      this.blinkTimer = frameCount;
    }
    if (this.isBlinking && frameCount - this.blinkTimer > 5) {
      this.isBlinking = false;
    }

    const targetX = constrain(mouseX - this.slime.x, -16, 16);
    const targetY = constrain(mouseY - this.slime.y, -8, 8);
    this.eyeOffset.x = lerp(this.eyeOffset.x, targetX, 0.15);
    this.eyeOffset.y = lerp(this.eyeOffset.y, targetY, 0.15);
    this.slimesEyes.x = this.slime.x + this.eyeOffset.x;
    this.slimesEyes.y = this.slime.y + this.eyeOffset.y;


    this.manager.slimeBarX = this.slimeBar.x;
    this.manager.happinessBarX = this.happinessBar.x;
    if (this.slime.x < 100 || this.manager.ww - 100 < this.slime.x) {
      this.slime.vel.x = -this.slime.vel.x;
      this.slimeVelX = this.slime.vel.x;
    }
    
  }

  remove() {
    this.slime.remove();
    this.slimesEyes.remove();
    this.table.remove();
    this.happinessBar.remove();
    this.slimeBar.remove();
    this.removeHappiness.remove();
    this.removeSlime.remove();
    this.food.remove();
    this.nameTag.remove();
  }

  play() {
    if (this.happinessBar.x < 100 && random(100) > 40) {
      this.happinessBar.x = min(100, this.happinessBar.x + random(10, 50));
    }
    if (this.slimeBar.x <= 100 && random(100) > 40) {
      this.slimeBar.x = max(-100, this.slimeBar.x - random(10, 50));
    }
    this.slime.vel.x = this.slimeVelX;
    this.slime.vel.y = -5;
  }
}
class FoodMiniGame {
  constructor(manager) {
    this.manager = manager
  }

  setup() {
    this.slime = new Sprite();
    this.slime.collider = 'none';

    this.happinessBar = new Sprite();
    this.happinessBar.x = 100;
    this.happinessBar.y = 15;
    this.happinessBar.w = 400;
    this.happinessBar.h = 20;
    this.happinessBar.color = 'yellow';
    this.happinessBar.collider = 'none';
    this.happinessBar.layer = 2;
    this.happinessBar.text = "Happiness";

    this.slimeBar = new Sprite();
    this.slimeBar.x = 100;
    this.slimeBar.y = 40;
    this.slimeBar.w = 400;
    this.slimeBar.h = 20;
    if (this.manager.pressedColorButton == 'red') {
      this.slimeBar.color = 'red';
    } else if (this.manager.pressedColorButton == 'blue') {
      this.slimeBar.color = 'blue';
    }
    else if (this.manager.pressedColorButton == 'green') {
      this.slimeBar.color = 'green';
    }
    else {
      this.slimeBar.color = 'green';
    }
    this.slimeBar.collider = 'none';
    this.slimeBar.layer = 2;
    this.slimeBar.text = "Hunger";
    this.slimeBar.textColor = 'white';

    if (this.manager.pressedColorButton == 'red') {
      this.slime.image = "assets/redSlime.svg";
    } else if (this.manager.pressedColorButton == 'blue') {
      this.slime.image = "assets/blueSlime.svg";
    } else if (this.manager.pressedColorButton == 'green') {
      this.slime.image = "assets/greenSlime.svg";
    }
    else {
      this.slime.image = "assets/greenSlime.svg";
    }
    
    this.slime.y = this.manager.wh;
    this.slime.x = 100;
    this.slime.layer = 2;

    this.slimesEyes = new Sprite();
    this.slimesEyes.image = "assets/slimesEyes.svg";
    this.slimesEyes.scale = 0.75;
    this.slimesEyes.x = this.slime.x;
    this.slimesEyes.y = this.slime.y;
    this.slimesEyes.collider = 'none';
    this.slimesEyes.layer = 3;
    this.isBlinking = false;
    
    this.vial = new Sprite();
    this.vial.image = "assets/Vial.svg";
    this.vial.x = this.manager.ww / 2 - 300;
    this.vial.y = this.manager.wh / 2;
    this.vial.scale = 0.55;
    this.vial.collider = 'static';
    this.vial.layer = 2;

    this.vialSlider = createSlider(0, 255);
    this.vialSlider.attribute('aria-label', 'Blue potion concentration');
    this.vialSlider.position(this.manager.ww / 2 - 350, this.manager.wh / 2 - 10);
    this.vialSlider.style('transform', 'rotate(270deg)');
    this.vialSlider.size(255);

    this.flask = new Sprite();
    this.flask.image = "assets/Flask.svg";
    this.flask.x = this.manager.ww / 2;
    this.flask.y = this.manager.wh / 2;
    this.flask.scale = 0.55;
    this.flask.collider = 'static';
    this.flask.layer = 2;

    this.flaskSlider = createSlider(0, 255);
    this.flaskSlider.attribute('aria-label', 'Green potion concentration');
    this.flaskSlider.position(this.manager.ww / 2 + 0, this.manager.wh / 2 - 10);
    this.flaskSlider.style('transform', 'rotate(270deg)');
    this.flaskSlider.style('color', 'green');
    this.flaskSlider.size(255);

    this.floFlask = new Sprite();
    this.floFlask.image = "assets/Florence Flask.svg";
    this.floFlask.x = this.manager.ww / 2 + 300;
    this.floFlask.y = this.manager.wh / 2;
    this.floFlask.scale = 0.55;
    this.floFlask.collider = 'static';
    this.floFlask.layer = 2;

    this.floFlaskSlider = createSlider(0, 255);
    this.floFlaskSlider.attribute('aria-label', 'Red potion concentration');
    this.floFlaskSlider.position(this.manager.ww / 2 + 280, this.manager.wh / 2 - 10);
    this.floFlaskSlider.style('transform', 'rotate(270deg)');
    this.floFlaskSlider.style('color', 'red');
    this.floFlaskSlider.size(255);

    this.desiredMix = new Sprite();
    this.desiredMix.x = this.manager.ww / 2 - 50;
    this.desiredMix.y = this.manager.wh / 2 - 200;
    this.desiredMix.w = 100;
    this.desiredMix.h = 100;
    this.randomR = random(255);
    this.randomG = random(255);
    this.randomB = random(255);
    this.desiredMix.color = color(this.randomR, this.randomG, this.randomB);
    this.desiredMix.collider = 'none';
    this.desiredMix.text = "Desired Mix";
    this.desiredMix.labelOffset = 63;

    this.currentMix = new Sprite();
    this.currentMix.x = this.manager.ww / 2 + 50;
    this.currentMix.y = this.manager.wh / 2 - 200; 
    this.currentMix.w = 100;
    this.currentMix.h = 100;
    this.currentMix.color = color(this.floFlaskSlider.value(), this.flaskSlider.value(), this.vialSlider.value());
    this.currentMix.collider = 'none';
    this.currentMix.text = "Current Mix";
    this.currentMix.labelOffset = 63;
    
    this.checkMixButton = createButton("Check Mix");
    this.checkMixButton.position(this.manager.ww / 2, this.manager.wh / 2 + 200);
    this.checkMixButton.elt.addEventListener('click', () => this.checkMix());
    this.home = createButton("Back to slime");
    this.home.position(12, 65);
    this.home.elt.addEventListener('click', () => this.manager.switchToScreen(new SlimeScreen(this.manager)));
    this.mixStatus = createP('');
    this.mixStatus.addClass('mix-status');
    this.mixStatus.attribute('role', 'status');
    this.mixStatus.position(this.manager.ww / 2, this.manager.wh / 2 + 240);
  }

  draw() {
    if (this.isBlinking) {
      this.slimesEyes.scale.y = 0.05;
    } else {
      this.slimesEyes.scale.y = 0.75;
    }

    if (frameCount % 180 === 0) {
      this.isBlinking = true;
      this.blinkTimer = frameCount;
    }
    if (this.isBlinking && frameCount - this.blinkTimer > 5) {
      this.isBlinking = false;
    }

    let constraintX = constrain(mouseX, this.slime.x, this.slime.x + 150);
    let constraintY = constrain(mouseY, this.slime.y - 200, this.slime.y);
    this.slimesEyes.moveTowards({ x: constraintX, y: constraintY }, 0.15);
    
    this.currentMix.color = color(this.floFlaskSlider.value(), this.flaskSlider.value(), this.vialSlider.value());
    this.slimeBar.x = this.manager.slimeBarX;
    this.happinessBar.x = this.manager.happinessBarX;
  }

  remove() {
    this.slime.remove();
    this.slimesEyes.remove();
    this.vial.remove();
    this.vialSlider.remove();
    this.flask.remove();
    this.flaskSlider.remove();
    this.floFlask.remove();
    this.floFlaskSlider.remove();
    this.desiredMix.remove();
    this.currentMix.remove();
    this.checkMixButton.remove();
    this.happinessBar.remove();
    this.slimeBar.remove();
    this.home.remove();
    this.mixStatus.remove();
  }

  checkMix() {
    if (this.colorComparison()) {
      if (this.manager.slimeBarX < 100) {
        this.manager.slimeBarX += 50;
        if (this.manager.slimeBarX > 100) {
          this.manager.slimeBarX = 100;
        }
        
      }
      this.mixStatus.html('Good match! Your slime enjoyed the potion.');
    }
    else {
      this.manager.happinessBarX = max(-100, this.manager.happinessBarX - 10);
      this.manager.slimeBarX = max(-100, this.manager.slimeBarX - 20);
      this.mixStatus.html('Try matching the new sample.');
    }
    this.randomR = random(255);
    this.randomG = random(255);
    this.randomB = random(255);
    this.desiredMix.color = color(this.randomR, this.randomG, this.randomB);
  }

  colorComparison() {
    let randomR = false;
    let randomG = false;
    let randomB = false;
    let offset = 55;
    
    if (this.randomR - offset <= this.floFlaskSlider.value() && this.floFlaskSlider.value() <= this.randomR + offset) {
      randomR = true;
    }
    if (this.randomG - offset <= this.flaskSlider.value() && this.flaskSlider.value() <= this.randomG + offset) {
      randomG = true;
    }
    if (this.randomB - offset <= this.vialSlider.value() && this.vialSlider.value() <= this.randomB + offset) {
      randomB = true;
    }
    
    return randomR && randomG && randomB;
  }
}

function setup() {
  screenManager = new ScreenManager();
  screenManager.setup();
}

function draw() {
  screenManager.draw();
}

function mousePressed(event) {
  if (event.target.tagName === 'CANVAS' && screenManager?.currentScreen instanceof SlimeScreen) {
    screenManager.currentScreen.play();
  }
}
