let treeSprites = [];
let objectsLeft = [];
let objectsRight = [];
let objectCount = 0;
let obstacles = [];
let obstaclesCount = 0;
let road;
let player;
let playerSprites = [];
let movePlayer;
let leftMotor = 0;
let rightMotor = 0;
let x = 0;
let y = 0;
let z = 0;
let bg;
let fence;
let prevRow;
let sounds = [];
let highscore;
let heart = [];

function preload() {
  // trees
  tree = loadImage("assets/trees.png");
  bricks = loadImage("assets/bricks.png");
  fenceImage = loadImage("assets/fence.png");
  player1 = loadImage("assets/sprite1.png");
  player2 = loadImage("assets/sprite2.png");
  playerLeft = loadImage("assets/spriteleft.png");
  playerRight = loadImage("assets/spriteright.png");
  playerFall1 = loadImage("assets/fall1.png");
  playerFall2 = loadImage("assets/fall2.png");
  start1 = loadImage("assets/start1.jpeg");
  start2 = loadImage("assets/start2.jpeg");
  start3 = loadImage("assets/start3.jpeg");
  start4 = loadImage("assets/start4.jpeg");
  start5 = loadImage("assets/start5.jpeg");
  logo = loadImage("assets/SK8R.png");
  health = loadImage("assets/Heart.png");

  //sounds
  soundtrack = loadSound("assets/soundtrack.mp3");
  injury = loadSound("assets/injury.mp3");
}

function setup() {
  createCanvas(2880, 1800);
  imageMode(CENTER);

  // get background bricks
  bg = bricks;

  // obstacles
  fence = fenceImage;

  // load trees
  let w = tree.width;
  let h = tree.height / 2;

  treeSprites[0] = tree.get(w - 60, 0, 60, h);
  treeSprites[1] = tree.get(w - 60, h, 60, h);
  treeSprites[2] = tree.get(w - 120, 0, 60, h);
  treeSprites[3] = tree.get(w - 120, h, 60, h);

  //load player
  playerSprites[0] = player1;
  playerSprites[1] = player2;
  playerSprites[2] = playerLeft;
  playerSprites[3] = playerRight;
  playerSprites[4] = playerFall1;
  playerSprites[5] = playerFall2;

  // heart
  w = health.width / 3;
  h = health.height;
  heart[0] = health;
  heart[1] = health.get(0, 0, w * 2 - 5, h);
  heart[2] = health.get(0, 0, w + 3, h);

  //sounds
  sounds[0] = soundtrack;
  sounds[1] = injury;

  for (let i = 0; i < 5; i++) {
    objectsLeft.push(
      new Tree(
        treeSprites[floor(random(4))],
        width * 0.15,
        -height * 0.1,
        500,
        width * 0.1,
        height * 0.1333
      )
    );

    objectsRight.push(
      new Tree(
        treeSprites[floor(random(4))],
        width * 0.85,
        -height * 0.1,
        -500,
        width * 0.1,
        height * 0.1333
      )
    );
  }

  player = new Player(width * 0.5, height * 0.7, 50);
  road = new Road(player, sounds);

  // it will try to find an arduino you've already given permission to use in the browser:
  setUpSerial();
}

function draw() {
  road.playBg();
  if (!road.start()) {
    road.startScreen();
  } else if (road.gameDone() && player.getDying()) {
    player.deadmotors();
    road.endScreen();
  } else {
    if (!road.gameDone()) {
      if (
        (frameCount > 1000) & (frameCount % 100 == 0) &&
        road.getSpeed() > 10
      ) {
        road.reduceSpeed(1);
      }

      if (frameCount > 1000 && frameCount % 100 == 0 && road.rate() > 30) {
        road.increaseRate(2);
      }

      if (frameCount % 100 == 0 && objectCount < 5) {
        objectCount++;
      }
      if (frameCount % road.rate() == 0) {
        let row = floor(random(3));

        if (row == prevRow) {
          row = (row + 1) % 3;
        }
        prevRow = row;

        obstacles.push(
          new Obstacle(
            row,
            fence,
            (width * 5) / 25,
            (height * 5) / 50,
            road.getSpeed()
          )
        );

        row = (row + 1) % 3;
        if (random(1) > 0.9) {
          obstacles.push(
            new Obstacle(
              row,
              fence,
              (width * 5) / 25,
              (height * 5) / 50,
              road.getSpeed()
            )
          );
          obstaclesCount++;
        }

        obstaclesCount++;
      }

      movePlayer = map(x, -33, 33, width / 20, -width / 20);
    } else {
      movePlayer = 0;
    }

    road.update(movePlayer);

    //trees
    for (let i = 0; i < objectCount; i++) {
      objectsLeft[i].update();
      objectsRight[i].update();
      if (objectsLeft[i].getPosY() > height) {
        objectsLeft.splice(i, 1);
        objectsRight.splice(i, 1);

        objectsLeft.push(
          new Tree(
            treeSprites[floor(random(4))],
            width * 0.15,
            -height * 0.1,
            500,
            width * 0.1,
            height * 0.1333
          )
        );

        objectsRight.push(
          new Tree(
            treeSprites[floor(random(4))],
            width * 0.85,
            -height * 0.1,
            -500,
            width * 0.1,
            height * 0.1333
          )
        );
      }
    }

    let lives = player.getHealth();
    if (lives > 0) {
      road.drawHeart(lives);
    }
  }
}

class Obstacle {
  constructor(row, sprite, w, h, speed) {
    this.row = row;
    this.sprite = sprite;
    this.h = h;
    this.w = w;
    this.speed = speed;
    this.y = height * 0.02;
    switch (row) {
      case 0:
        this.x = width * 0.38;
        break;
      case 1:
        this.x = width * 0.5;
        break;
      case 2:
        this.x = width * 0.62;
        break;
    }
  }

  draw() {
    if (!road.gameDone()) {
      switch (this.row) {
        case 0:
          this.y += height / (23 * this.speed);
          this.x -= width / (100 * this.speed);
          break;

        case 1:
          this.y += height / (23 * this.speed);
          break;
        case 2:
          this.y += height / (23 * this.speed);
          this.x += width / (100 * this.speed);
      }

      this.w += (this.x / width) * 0.5;
      this.h += (this.y / height) * 0.25;
    }
    image(this.sprite, this.x, this.y, this.w, this.h);
  }

  offScreen() {
    return this.y > height;
  }

  getLeftX() {
    return this.x - this.w / 2;
  }

  getRightX() {
    return this.x + this.w / 2;
  }

  getBottomY() {
    return this.y + this.h / 3;
  }
}

class Tree {
  constructor(treeSprite, x, y, speed, w, h) {
    this.x = x;
    this.y = y;
    this.sprite = treeSprite;
    this.speed = speed;
    this.w = w;
    this.h = h;
  }

  getPosY() {
    return this.y;
  }

  update() {
    if (!road.gameDone()) {
      this.w += width / 9000;
      this.h += height / 8000;
      this.y += height / abs(this.speed);
      this.x -= width / (this.speed * width * 0.002);
    }
    this.draw();
  }

  draw() {
    image(this.sprite, this.x, this.y, this.w, this.h);
  }
}

class Road {
  constructor(player, sounds) {
    this.player = player;
    this.sounds = sounds;
    this.gameOver = false;
    this.startGame = false;
    this.obstacleSpeed = 28.5;
    this.generateRate = 100;
    this.score = 0;
  }

  scoreboard() {
    textStyle(BOLD);
    textSize(100);
    fill(0);
    text(this.score, width * 0.5, height * 0.1);
  }

  startScreen() {
    background("#181818");
    image(logo, width / 2, height / 2.8, width / 3, height / 2.5);
    rectMode(CENTER);

    if (
      mouseX > width / 2 - width * 0.15 &&
      mouseX < width / 2 + width * 0.15 &&
      mouseY > height / 2 - height * 0.04 &&
      mouseY < height / 2 + height * 0.04
    ) {
      fill(82, 0, 231);
      rect(width / 2, height / 2, width * 0.3, height * 0.08, 20);
      fill(200);
    } else {
      fill(200);
      rect(width / 2, height / 2, width * 0.3, height * 0.08, 20);
      fill(18);
    }
    textSize(50);
    textAlign(CENTER, CENTER);
    text("Play", width / 2, height / 2);
    image(start1, width * 0.15, height * 0.25, width * 0.3, height * 0.4);
    image(start2, width * 0.84, height * 0.25, width * 0.3, height * 0.4);
    image(start3, width * 0.8, height * 0.75, width * 0.3, height * 0.3);
    image(start4, width * 0.2, height * 0.75, width * 0.3, height * 0.4);
    image(start5, width * 0.5, height * 0.78, width * 0.2, height * 0.4);
  }

  endScreen() {
    highscore = getItem("highscore");
    if (highscore === null) {
      highscore = 0;
    }
    highscore = max(this.score, highscore);
    storeItem("highscore", highscore);

    background("#181818");
    image(logo, width / 2, height / 2.8, width / 3, height / 2.5);
    rectMode(CENTER);

    textSize(80);
    textAlign(CENTER, CENTER);
    if (
      mouseX > width / 2 - width * 0.15 &&
      mouseX < width / 2 + width * 0.15 &&
      mouseY > height * 0.7 - height * 0.04 &&
      mouseY < height * 0.7 + height * 0.04
    ) {
      fill(82, 0, 231);
      rect(width / 2, height * 0.7, width * 0.3, height * 0.08, 20);
      fill(200);
    } else {
      fill(200);
      rect(width / 2, height * 0.7, width * 0.3, height * 0.08, 20);
      fill(18);
    }

    text("Restart", width / 2, height * 0.7);
    fill(200);
    text("Highscore", width / 2, height * 0.55);
    fill(200);
    text(highscore, width / 2, height * 0.6);
    if (
      mouseX > width / 2 - width * 0.15 &&
      mouseX < width / 2 + width * 0.15 &&
      mouseY > height * 0.8 - height * 0.04 &&
      mouseY < height * 0.8 + height * 0.04
    ) {
      fill(82, 0, 231);
      rect(width / 2, height * 0.8, width * 0.3, height * 0.08, 20);
      fill(200);
    } else {
      fill(200);
      rect(width / 2, height * 0.8, width * 0.3, height * 0.08, 20);
      fill(18);
    }

    text("Home", width / 2, height * 0.8);
    fill(200);
    textSize(80);
    text(this.score, width / 2, height * 0.45);
  }

  reset() {
    this.obstacleSpeed = 28.5;
    this.generateRate = 100;
    this.score = 0;
    this.player.resetLives();
  }

  getScore() {
    return this.score;
  }

  incScore() {
    this.score++;
  }

  start() {
    return this.startGame;
  }

  gameDone() {
    return this.gameOver;
  }

  setGameDone(status) {
    this.gameOver = status;
  }

  rate() {
    return this.generateRate;
  }

  getSpeed() {
    return this.obstacleSpeed;
  }

  reduceSpeed(speed) {
    this.obstacleSpeed -= speed;
  }

  setStart(status) {
    this.startGame = status;
  }

  setDone(status) {
    this.gameOver = status;
  }

  increaseRate(rate) {
    this.generateRate -= rate;
  }

  playBg() {
    this.sounds[0].setVolume(0.2);
    if (!this.sounds[0].isPlaying()) {
      this.sounds[0].loop();
      this.sounds[0].play();
    }
  }

  update(movePlayer) {
    this.draw();

    let pLeftX = this.player.getLeftX();
    let pRightX = this.player.getRightX();
    let pY = this.player.getTopY();

    // obstacles
    for (let i = 0; i < obstaclesCount; i++) {
      obstacles[i].draw();

      let obsLeftX = obstacles[i].getLeftX();
      let obsRightX = obstacles[i].getRightX();
      let obsBottomY = obstacles[i].getBottomY();

      if (
        pLeftX >= obsLeftX &&
        pRightX <= obsRightX &&
        abs(pY - obsBottomY) < height / 50 &&
        !this.player.getHitting()
      ) {
        this.player.hit();

        if (this.player.getHealth() < 1) {
          road.setGameDone(true);
          player.setGameOver(true);
        }

        this.sounds[1].setVolume(0.6);
        if (!this.sounds[1].isPlaying()) {
          this.sounds[1].play();
        }
      }

      if (
        pLeftX >= obsLeftX &&
        pRightX <= obsRightX &&
        obsBottomY - pY > height / 50
      ) {
        this.player.setHitting(false);
      }

      if (obstacles[i].offScreen()) {
        obstacles.splice(i, 1);
        obstaclesCount--;
        this.incScore();
      }
    }
    this.player.moveX(movePlayer);
    this.player.update();
    this.scoreboard();
  }

  drawHeart(lives) {
    image(
      heart[3 - lives],
      width * 0.9,
      height * 0.1,
      width * 0.15,
      height * 0.2
    );
  }

  draw() {
    image(bg, width / 2, height / 2, width, height);
    fill(100);
    beginShape();
    vertex(0, height);
    vertex(width * 0.3, 0);
    vertex(width * 0.7, 0);
    vertex(width, height);
    endShape();
  }
}

function mousePressed() {
  if (
    mouseX > width / 2 - width * 0.3 &&
    mouseX < width / 2 + width * 0.3 &&
    mouseY > height / 2 - height * 0.08 &&
    mouseY < height / 2 + height * 0.07 &&
    !road.start()
  ) {
    road.setStart(true);
  }

  if (
    mouseX > width / 2 - width * 0.15 &&
    mouseX < width / 2 + width * 0.15 &&
    mouseY > height * 0.7 - height * 0.04 &&
    mouseY < height * 0.7 + height * 0.04 &&
    road.gameDone()
  ) {
    road.setStart(true);
    road.setDone(false);
    obstacles = [];
    obstaclesCount = 0;
    road.reset();
    player.reset();
  }

  if (
    mouseX > width / 2 - width * 0.15 &&
    mouseX < width / 2 + width * 0.15 &&
    mouseY > height * 0.8 - height * 0.04 &&
    mouseY < height * 0.8 + height * 0.04 &&
    road.gameDone()
  ) {
    obstacles = [];
    obstaclesCount = 0;
    road.reset();
    player.reset();
    road.setStart(false);
    road.setDone(false);
  }
}

function keyPressed() {
  if (key == " ") {
    // important to have in order to start the serial connection!!
    setUpSerial(SELECT_PORT);
  }
}

function readSerial(data) {
  ////////////////////////////////////
  //READ FROM ARDUINO HERE
  ////////////////////////////////////

  if (data != null) {
    // make sure there is actually a message
    // split the message
    let fromArduino = split(trim(data), ",");
    // if the right length, then proceed
    if (fromArduino.length == 3) {
      // only store values here
      // do everything with those values in the main draw loop
      x = fromArduino[0];
      y = fromArduino[1];
      z = fromArduino[2];
    }

    //////////////////////////////////
    //SEND TO ARDUINO HERE (handshake)
    //////////////////////////////////
    console.log(leftMotor, rightMotor);
    let sendToArduino = leftMotor + "," + rightMotor + "\n";
    writeSerial(sendToArduino);
  }
}
