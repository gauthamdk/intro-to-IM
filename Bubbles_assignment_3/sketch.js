let bubbles = [];

function setup() {
  createCanvas(800, 800);

  for (let i = 0; i < 100; i++) {
    let colorVals = color(
      random(255),
      random(255),
      random(255),
      random(100, 150)
    );
    let growth = random(1.5);
    let diameter = random(5);
    let timer = random(20);
    let x = random(diameter, height - diameter);
    let y = random(diameter, width - diameter);
    bubbles.push(new Bubble(x, y, diameter, timer, growth, colorVals));
  }
}

function draw() {
  background(220);

  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].run();
  }
}

function mousePressed() {
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let popped = bubbles[i].pop();
    if (popped) {
      bubbles.splice(i, 1);
      break;
    }
  }
}

class Bubble {
  constructor(posX, posY, diameter, timer, growth, colorValues) {
    this.color = color(colorValues);
    this.size = diameter;
    this.timer = timer;
    this.growth = growth;
    this.x = posX;
    this.y = posY;
    this.radius = this.size / 2;
  }

  run() {
    this.draw();
    this.update();
  }

  draw() {
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.size);
  }

  update() {
    this.size += this.growth;
    this.radius = this.size / 2;
  }

  pop() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < this.radius) {
      return true;
    }
  }
}
