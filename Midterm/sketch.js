let playerSprites = [];
let skeletonSprites = [];
let enemies = [];
let playerSounds = [];
let skeletonSounds = [];
let gameSounds = [];
let stage;
let p1;
let s1;
let no_enemies = 5;
let enemy_count;

function preload() {
  //sprites
  playerSprite = loadImage("assets/player.png");
  playerSpriteFlipped = loadImage("assets/player_flipped.png");
  stageImage = loadImage("assets/dungeon.png");
  skeletonSpriteWalkRight = loadImage("assets/skeleton_walk.png");
  skeletonSpriteWalkLeft = loadImage("assets/skeleton_walk_flipped.png");
  skeletonSpriteAttackRight = loadImage("assets/skeleton_attack.png");
  skeletonSpriteAttackLeft = loadImage("assets/skeleton_attack_flipped.png");
  skeletonSpriteDieRight = loadImage("assets/skeleton_die.png");
  skeletonSpriteDieLeft = loadImage("assets/skeleton_die_flipped.png");

  //sounds
  swordSlash = loadSound("sounds/sword_slash.mp3");
  skeletonDies = loadSound("sounds/skeleton_dies.wav");
  playerDies = loadSound("sounds/player_dies.wav");
  playerScream = loadSound("sounds/player_scream.m4a")
  soundtrack = loadSound("sounds/soundtrack.wav");
   victory = loadSound("sounds/victory.mp3");

  //font
  myFont = loadFont("assets/desdemon.ttf");
}

function setup() {
  createCanvas(960, 540);
  textFont(myFont);
  imageMode(CENTER);

  // loading player sprite
  let w = playerSprite.width / 6;
  let h = playerSprite.height / 5;

  // walking right
  playerSprites[0] = [];
  for (let x = 0; x < 6; x++) {
    playerSprites[0][x] = playerSprite.get(x * w, 0 * h, w, h);
  }

  // walking left
  playerSprites[1] = [];
  for (let x = 5; x >= 0; x--) {
    playerSprites[1][5 - x] = playerSpriteFlipped.get(x * w, 0 * h, w, h);
  }

  // running right
  playerSprites[2] = [];
  for (let x = 0; x < 6; x++) {
    playerSprites[2][x] = playerSprite.get(x * w, 1 * h, w, h);
  }

  // running left
  playerSprites[3] = [];
  for (let x = 0; x < 6; x++) {
    playerSprites[3][x] = playerSpriteFlipped.get(x * w, 1 * h, w, h);
  }

  // attack right
  playerSprites[4] = [];
  for (let x = 0; x < 4; x++) {
    playerSprites[4][x] = playerSprite.get(x * w, 2 * h, w, h);
  }

  // attack left
  playerSprites[5] = [];
  for (let x = 5; x > 1; x--) {
    playerSprites[5][5 - x] = playerSpriteFlipped.get(x * w, 2 * h, w, h);
  }

  // die right
  playerSprites[6] = [];
  for (let x = 0; x < 3; x++) {
    playerSprites[6][x] = playerSprite.get(x * w, 4 * h, w, h);
  }

  // die left
  playerSprites[7] = [];
  for (let x = 5; x > 2; x--) {
    playerSprites[7][5 - x] = playerSpriteFlipped.get(x * w, 4 * h, w, h);
  }

  // loading skeleton sprite
  // .01 added because a sliver of the next sprite was showing
  w = skeletonSpriteWalkRight.width / 13.01;
  h = skeletonSpriteWalkRight.height;

  // walking right
  skeletonSprites[0] = [];
  for (let x = 0; x < 13; x++) {
    skeletonSprites[0][x] = skeletonSpriteWalkRight.get(x * w, 0 * h, w, h);
  }

  // .01 subtracted because a sliver of the next sprite was showing
  w = skeletonSpriteWalkRight.width / 12.99;
  h = skeletonSpriteWalkRight.height;

  // walking left
  skeletonSprites[1] = [];
  for (let x = 12; x >= 0; x--) {
    skeletonSprites[1][12 - x] = skeletonSpriteWalkLeft.get(x * w, 0 * h, w, h);
  }

  w = skeletonSpriteAttackRight.width / 18;
  h = skeletonSpriteAttackRight.height;

  // attacking right
  skeletonSprites[2] = [];
  for (let x = 0; x < 18; x++) {
    skeletonSprites[2][x] = skeletonSpriteAttackRight.get(x * w, 0 * h, w, h);
  }

  // attacking left
  skeletonSprites[3] = [];
  for (let x = 17; x >= 0; x--) {
    skeletonSprites[3][17 - x] = skeletonSpriteAttackLeft.get(
      x * w,
      0 * h,
      w,
      h
    );
  }

  w = skeletonSpriteDieRight.width / 15;
  h = skeletonSpriteDieRight.height;

  // die right
  skeletonSprites[4] = [];
  for (let x = 0; x <= 15; x++) {
    skeletonSprites[4][x] = skeletonSpriteDieRight.get(x * w, 0 * h, w, h);
  }
  // die right
  skeletonSprites[5] = [];
  for (let x = 15; x >= 0; x--) {
    skeletonSprites[5][15 - x] = skeletonSpriteDieLeft.get(x * w, 0 * h, w, h);
  }

  //sounds
  playerSounds.push(swordSlash);
  playerSounds.push(playerDies);
  playerSounds.push(playerScream);
  skeletonSounds.push(skeletonDies);
  gameSounds.push(soundtrack);
  gameSounds.push(victory);

  stage = new Stage(stageImage, gameSounds, width, height);
}

function draw() {
  stage.draw();

  if (stage.getStart() && !stage.getPlay()) {
    stage.startScreen();
    p1 = stage.createPlayer(playerSprites, playerSounds, 100);
    enemies = stage.createEnemies(
      skeletonSprites,
      skeletonSounds,
      no_enemies,
      stage.getSpeed()
    );
    enemy_count = no_enemies;
  } else if (stage.getPlay()) {
    if (p1.isAlive()) {
      if (frameCount % 50 == 0) {
        stage.setSpeed(stage.getSpeed() + 0.1);
        enemies.push(
          stage.createEnemy(skeletonSprites, skeletonSounds, stage.getSpeed())
        );
        enemy_count++;
      }

      for (let i = 0; i < enemy_count; i++) {
        enemies[i].update(p1.getPos(), enemies);

        if (enemies[i].getAttack() && enemies[i].getStep() == 8) {
          let enemy_pos = enemies[i].getPos();
          let p1_pos = p1.getPos();
          if (
            dist(p1_pos[0], p1_pos[1], enemy_pos[0], enemy_pos[1]) <= 30 &&
            enemies[i].getStatus()
          ) {
            p1.die();
            p1.playDying();
          }
        }

        if (enemies[i].getRemove()) {
          enemies.splice(i, 1);
          enemy_count--;
        }
      }
    }

    // drawing the player
    p1.update();

    if (p1.getRemove()) {
      stage.setLoss();
      stage.endGame();
    }

    if (enemy_count == 0 || stage.getScore() >= 50) {
      stage.setWin();
      stage.endGame();
    }
  } else if (stage.getEnd()) {
    stage.endScreen();
  }
}

function mousePressed() {
  if (stage.getPlay()) {
    p1.setAttack();
    p1.playSwordSlash();
    let p1_pos = p1.getPos();

    for (let i = 0; i < enemy_count; i++) {
      let enemy_pos = enemies[i].getPos();
      if (
        dist(p1_pos[0], p1_pos[1], enemy_pos[0], enemy_pos[1]) <= 30 &&
        enemies[i].getStatus()
      ) {
        enemies[i].die();
        enemies[i].playDying();
        stage.incScore();
        break;
      }
    }
  } else if (stage.getStart()) {
    if (
      mouseX < width / 2 + width / 18 &&
      mouseX > width / 2 - width / 18 &&
      mouseY > height / 2 - height / 20 &&
      mouseY < height / 2 + height / 20
    ) {
      stage.startGame();
    }
  } else if (stage.getEnd()) {
    // back to start screen
    if (
      mouseX < width / 2 + width / 10 &&
      mouseX > width / 2 - width / 10 &&
      mouseY > height * 0.85 - height / 24 &&
      mouseY < height * 0.85 + height / 24
    ) {
      stage.reset();
      stage.startScreen();
    }
  }
}
