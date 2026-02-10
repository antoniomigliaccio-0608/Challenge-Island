let video;
let handpose;
let predictions = [];

let clicked = false;

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255, 0, 0);

  handpose = ml5.handpose(video, () => {
    console.log("✅ Handpose caricato");
  });

  handpose.on("predict", results => {
    predictions = results;
  });
}

function draw() {
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    let hand = predictions[0];

    // disegna punti della mano
    for (let p of hand.landmarks) {
      fill(0, 255, 0);
      noStroke();
      circle(p[0], p[1], 8);
    }

    let index = hand.landmarks[8]; // indice
    let thumb = hand.landmarks[4]; // pollice

    let d = dist(index[0], index[1], thumb[0], thumb[1]);

    // PINCH = CLICK
    if (d < 30 && !clicked) {
      clicked = true;
      console.log("🖱️ CLICK");
    }

    // RILASCIO
    if (d > 45) {
      clicked = false;
    }

    // evidenzia pinch
    fill(255, 0, 0);
    circle(index[0], index[1], 12);
    circle(thumb[0], thumb[1], 12);
  }

  // TESTO QUANDO CLICCHI
  if (clicked) {
    fill(255, 0, 0);
    text("Sei il più forte su vlbl", width / 2, height / 2);
  }
}
