let name = "Gravity";
let letters = [];

function setup() {
  createCanvas(600, 600);
  let startX = 170;
  for (i = 0; i < name.length; i++) {
    letters.push(new Letter(name[i], startX, 100));
    startX += 50;
  }
}

function draw() {
  background(220);
  textFont("Courier New");
  textStyle(BOLD);
  textAlign(CENTER);
  textSize(80);

  for (i = 0; i < letters.length; i++) {
    letters[i].run();
  }
}

function mousePressed() {
  for (i = 0; i < letters.length; i++) {
    letters[i].fall();
  }
}

class Letter {
  constructor(letter, x, y) {
    this.letter = letter;
    this.homeX = this.x = x;
    this.homeY = this.y = y;
    this.range = 150;
    this.g = false;
    this.mass = random(5, 8);
    this.resistance = random(10, 30);
    this.t = 0;
  }

  run() {
    this.draw();
    this.update();
  }

  draw() {
    text(this.letter, this.x, this.y);
  }

  update() {
    if (this.g) {
      // acc = (mass*gravity - air_resistance)/mass
      let acc = (this.mass * 9.81 - this.resistance) / this.mass;
      this.y += 0.5 * acc * (this.t / 200) ** 2;
      this.t += 1;

      // checking if it hits the ground
      if (this.y > height) {
        this.g = false;
        this.t = 0;
      }
    } else {
      this.x += (this.homeX - this.x) * 0.05;
      this.y += (this.homeY - this.y) * 0.05;
      let d = dist(mouseX, mouseY, this.x, this.y);

      let dx = mouseX - this.x;
      let dy = mouseY - this.y + textAscent() / 2; //textAscent gets the text height

      this.x += dx * (2 / d);
      this.y += dy * (2 / d);
    }
  }

  fall() {
    this.g = true;
  }
}
