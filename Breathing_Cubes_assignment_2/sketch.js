const rectWidth = 50;

function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(255);
  rectMode(CENTER);
  // for consistent color output
  noiseSeed(4)

  // laying out the squares
  for (let rectY = rectWidth / 2; rectY < height; rectY += rectWidth) {
    for (let rectX = rectWidth / 2; rectX < width; rectX += rectWidth) {
      // noise factors for color and angles
      let frameFactor = noise(frameCount * 0.005);
      let mouseXFactor = noise(mouseX * 0.001);
      let mouseYFactor = noise(mouseY * 0.001);

      // push and pop for translation and rotation
      push();
      let colorValue =
        255 - (abs(mouseX - rectX) + abs(mouseY - rectY)) * frameFactor;

      fill(colorValue, mouseXFactor * colorValue, mouseYFactor * colorValue);

      translate(rectX, rectY);

      // changing this will change the intensity of the rotation
      let rotationFactor = 800
      let angle =
        ((abs(mouseX - rectX) + abs(mouseY - rectY)) /
          (rotationFactor + frameFactor * 1000)) *
        TWO_PI;

      rotate(angle);

      rect(0, 0, rectWidth);
      pop();
    }
  }
}
