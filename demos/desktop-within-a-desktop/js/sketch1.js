// A2 Repeating Animation
let pc = (p) => {
    p.setup = () => {
        p.createCanvas(1200, 1000).parent('A2Sketch');
        p.background(220);
    }

    p.draw = () => {
        p.background(220);
        p.noStroke();
        // Desk
        p.fill(140);
        p.rect(0, 1000 / 2 + 150, 1200, 1000);

        // Monitor
        p.push();
        // Stand Neck
        p.fill(30);
        p.rect(1200 / 2 - 150, 1000 / 2 + 100, 100, 105);
        // Monitor Screen
        p.fill(90);
        p.rect(1200 / 2 - 355, 1000 / 2 - 155, 500, 300);
        // Monitor Border
        p.fill(30);
        p.rect(1200 / 2 - 350, 1000 / 2 - 150, 490, 290);
        // Stand Base
        p.fill(40);
        p.rect(1200 / 2 - 205, 1000 / 2 + 200, 210, 10);

        p.pop();

        // PC
        p.push();
        // Outer Case
        p.fill(30);
        p.rect(1200 / 2 + 210, 1000 / 2 - 150, 190, 350);
        // Inner Case
        p.fill(40);
        p.rect(1200 / 2 + 225, 1000 / 2 - 135, 160, 320);
        // Case Feet
        p.fill(20);
        p.rect(1200 / 2 + 220, 1000 / 2 + 200, 20, 15);
        p.rect(1200 / 2 + 370, 1000 / 2 + 200, 20, 15);
        p.pop();

        // Fans
        p.fill(100)
        for (let i = 130; i > -136; i = i - 105) {
            p.circle(1200 / 2 + 305, 1000 / 2 + i, 110)
        }

        p.fill(50)

        // Fan Blades
        for (let i = 130; i > -136; i = i - 105) {
            p.push();
            p.fill(250)
            p.translate(1200 / 2 + 305, 1000 / 2 + i) 
            p.rotate(p.frameCount * 0.15)
            for (let i = 0; i < 5; i++) {
                p.rotate(5)
                p.beginShape()
                p.vertex(0, 0)
                p.vertex(5, 0)
                p.vertex(10, 40)
                p.vertex(5, 50)
                p.vertex(0, 50)
                p.vertex(-5, 50)
                p.vertex(-30, 40)
                p.endShape()
            }
            p.pop();
        }

        for (let i = 130; i > -136; i = i - 105) {
            p.circle(1200 / 2 + 305, 1000 / 2 + i, 40)
        }

        // Darken Layer
        p.fill(0, 0, 0, 100)
        p.rect(0, 0, 1200, 1000)
        p.fill(0, 0, 0, 100)
        p.rect(0, 0, 1200, 1000)

        // White LED Fan Ring
        for (let i = 130; i > -136; i = i - 105) {
            p.push();
            p.translate(1200 / 2 + 305, 1000 / 2 + i)
            p.fill(255)
            p.noStroke();
            p.rotate(p.frameCount * 0.09)
            for (let i = 0; i < 175; i++) {
                p.rotate(0.05)
                p.fill(115 + i)
                p.circle(35, 35, 10)
            }

            p.pop();
        }
    }

    p.windowResized = () => {
        p.resizeCanvas(1200, 1000);
    }
};

// A1 Simple Drawing
let pcWallpaper = (p) => {
    p.setup = () => {
        let canvas = p.createCanvas(490, 290).parent('A1Sketch');
        p.background(230, 93, 30);
        document.getElementById('unlock').addEventListener('click', sketchSwitch, { once: true });

        // Sun
        p.fill(252, 227, 149);
        p.noStroke();
        p.circle(398, 58, 92);

        // Mountain Layers
        // Layer 1
        p.fill(201, 58, 10);
        p.noStroke();
        p.beginShape();
        p.vertex(0, 290);
        for (let i = 0; i < 490; i += 9) {
            p.vertex(i, Math.floor(Math.random() * 12) + 87);
        }
        p.vertex(490, 72);
        p.vertex(490, 290);
        p.endShape();

        // Layer 2
        p.fill(145, 20, 3);
        p.noStroke();
        p.beginShape();
        p.vertex(0, 290);
        for (let i = 0; i < 490; i += 9) {
            p.vertex(i, Math.floor(Math.random() * 12) + 127);
        }
        p.vertex(490, 116);
        p.vertex(490, 290);
        p.endShape();

        // Layer 3
        p.fill(66, 7, 3);
        p.noStroke();
        p.beginShape();
        p.vertex(0, 290);
        for (let i = 0; i < 490; i += 9) {
            p.vertex(i, Math.floor(Math.random() * 12) + 176);
        }
        p.vertex(490, 101);
        p.vertex(490, 290);
        p.endShape();

        // Screen Darken
        p.fill(0, 0, 0, 100)
        p.rect(0,0, 490, 290);
        p.rect(0,0, 490, 290);

        // Clock
        p.textSize(60);
        p.textFont('Arial Black');
        p.fill(255);
        p.text("3:56", 175, 120);

        // Temp
        p.textSize(10);
        p.text("⛅ 12C MON 15", 200, 150);

    }
    let clicked = false;
    p.draw = () => {
        // Windows Loading Wheel
        if (!clicked) {
            p.push();
                p.translate(250, 230)
                p.fill(255)
                p.rotate(p.frameCount * 0.09)
                for (let i = 0; i < 8; i++){
                    p.rotate(0.1)
                    p.circle(9, 9, 5)
                }
                p.fill(24, 2, 1)
                p.rotate(p.frameCount * 0.09)
                for (let i = 0; i < 8; i++){
                    p.rotate(0.1)
                    p.circle(9, 9, 6)
                }
            p.pop();
        }
        else {
            p.fill(24, 2, 1)
            p.rect(200, 200, 80, 80);
        }

    }

    function sketchSwitch() {
        document.getElementById('unlock').hidden = true;
        clicked = true;
        const a1 = document.getElementById('A1Sketch');
        a1.classList.add('slide-up');

    }
};

// Immitation of A3 - Tamagotchi
let pcgame = (p) => {
    p.setup = () => {
        p.createCanvas(490, 290).parent('A3Sketch');
        p.background(20);
    }

    p.draw = () => {
        breathe = p.sin(p.frameCount * 0.1) * 10;
        blink = p.sin(p.frameCount * 0.1) * 40;
        p.background(20);
        p.noStroke();
        p.fill('skyblue');
        p.ellipse(250, 145, 150 + breathe, 150 + breathe * 0.5);
        p.fill('blue');
        p.ellipse(250, 145, 100 + breathe, 100 + breathe * 0.5);
        p.fill('white');
        p.ellipse(225, 145, 20, blink);
        p.ellipse(265, 145, 20, blink);

    }
    
};  

let a2Sketch = new p5(pc);
let a1Sketch = new p5(pcWallpaper);
let a3Sketch = new p5(pcgame);
