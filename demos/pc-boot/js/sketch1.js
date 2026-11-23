function setup() {
    createCanvas(windowWidth, windowHeight);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) noLoop();
}
  
function draw() {
    background(220);
    noStroke();
    // Desk
    fill(140);
    rect(0, windowHeight/2 + 150 , windowWidth, windowHeight);
    
    // Monitor
    push();
        rectMode(CENTER)
        // Stand Neck
        fill(30);
        rect(windowWidth/2 - 250, windowHeight/2 + 100, 100, 100);
        // Monitor Screen
        fill(90);
        rect(windowWidth/2 - 250, windowHeight/2 - 50, 500, 300);
        // Monitor Border
        fill(30);
        rect(windowWidth/2 - 250, windowHeight/2 - 50, 490, 290);
        // Stand Base
        fill(40);
        rect(windowWidth/2 - 250, windowHeight/2 + 150, 210, 10);
    pop();
    // PC
    push();
        rectMode(CENTER);
        // Outer Case
        fill(30);
        rect(windowWidth/2 + 150, windowHeight/2 - 30, 190, 350);
        // Inner Case
        fill(40);
        rect(windowWidth/2 + 150, windowHeight/2 - 30, 160, 320);
        // Case Feet
        fill(20);
        rect(windowWidth/2 + 70, windowHeight/2 + 150, 20, 15);
        rect(windowWidth/2 + 230, windowHeight/2 + 150, 20, 15);
        // Fans
        ellipseMode(CENTER)
        fill(100)
        circle(windowWidth/2 + 150, windowHeight/2 + 75, 110)
        circle(windowWidth/2 + 150, windowHeight/2 - 30, 110)
        circle(windowWidth/2 + 150, windowHeight/2 - 135, 110)
        fill(50)
        
        // Fan Blades
        for (let i = 75; i > -136; i = i - 105)
        {
           push();
            fill(250)
            translate(windowWidth/2 + 150, windowHeight/2 + i)
            rotate(frameCount * 0.15)
            for (let i = 0; i < 5; i++){
                rotate(5)
                beginShape()
                    vertex(0, 0)
                    vertex(5, 0)
                    vertex(10, 40)
                    vertex(5, 50)
                    vertex(0, 50)
                    vertex(-5, 50)
                    vertex(-30, 40)
                endShape() 
            }  
            pop(); 
        }
        
        for (let i = 75; i > -136; i = i - 105) {
            circle(windowWidth/2 + 150, windowHeight/2 + i, 40)
        }
        
    pop();
    // Darken Layer
    fill(0,0,0,100)
    rect(0,0, windowWidth, windowHeight)
    fill(0,0,0,100)
    rect(0,0, windowWidth, windowHeight)
    
    // White LED Fan Ring
    for (let i = 75; i > -136; i = i - 105)
    {
        
        push();    
            translate(windowWidth/2 + 150, windowHeight/2 + i)
            fill(255)
            noStroke();
            rotate(frameCount*0.09)
            for (let i = 0; i < 175; i++){
            rotate(0.05)
            fill(115 + i)
            circle(35,35,10)
            }   
            
        pop();
    }

    // Windows Loading Wheel
    push();
        translate(windowWidth/2 - 250, windowHeight/2 + 40)
        fill(250)
        rotate(frameCount * 0.09)
        for (let i = 0; i < 8; i++){
            rotate(0.1)
            circle(9, 9, 5)
        }      
    pop(); 
    
    // Windows Logo
    fill (250)
    rect(windowWidth/2 - 245, windowHeight/2 - 100, 25)
    rect(windowWidth/2 - 275, windowHeight/2 - 100, 25)
    rect(windowWidth/2 - 245, windowHeight/2 - 70, 25)
    rect(windowWidth/2 - 275, windowHeight/2 - 70, 25)
}
