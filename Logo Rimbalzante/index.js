let logo;
let t = 0;

let buttons = [
  { label: "Gioca", y: 0 },
  { label: "Opzioni", y: 0 },
  { label: "Esci", y: 0 }
];

function preload() {
  logo = loadImage("logo_1.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("monospace");
}

function draw() {
  drawBackground();
  drawLogo();
  drawButtons();
}

function drawBackground() {
  // cielo animato tipo Minecraft
  for (let y = 0; y < height; y++) {
    let c = lerpColor(
      color(80, 150, 255),
      color(30, 80, 180),
      y / height
    );
    stroke(c);
    line(0, y, width, y);
  }

  // nuvolette pixelate
  noStroke();
  fill(255, 255, 255, 80);
  for (let i = 0; i < 5; i++) {
    let x = (i * 300 + t * 20) % (width + 200) - 100;
    rect(x, 150 + i * 40, 120, 30);
  }

  t += 0.01;
}

function drawLogo() {
  imageMode(CENTER);

  let scaleFactor = 0.6 + sin(frameCount * 0.03) * 0.02;
  let w = logo.width * scaleFactor;
  let h = logo.height * scaleFactor;

  image(logo, width / 2, height / 4, w, h);
}

function drawButtons() {
  textAlign(CENTER, CENTER);
  textSize(32);

  let startY = height / 2;

  for (let i = 0; i < buttons.length; i++) {
    let bx = width / 2;
    let by = startY + i * 70;
    let bw = 300;
    let bh = 50;

    buttons[i].y = by;

    // hover
    let over =
      mouseX > bx - bw / 2 &&
      mouseX < bx + bw / 2 &&
      mouseY > by - bh / 2 &&
      mouseY < by + bh / 2;

    fill(over ? 200 : 160);
    stroke(40);
    strokeWeight(4);
    rectMode(CENTER);
    rect(bx, by, bw, bh);

    noStroke();
    fill(20);
    text(buttons[i].label, bx, by);
  }
}

function mousePressed() {
  for (let b of buttons) {
    if (
      mouseX > width / 2 - 150 &&
      mouseX < width / 2 + 150 &&
      mouseY > b.y - 25 &&
      mouseY < b.y + 25
    ) {
      console.log("Hai cliccato:", b.label);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
