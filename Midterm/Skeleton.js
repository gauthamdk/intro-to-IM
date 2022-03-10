class Skeleton {
  constructor(sprites, sounds, speed) {
    this.sprites = sprites;
    this.sounds = sounds;
    this.direction = 0;
    this.x = random(20, width - 20);
    this.y = random(height / 2, height - 50);
    this.step = 0;
    this.speed = speed;
    this.attackRange = 30;
    this.attack = false;
    this.alive = true;
    this.remove = false;
  }

  update(player_pos, skeletons) {
    if (this.attack && this.alive) {
      this.drawAttack(player_pos);
    } else if (!this.alive) {
      this.drawDeath();
      if (this.step == 14) {
        this.remove = true;
      }
    } else {
      this.move(player_pos, skeletons);
      this.draw();
    }
  }

  playDying() {
    this.sounds[0].setVolume(0.05);
    this.sounds[0].play();
  }

  getRemove() {
    return this.remove;
  }

  getStep() {
    return this.step;
  }

  getAttack() {
    return this.attack;
  }

  getStatus() {
    return this.alive;
  }

  die() {
    this.alive = false;
    if (this.direction == 2) {
      this.direction = 4;
    } else {
      this.direction = 5;
    }
    this.step = 0;
  }

  getPos() {
    return [this.x, this.y];
  }

  draw() {
    image(this.sprites[this.direction][this.step], this.x, this.y);
  }

  drawDeath() {
    if (frameCount % 10 == 0) {
      this.step = (this.step + 1) % 15;
    }
    image(this.sprites[this.direction][this.step], this.x, this.y);
  }

  drawAttack(player_pos) {
    if (this.step == 17) {
      this.attack = false;
      this.step = 0;
      return;
    }
    if (frameCount % 5 == 0) {
      this.step = (this.step + 1) % 18;
    }
    image(this.sprites[this.direction][this.step], this.x, this.y);
  }

  move(player_pos, skeletons) {
    let px = player_pos[0];
    let py = player_pos[1];
    let stand = false;
    if (frameCount % 100 == 0) {
      this.speed += 0.2;
    }

    if (!stand) {
      if (abs(this.x - px) <= this.attackRange && abs(this.y - py) <= 2) {
        this.attack = true;
        this.step = 0;
        if (this.x > px) {
          this.direction = 3;
        } else if (this.x < px) {
          this.direction = 2;
        }
      } else {
        let random_move = random(1);
        if (this.x < px && abs(this.x - px) > 5) {
          if (random_move > 0.5) {
            this.direction = 0;
            this.x += this.speed + random(0.5, 1);
          }
        } else if (this.x > px) {
          this.direction = 1;
          this.x -= this.speed + random(0.5, 1);
        }

        if (this.y < py) {
          if (random_move > 0.5) {
            this.y += this.speed + random(0.5, 1);
          }
        } else {
          this.y -= this.speed + random(0.5, 1);
        }
        if (frameCount % 5 == 0) {
          this.step = (this.step + 1) % 13;
        }
      }
    }
  }
}
