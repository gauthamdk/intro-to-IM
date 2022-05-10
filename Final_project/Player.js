class Player {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.step = 0;
    this.spriteW = width / 17;
    this.spriteH = height / 5;
    this.hitCount = 0;
    this.gameOver = false;
    this.dyingFrame = false;
    this.vibrate = true;
    this.health = 3;
    this.hitting = false;
  }

  setGameOver(status) {
    this.gameOver = status;
  }

  deadmotors() {
    if (this.vibrate) {
      leftMotor = 50;
      rightMotor = 50;
      if (frameCount % 200 == 0) {
        leftMotor = 0;
        rightMotor = 0;
        this.vibrate = false;
      }
    }
  }
  
  getHealth(){
    return this.health;
  }
  
  hit(){
    this.health--;
    this.hitting = true;
  }
  
  resetLives(){
    this.health = 3;
  }
  
  setHitting(val){
    this.hitting = val;
  }
  
  getHitting(){
    return this.hitting;
  }

  getDying() {
    return this.dyingFrame;
  }

  setDying() {
    this.dyingFrame = false;
  }

  reset() {
    this.setX(width / 2);
    this.setStep(0);
    this.setDying();
    this.setGameOver(false);
    this.vibrate = true;
  }

  update() {
    leftMotor = 0;
    rightMotor = 0;

    if (!this.gameOver) {
      if (this.x <= width * 0.13) {
        this.x = width * 0.13;
        leftMotor = 50;
        print("left");
        // this.hitCount++;
      } else if (this.x >= width * 0.87) {
        this.x = width * 0.87;
        rightMotor = 50;
        print("right");
        // this.hitCount++;
      } else {
        // this.hitCount = 0;
      }
    }

    if (!this.gameOver) {
      this.move();
    }
    this.draw();
  }

  draw() {
    image(playerSprites[this.step], this.x, this.y, this.spriteW, this.spriteH);

    if (this.step == 5) {
      this.dyingFrame = true;
    }

    if (!this.gameOver) {
      if (frameCount % 15 == 0) {
        this.step = (this.step + 1) % 2;
        this.spriteW = width / 17;
        this.spriteH = height / 5;
      }
    } else {
      if (this.step != 4 && this.step != 5) {
        this.spriteW = width / 12;
        this.step = 4;
      } else if (frameCount % 15 == 0) {
        this.step = 5;
      }
    }
  }

  moveX(x) {
    // this.x += (x - this.x) * 0.2;
    this.x += x;
  }

  setX(x) {
    this.x = x;
  }

  getHitCount() {
    return this.hitCount;
  }

  resetHitCount() {
    this.hitCount = 0;
  }

  getLeftX() {
    return this.x - this.spriteW / 3;
  }

  getRightX() {
    return this.x + this.spriteW / 3;
  }

  getTopY() {
    return this.y + this.spriteH / 3;
  }

  getY() {
    return this.y;
  }

  setStep(s) {
    this.step = 0;
  }

  //placeholder movement functions
  move() {
    if (isKeyPressed) {
      if (keyIsDown(38)) {
        this.y -= 2;
      }

      if (keyIsDown(40)) {
        this.y += 2;
      }

      if (keyIsDown(37)) {
        this.x -= 5;
        this.step = 2;
        this.spriteW = width / 12;
      }

      if (keyIsDown(39)) {
        this.x += 5;
        this.step = 3;
        this.spriteW = width / 12;
      }
    }
  }
}
