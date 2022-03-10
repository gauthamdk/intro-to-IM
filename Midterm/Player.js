class Player {
  constructor(sprites, sounds, size) {
    this.x = width / 3;
    this.y = height / 5;
    this.playerSprites = sprites;
    this.sounds = sounds;
    this.size = size;
    this.prevMove = 0;
    this.move = 0;
    this.step = 0;
    this.speed = 2;
    this.attack = false;
    this.alive = true;
    this.remove = false;
  }

  update() {
    this.draw();
    this.walk();
  }

  die() {
    this.alive = false;
    if (this.move == 0) {
      this.move = 6;
    } else if (this.move == 1) {
      this.move = 7;
    }
    this.step = 0;
  }

  revive() {
    this.alive = true;
  }

  isAlive() {
    return this.alive;
  }

  getRemove() {
    return this.remove;
  }

  playSwordSlash() {
    this.sounds[0].setVolume(0.1);
    this.sounds[0].play();
  }
  
  playDying() {
    this.sounds[1].setVolume(0.1);
    this.sounds[1].play();
    this.sounds[2].setVolume(0.2);
    this.sounds[2].play();
  }

  draw() {
    if (!this.alive) {
      this.drawDeath();
      if (this.step == 2) {
        this.remove = true;
      }
    } else if (this.attack && this.step < 4) {
      this.drawAttack();
    } else {
      image(
        this.playerSprites[this.move][this.step],
        this.x,
        this.y,
        this.size,
        this.size
      );
    }
  }

  drawDeath() {
    if (frameCount % 15 == 0) {
      this.step = (this.step + 1) % 3;
    }
    image(this.playerSprites[this.move][this.step], this.x, this.y, this.size, this.size);
  }

  getPos() {
    return [this.x, this.y];
  }

  checkDirection() {
    if (this.move > 3) {
      this.move = this.prevMove;
    }
  }

  walk() {
    if (this.alive) {
      let walkCodes = [83, 65, 68, 87];
      this.checkDirection();
      if (isKeyPressed && walkCodes.includes(keyCode)) {
        // s key
        if (keyIsDown(83) && this.y < height - this.size / 4) {
          this.y += this.speed;
        }
        // a key
        if (keyIsDown(65) && this.x > this.size / 10) {
          this.move = 1;
          this.x -= this.speed;
        }
        // d key
        if (keyIsDown(68) && this.x < width - this.size / 10) {
          this.move = 0;
          this.x += this.speed;
        }
        // w key
        if (keyIsDown(87) && this.y > this.size / 8) {
          this.y -= this.speed;
        }

        // use modulo to loop the animation
        if (frameCount % 3 == 0) {
          this.step = (this.step + 1) % 6;
        }
      }
    }
  }

  setAttack() {
    this.step = 0;
    this.attack = !this.attack;
  }

  drawAttack() {
    this.prevMove = this.move;

    if (this.prevMove == 0) {
      this.move = 4;
    } else {
      this.move = 5;
    }

    image(
      this.playerSprites[this.move][this.step],
      this.x,
      this.y,
      this.size,
      this.size
    );

    if (this.step == 3) {
      this.setAttack();
    }

    if (frameCount % 5 == 0) {
      this.step = (this.step + 1) % 4;
    }
  }
}
