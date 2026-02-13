let video;
let handpose;
let hands = [];
let player;
let items = [];
let score = 0;
let lives = 3;
let gameOver = false;
let spawnTimer = 0;
let spawnInterval = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide(); 

  let options = {
    maxHands: 1,
    runtime: 'mediapipe',
    flipHorizontal: false 
  };
  
  handpose = ml5.handPose(video, options, () => {
    console.log("Sistema pronto!");
    handpose.detectStart(video, (results) => {
      hands = results;
    });
  });

  player = {
    x: width / 2,
    y: height - 100,
    size: 60
  };
}

function draw() {
  background(44, 62, 80);

  if (!gameOver) {
    updateGame();
    drawGame();
    drawLegend(); // Disegna la leggenda sopra il gioco
  } else {
    showGameOver();
  }
}

function updateGame() {
  if (hands && hands.length > 0) {
    let finger = hands[0].keypoints[9]; 
    let rawX = map(finger.x, 0, video.width, 0, width);
    let correctedX = width - rawX;
    player.x = lerp(player.x, correctedX - player.size / 2, 0.2);
  }

  spawnTimer++;
  if (spawnTimer >= spawnInterval) {
    spawnItem();
    spawnTimer = 0;
  }

  for (let i = items.length - 1; i >= 0; i--) {
    items[i].y += items[i].speed;

    if (
      items[i].x < player.x + player.size &&
      items[i].x + 30 > player.x &&
      items[i].y < player.y + player.size &&
      items[i].y + 30 > player.y
    ) {
      if (items[i].type === 'good') score += 10;
      else {
        lives--;
        if (lives <= 0) gameOver = true;
      }
      items.splice(i, 1);
      continue;
    }
    if (items[i].y > height) items.splice(i, 1);
  }
}

function drawGame() {
  // Giocatore
  fill(52, 152, 219);
  noStroke();
  rect(player.x, player.y, player.size, player.size, 5);

  // Oggetti
  for (let item of items) {
    fill(item.color);
    rect(item.x, item.y, 30, 30, 3);
  }

  // UI Punteggio e Vite (spostata leggermente sotto la leggenda)
  fill(255);
  textSize(22);
  textAlign(LEFT);
  text("Punti: " + score, 20, height - 60);
  text("Vite: " + lives, 20, height - 30);
}

// NUOVA FUNZIONE: Disegna la leggenda in alto a sinistra
function drawLegend() {
  push();
  // Sfondo leggenda semi-trasparente
  fill(0, 0, 0, 100);
  rect(10, 10, 200, 80, 10);
  
  textSize(16);
  textAlign(LEFT, CENTER);
  
  // Voce Verde
  fill(46, 204, 113);
  rect(25, 25, 20, 20, 3);
  fill(255);
  text("Prendi (✓)", 55, 35);
  
  // Voce Rossa
  fill(231, 76, 60);
  rect(25, 55, 20, 20, 3);
  fill(255);
  text("Evita (X)", 55, 65);
  pop();
}

function spawnItem() {
  let isGood = random() > 0.4;
  items.push({
    x: random(50, width - 50),
    y: -30,
    speed: random(3, 5),
    type: isGood ? 'good' : 'bad',
    color: isGood ? color(46, 204, 113) : color(231, 76, 60)
  });
}

function showGameOver() {
  background(0, 200);
  fill(255);
  textAlign(CENTER);
  textSize(40);
  text("GAME OVER", width/2, height/2);
  textSize(20);
  text("Punteggio finale: " + score, width/2, height/2 + 50);
  text("Tocca lo schermo per riavviare", width/2, height/2 + 90);
}

function mousePressed() {
  if (gameOver) {
    score = 0;
    lives = 3;
    items = [];
    gameOver = false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}