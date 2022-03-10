class Stage {
  constructor(stageFile, sounds, w, h) {
    this.width = w;
    this.height = h;
    this.stage = stageFile;
    this.move = 0;
    this.step = 0;
    this.start = true;
    this.end = false;
    this.play = false;
    this.score = 0;
    this.endText = "";
    this.sounds = sounds;
    this.skeletonSpeed = 0.5;
  }

  draw() {
    this.sounds[0].setVolume(0.2);
    if (!this.sounds[0].isPlaying()) {
      this.sounds[0].loop();
      this.sounds[0].play();
    }

    image(this.stage, width / 2, height / 2, this.width, this.height);
    textAlign(CENTER, CENTER);
    textSize(45);
    fill(255);
    text(this.score + "/50", width * 0.5, height * 0.05);
  }

  createPlayer(playerSprites, playerSound, size) {
    return new Player(playerSprites, playerSound, size);
  }

  createEnemies(skeletonSprites, skeletonSounds, no_enemies, speed) {
    let enemies = [];
    // spawn skeletons
    for (let i = 0; i < no_enemies; i++) {
      enemies.push(new Skeleton(skeletonSprites, skeletonSounds, speed));
    }

    return enemies;
  }

  createEnemy(skeletonSprites, skeletonSounds, speed) {
    return new Skeleton(skeletonSprites, skeletonSounds, speed);
  }

  reset() {
    this.end = false;
    this.play = false;
    this.start = true;
  }
  
  getSpeed(){
    return this.skeletonSpeed;
  }
  
  setSpeed(speed){
    this.skeletonSpeed = speed;
  }

  getStart() {
    return this.start;
  }

  getEnd() {
    return this.end;
  }

  getPlay() {
    return this.play;
  }

  getScore() {
    return this.score;
  }

  setWin() {
    this.endText = "You won!";
    if(!this.sounds[1].isPlaying()){
      this.sounds[1].setVolume(0.2);
      this.sounds[1].play();
    }
  }

  setLoss() {
    this.endText = "You lost !";
  }

  incScore() {
    this.score++;
  }

  startGame() {
    this.score = 0;
    this.play = true;
    this.start = true;
    this.end = false;
  }

  endGame() {
    this.start = false;
    this.play = false;
    this.end = true;
    this.skeletonSpeed = 0.5;
  }

  startScreen() {
    background(41, 48, 59);
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    textSize(45);
    fill(151, 87, 255);
    text("Dungeons and Skeletons", width * 0.5, height * 0.15);
    fill(151, 115, 255);
    rect(width / 2, height / 2, width / 8.2, height / 8.5, 20);
    fill(48, 54, 64);
    if (
      mouseX > width / 2 - width / 18 &&
      mouseX < width / 2 + width / 18 &&
      mouseY > height / 2 - height / 20 &&
      mouseY < height / 2 + height / 20
    ) {
      fill(0);
      rect(width / 2, height / 2, width / 10, height / 10.5, 15);
    } else {
      rect(width / 2, height / 2, width / 9, height / 10, 15);
    }
    fill(151, 87, 255);
    text("Play", width / 2, height / 2);
    textSize(35);
    fill(151, 87, 255);
    text("Controls", width * 0.105, height * 0.7);
    text("Objective", width * 0.895, height * 0.7);
    textSize(30);
    fill(151, 150, 255);
    text("A", width * 0.05, height * 0.86);
    text("S", width * 0.1, height * 0.86);
    text("D", width * 0.15, height * 0.86);
    text("W", width * 0.1, height * 0.8);
    text("Left click", width * 0.26, height * 0.86);
    textSize(25);
    text("Defeat all the \nskeletons", width * 0.9, height * 0.83);
    textSize(20);
    fill(255, 150, 200);
    text("To kill", width * 0.26, height * 0.92);
    text("To move", width * 0.1, height * 0.92);
  }

  endScreen() {
    background(41, 48, 59);
    fill(151, 87, 255);
    textAlign(CENTER, CENTER);
    textSize(50);
    text(this.score, width / 2, height / 10);
    text(this.endText, width / 2, height / 2);
    if (
      mouseX > width * 0.5 - width / 10 &&
      mouseX < width * 0.5 + width / 10 &&
      mouseY > height * 0.85 - height / 20 &&
      mouseY < height * 0.85 + height / 20
    ) {
      textSize(55);
    } else {
      textSize(50);
    }
    text("Restart", width * 0.5, height * 0.85);
  }
}
