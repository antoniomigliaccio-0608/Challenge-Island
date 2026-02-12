let mappaImg, collisionImg;
let pg = { x: 2400, y: 2000, v: 5 };

// Variabili per le immagini di Yoshi
let dx1, dx2, dx3, dx4;
let sx1, sx2, sx3, sx4;
let yoshiFermo;

function preload() {
  // 1. Mappe
  mappaImg = loadImage('mappa.png'); 
  collisionImg = loadImage('bordi.png'); 

  // 2. Animazioni Yoshi (Destra)
  dx1 = loadImage('yoshisinistro1destra.png');
  dx2 = loadImage('yoshisinistro2destra.png');
  dx3 = loadImage('yoshidestro1destra.png');
  dx4 = loadImage('yoshidestro2destra.png');
  
  // 3. Animazioni Yoshi (Sinistra)
  sx1 = loadImage('yoshisinistro1sinistra.png');
  sx2 = loadImage('yoshisinistro2sinistra.png');
  sx3 = loadImage('yoshidestro1sinistra.png');
  sx4 = loadImage('yoshidestro2sinistra.png');
  
  yoshiFermo = dx1; // Immagine di default
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth(); // Per non sgranare la pixel art
}

function draw() {
  background(0, 100, 200); 

  let nuovaX = pg.x;
  let nuovaY = pg.y;
  let inMovimento = false;
  let immagineDaMostrare = yoshiFermo;

  // --- MOVIMENTO E ANIMAZIONE ---
  if (keyIsDown(RIGHT_ARROW)) {
    nuovaX += pg.v;
    inMovimento = true;
    let indice = floor(frameCount / 10) % 4;
    immagineDaMostrare = [sx1, sx2, sx3, sx4][indice];
    yoshiFermo = sx1; // Se si ferma, guarda a destra
  } 
  else if (keyIsDown(LEFT_ARROW)) {
    nuovaX -= pg.v;
    inMovimento = true;
    let indice = floor(frameCount / 10) % 4;
    immagineDaMostrare = [dx1, dx2, dx3, dx4][indice];
    yoshiFermo = dx1; // Se si ferma, guarda a sinistra
  } 
  
  if (keyIsDown(UP_ARROW)) {
    nuovaY -= pg.v;
    inMovimento = true;
    if(!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)) {
        let indice = floor(frameCount / 10) % 4;
        immagineDaMostrare = [dx1, dx2, dx3, dx4][indice];
    }
  } 
  else if (keyIsDown(DOWN_ARROW)) {
    nuovaY += pg.v;
    inMovimento = true;
    if(!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)) {
        let indice = floor(frameCount / 10) % 4;
        immagineDaMostrare = [dx1, dx2, dx3, dx4][indice];
    }
  }

  if (!inMovimento) {
    immagineDaMostrare = yoshiFermo;
  }

  // --- COLLISIONI ---
  let colorePixel = collisionImg.get(nuovaX, nuovaY);
  if (red(colorePixel) > 128) {
    pg.x = nuovaX;
    pg.y = nuovaY;
  }

  // --- CAMERA ---
  let camX = width / 2 - pg.x;
  let camY = height / 2 - pg.y;
  camX = constrain(camX, -(mappaImg.width - width), 0);
  camY = constrain(camY, -(mappaImg.height - height), 0);

  push();
  translate(camX, camY);
  
  // Disegna Mappa
  image(mappaImg, 0, 0);

  // Disegna Yoshi (al posto del rect)
  // Usiamo imageMode(CENTER) per centrare Yoshi sulle sue coordinate
  imageMode(CENTER);
  image(immagineDaMostrare, pg.x, pg.y, 200, 200); // 80, 80 è la dimensione, cambiala se serve
  imageMode(CORNER); // Reset per gli altri elementi
  
  pop();

  // Debug
  fill(255);
  text("Coordinate Yoshi: " + floor(pg.x) + ", " + floor(pg.y), 20, 20);
}