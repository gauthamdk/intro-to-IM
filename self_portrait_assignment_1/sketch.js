function setup() {
  createCanvas(640, 480);
}

let size = 2;
function draw() {
  background(63, 83, 212);
  let centerX = width / 2;
  let centerY = height / 2;
  face(centerX, centerY, size);
}

function face(centerX, centerY, size) {
  magnify();
  neck(centerX, centerY, size);
  ears(centerX, centerY, size);
  fill(203, 130, 98);
  ellipse(centerX, centerY, size * 110, size * 145); // face shape
  mouth(centerX, centerY, size);
  nose(centerX, centerY, size);
  eyes(centerX, centerY, size);
  hair(centerX, centerY, size);
  beard(centerX, centerY, size, 3);
  mole(centerX, centerY, size);
}

function magnify() {
  fill(0);
  strokeWeight(10);
  line(50, 40, 70, 70);
  strokeWeight(1);
  fill(225);
  circle(50, 40, 40);
}

function mousePressed() {
  if (mouseX > 30 && mouseX < 70 && mouseY < 60 && mouseY > 20) {
    if (size === 1) {
      size = 2;
    } else {
      size = 1;
    }
  }
}

function mole(centerX, centerY, size) {
  circle(centerX + size * 13, centerY - size * 6, size * 1);
}

function neck(centerX, centerY, size) {
  //neck
  fill(203, 130, 98);
  quad(
    centerX - size * 20,
    centerY + size * 40,
    centerX + size * 20,
    centerY + size * 40,
    centerX + size * 40,
    centerY + size * 90,
    centerX - size * 40,
    centerY + size * 90
  );
}

function mouth(centerX, centerY, size) {
  // mouth
  let controlAx = centerX - size * 30;
  let controlAy = centerY - size * 20;

  let controlBx = centerX + size * 30;
  let controlBy = centerY - size * 20;

  let startAx = centerX - size * 20;
  let startAy = centerY + size * 40;

  let startBx = centerX + size * 20;
  let startBy = centerY + size * 40;

  fill(167, 76, 78);
  curve(
    controlAx,
    controlAy,
    startAx,
    startAy,
    startBx,
    startBy,
    controlBx,
    controlBy
  );
  line(startAx, startAy, startBx, startBy);
}

function nose(centerX, centerY, size) {
  // nose
  line(
    centerX - size * 10,
    centerY + size * 20,
    centerX + size * 10,
    centerY + size * 20
  );
  curve(
    centerX - size * 20,
    centerY + size * 20,
    centerX - size * 10,
    centerY + size * 20,
    centerX - size * 6,
    centerY + size * 2,
    centerX - size * 20,
    centerY + size * 2
  );

  curve(
    centerX + size * 20,
    centerY + size * 2,
    centerX + size * 6,
    centerY + size * 2,
    centerX + size * 10,
    centerY + size * 20,
    centerX + size * 20,
    centerY + size * 20
  );
}

function eyes(centerX, centerY, size) {
  // eyes
  fill(220);
  ellipse(centerX - size * 25, centerY - size * 20, size * 25, size * 20);
  ellipse(centerX + size * 25, centerY - size * 20, size * 25, size * 20);
  fill(0);
  ellipse(centerX - size * 25, centerY - size * 18, size * 12, size * 12);
  ellipse(centerX + size * 25, centerY - size * 18, size * 12, size * 12);
  fill(255);
  ellipse(centerX - size * 25, centerY - size * 18, size * 3, size * 3);
  ellipse(centerX + size * 25, centerY - size * 18, size * 3, size * 3);

  //eyebrows
  rectMode(CENTER);
  fill(43, 43, 38);
  rect(
    centerX - size * 25,
    centerY - size * 36,
    size * 28,
    size * 8,
    size * 10
  );
  rect(
    centerX + size * 25,
    centerY - size * 36,
    size * 28,
    size * 8,
    size * 10
  );
}

function hair(centerX, centerY, size) {
  fill(16, 23, 38);
  // sideburns
  let x1 = centerX - size * 40;
  let y1 = centerY - size * 60;
  let x2 = centerX - size * 33;
  let y2 = centerY - size * 50;
  let x3 = centerX - size * 53;
  let y3 = centerY - size * 20;
  triangle(x1, y1, x2, y2, x3, y3);
  
  let x21 = centerX + size * 40;
  let y21 = centerY - size * 60;
  let x22 = centerX + size * 33;
  let y22 = centerY - size * 50;
  let x23 = centerX + size * 53;
  let y23 = centerY - size * 20;
  triangle(x21, y21, x22, y22, x23, y23);

  //hair
  let controlAx = centerX - size * 44;
  let controlAy = centerY - size * 45;

  let controlBx = centerX + size * 44;
  let controlBy = centerY - size * 45;

  let anchorAx = centerX - size * 50;
  let anchorAy = centerY - size * 85;

  let anchorBx = centerX + size * 50;
  let anchorBy = centerY - size * 85;

  bezier(
    controlAx,
    controlAy,
    anchorAx,
    anchorAy,
    anchorBx,
    anchorBy,
    controlBx,
    controlBy
  );
}

function ears(centerX, centerY, size) {
  //ears
  fill(206, 128, 80);
  arc(
    centerX - size * 50,
    centerY - size * 15,
    size * 25,
    size * 25,
    HALF_PI,
    PI + HALF_PI
  );
  arc(
    centerX + size * 50,
    centerY - size * 15,
    size * 25,
    size * 25,
    PI + HALF_PI,
    HALF_PI
  );
}

function beard(centerX, centerY, size, weight) {
  let beardStart = centerY + size * 25;

  strokeWeight(weight);
  // moustache
  for (let i = centerX - size * 25; i < centerX + size * 25; i += 3) {
    line(i, beardStart, i + 3, beardStart + size * 14);
  }
  for (let i = centerX - size * 25; i < centerX + size * 25; i += 3) {
    line(i, beardStart, i + 2, beardStart + size * 14);
  }

  // goatee
  for (let i = centerX - size * 30; i < centerX + size * 30; i += 3) {
    line(i, beardStart + size * 22, i + 3, beardStart + size * 40);
  }
  for (let i = centerX - size * 30; i < centerX + size * 30; i += 3) {
    line(i, beardStart + size * 25, i + 2, beardStart + size * 45);
  }
  for (let i = centerX - size * 20; i < centerX + size * 20; i += 3) {
    line(i, beardStart + size * 35, i + 3, beardStart + size * 50);
  }

  //sides
  for (let i = centerX - size * 43; i < centerX - size * 20; i += 3) {
    line(i, beardStart + size * 15, i + 3, beardStart + size * 30);
  }
  for (let i = centerX - size * 38; i < centerX - size * 18; i += 3) {
    line(i, beardStart + size * 15, i + 2, beardStart + size * 35);
  }

  for (let i = centerX + size * 20; i < centerX + size * 43; i += 3) {
    line(i, beardStart + size * 15, i + 3, beardStart + size * 30);
  }
  for (let i = centerX + size * 18; i < centerX + size * 38; i += 3) {
    line(i, beardStart + size * 15, i + 2, beardStart + size * 35);
  }

  //connectors
  for (let i = centerX - size * 30; i < centerX - size * 20; i += 3) {
    line(i, beardStart + size * 5, i + 3, beardStart + size * 20);
  }

  for (let i = centerX + size * 20; i < centerX + size * 30; i += 3) {
    line(i, beardStart + size * 5, i + 3, beardStart + size * 20);
  }

  // side burns
  for (let i = centerX - size * 50; i < centerX - size * 40; i += 3) {
    line(i, beardStart + size * 1, i + 2, beardStart + size * 20);
  }
  for (let i = centerX - size * 55; i < centerX - size * 48; i += 3) {
    line(i, beardStart - size * 10, i + 2, beardStart + size * 5);
  }

  for (let i = centerX + size * 40; i < centerX + size * 50; i += 3) {
    line(i + 2, beardStart + size * 1, i, beardStart + size * 20);
  }
  for (let i = centerX + size * 48; i < centerX + size * 55; i += 3) {
    line(i + 2, beardStart - size * 10, i, beardStart + size * 5);
  }
}
