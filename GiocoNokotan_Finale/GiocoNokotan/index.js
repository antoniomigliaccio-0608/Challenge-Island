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

// Variabili per le immagini
let imgSfondo;
let imgBuono;
let imgsCattivo = [];
let animDestra = [];
let animSinistra = [];
let currentFrame = 0;

function preload() {
  // Caricamento Sfondo
  imgSfondo = loadImage('immagini/sfondoScuola.jpg');
  
  // Caricamento altri asset
  imgBuono = loadImage('immagini/buono.png');
  imgsCattivo.push(loadImage('immagini/cattivo1.png'));
  imgsCattivo.push(loadImage('immagini/cattivo2.png'));
  
  for (let i = 1; i <= 4; i++) {
    animDestra.push(loadImage(`immagini/destra${i}.png`));
    animSinistra.push(loadImage(`immagini/sinistra${i}.png`));
  }
}

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
    y: height - 200,
    size: 160,
    direction: 'destra'
  };
}

function draw() {
  // Disegna lo sfondo (adattato alle dimensioni della finestra)
  image(imgSfondo, 0, 0, width, height);

  if (!gameOver) {
    updateGame();
    drawGame();
    drawLegend();
  } else {
    showGameOver();
  }
}

function updateGame() {
  if (hands && hands.length > 0) {
    let finger = hands[0].keypoints[9]; 
    let rawX = map(finger.x, 0, video.width, 0, width);
    let correctedX = width - rawX;
    
    let targetX = correctedX - player.size / 2;
    if (targetX > player.x + 2) player.direction = 'destra';
    else if (targetX < player.x - 2) player.direction = 'sinistra';
    
    player.x = lerp(player.x, targetX, 0.2);
    
    if (frameCount % 8 === 0) {
      currentFrame = (currentFrame + 1) % 4;
    }
  }

  spawnTimer++;
  if (spawnTimer >= spawnInterval) {
    spawnItem();
    spawnTimer = 0;
  }

  for (let i = items.length - 1; i >= 0; i--) {
    items[i].y += items[i].speed;

    let itemSize = 80;
    if (
      items[i].x < player.x + player.size * 0.75 &&
      items[i].x + itemSize > player.x + player.size * 0.25 &&
      items[i].y < player.y + player.size * 0.85 &&
      items[i].y + itemSize > player.y + player.size * 0.15
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
  let imgToShow = (player.direction === 'destra') ? animDestra[currentFrame] : animSinistra[currentFrame];
  image(imgToShow, player.x, player.y, player.size, player.size);

  for (let item of items) {
    image(item.img, item.x, item.y, 80, 80);
  }

  // UI - Sfondo semitrasparente per leggere meglio il testo sullo sfondo colorato
  fill(0, 0, 0, 150);
  rect(10, height - 75, 120, 65, 5);
  
  fill(255);
  textSize(22);
  textAlign(LEFT);
  text("Punti: " + score, 20, height - 50);
  text("Vite: " + lives, 20, height - 20);
}

function drawLegend() {
  push();
  fill(0, 0, 0, 160); // Un po' più scuro per risaltare sullo sfondo scuola
  rect(10, 10, 250, 100, 10);
  
  image(imgBuono, 20, 20, 35, 35);
  fill(255);
  textSize(16);
  textAlign(LEFT, CENTER);
  text("Prendi (Punti)", 70, 37);
  
  image(imgsCattivo[0], 20, 60, 35, 35);
  image(imgsCattivo[1], 60, 60, 35, 35);
  text("Evita (Danni)", 110, 77);
  pop();
}

function spawnItem() {
  let isGood = random() > 0.4;
  let imgSelezionata = isGood ? imgBuono : random(imgsCattivo);

  items.push({
    x: random(80, width - 80),
    y: -90,
    speed: random(3, 6),
    type: isGood ? 'good' : 'bad',
    img: imgSelezionata
  });
}

function showGameOver() {
  background(0, 230);
  fill(255);
  textAlign(CENTER);
  textSize(60);
  text("GAME OVER", width/2, height/2);
  textSize(25);
  text("Punteggio finale: " + score, width/2, height/2 + 70);
  text("Clicca per riprovare", width/2, height/2 + 120);
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