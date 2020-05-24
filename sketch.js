var bSlider, brushVal, clr;
var btn1, btn2, btn3, indexRef, db;
var sPos = [];
var tool = "brush";
var userRef, allUsers, users, r;

function setup() {
  createCanvas(600, 450);
  db = firebase.database();
  
  db.ref('index').once('value', (data) => {
    indexRef = data.val() + 1;
    db.ref('/').set({
      index: indexRef
    });
  });

  db.ref('users').on('value', (data) => {
    allUsers = data.val();
  });

  bSlider = createSlider(3, 34, 17, 1);
  bSlider.position(30, 430);

  clr = createInput("", 'color');
  clr.position(190, 430);

  btn1 = createButton("Brush");
  btn1.position(335, 406);
  btn2 = createButton("Eraser");
  btn2.position(465, 406);
  btn3 = createButton("Clear");
  btn3.position(400, 435);
}

function draw() {
  background(255);
  rectMode(CENTER);
  ellipseMode(CENTER);
  r = bSlider.value();
  if (allUsers != null){
    users = Object.values(allUsers).length;
  }
  
  // Text
  fill("black");
  noStroke();
  textSize(15);
  text("Stroke Weight:", 35, 410);
  text("Stroke Colour:", 190, 410);

  // Strokes
  /* for (var s in sPos) {
    if (sPos[s][4] == "brush") {
      fill(sPos[s][3]);
      noStroke();
      ellipse(sPos[s][0], sPos[s][1], sPos[s][2]);
    }
    if (sPos[s][4] == "eraser") {
      fill("white");
      noStroke();
      rect(sPos[s][0], sPos[s][1], sPos[s][2], sPos[s][2]);
    }
  } */
  
  if (allUsers != null){
    for (var value of Object.values(allUsers)) {
      for (var v of Object.values(value)) {
        for (var cords of Object.values(v)) {
          noStroke();
          if (cords[4] == "eraser") {
            fill("white");
            rect(cords[0], cords[1], cords[2], cords[2]);
          }
          if (cords[4] == "brush") {
            fill(cords[3]);
            ellipse(cords[0], cords[1], cords[2]);
          }
        }
      }
    }
  }

  // Tool Indicator
  if (tool == "brush") {
    stroke("black")
    strokeWeight(1);
    fill(clr.value());
    
    if (mouseX < 600 - r / 2 && mouseX > r / 2 && mouseY < 390 - r / 2 && mouseY > r / 2) {
      ellipse(mouseX, mouseY, r);
    } else {
      ellipse(30, 360, r);
    }    
  } else if (tool == "eraser") {
    stroke("black");
    strokeWeight(1);
    fill("white");
    if (mouseX < 600 - r / 2 && mouseX > r / 2 && mouseY < 390 - r / 2 && mouseY > r / 2) {
      rect(mouseX, mouseY, r, r);
    } else {
      rect(30, 360, r, r);
    }
  }
  
  // Border
  stroke("black");
  textSize(15);
  strokeWeight(3);
  line(0, 390, 600, 390);

  // Buttons
  btn1.mousePressed(() => {
    tool = "brush";
  })

  btn2.mousePressed(() => {
    tool = "eraser";
  })

  btn3.mousePressed(() => {
    while (sPos.length > 0) {
      sPos.pop();
    }
  })

  // Update the database
  userRef = "users/user" + indexRef;
  db.ref(userRef).update({
    co_ords: sPos
  });
}

function mouseDragged() {
  if (mouseX < 600 - r / 2 && mouseX > r / 2 && mouseY < 390 - r / 2 && mouseY > r / 2) {
    sPos.push([Math.round(mouseX), Math.round(mouseY), r, clr.value(), tool]);
  }
}

function keyPressed() {
  if (keyCode == 66) {
    tool = "brush";
  } else if (keyCode == 69) {
    tool = "eraser";
  }
}