
var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2AABB = Box2D.Collision.b2AABB,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;
/*

* */

debug = Debugger.getInstance(this);
debug.setOn(false);

var userWon = false;

// timing
var last = 0.0;

// The smaller this number, the more vertices there are when the user draws a shape.
const fidelity = 5;

// The current shape user drawing
var drawingShape = null;

// All the shapes in the scene.
var shapes = [];

var world = new b2World(new b2Vec2(1, -8), true);

//(width/SCALE)  = 500 pixels / 30 = 16.6 meters
// 30 pixels = 1 meter
var SCALE = 30;

// The last coords added to the drawing shape
var lastX = 0,
    lastY = 0;

// The only way right now to create a circle is to pass in vertices :(
var perfectCircle = [];
for(var i = 0; i <= 2 * PI; i += 0.2){
  perfectCircle.push( [sin(i) * 1, cos(i) * 1] );
}

var leftThingy  = [[198, 353], [214, 353], [232, 353], [248, 353], [259, 364], [258, 379], [273, 384], [289, 384], [293, 400], [293, 416], [291, 431], [290, 446], [290, 464], [290, 480], [290, 498], [290, 514], [290, 532], [290, 548], [289, 564], [278, 577], [256, 578], [230, 579], [210, 579], [195, 578], [191, 560], [191, 544], [189, 527], [186, 512], [185, 497], [185, 481], [185, 465], [184, 449], [182, 434], [182, 417], [182, 401], [182, 381], [186, 366], [191, 351], [206, 353], [214, 353]];
var rightThingy =  [[498, 341], [514, 340], [529, 339], [545, 339], [557, 349], [556, 364], [554, 380], [554, 396], [553, 411], [553, 427], [551, 443], [551, 461], [551, 477], [552, 492], [552, 508], [551, 523], [541, 535], [524, 535], [509, 534], [493, 531], [478, 529], [471, 515], [471, 499], [469, 484], [469, 468], [468, 453], [466, 438], [465, 422], [465, 406], [467, 391], [477, 379], [493, 379], [497, 364], [497, 348], [514, 340]];
    // boxy
    //[ [8,18], [8,13], [8,10],  [10,10],  [10,9], [12,9], [12,15], [12,18], [10,18], [8,18] ];
var groundVerts = [[1, 508], [16, 512], [31, 511], [45, 505], [60, 503], [74, 509], [89, 512], [104, 513], [120, 514], [136, 514], [152, 514], [168, 517], [184, 516], [200, 514], [217, 510], [235, 507], [252, 505], [268, 505], [285, 508], [300, 513], [316, 513], [333, 513], [349, 513], [365, 513], [382, 513], [397, 514], [415, 515], [433, 515], [449, 515], [466, 515], [482, 510], [497, 506], [513, 504], [530, 503], [547, 506], [563, 508], [578, 509], [593, 510], [608, 511], [625, 511], [642, 511], [658, 511], [675, 511], [691, 511], [707, 511], [723, 508], [738, 507], [755, 508], [770, 511], [786, 511], [802, 511], [818, 511], [834, 511], [849, 507], [864, 502], [877, 510], [894, 509], [900, 527], [883, 529], [864, 529], [847, 529], [825, 529], [806, 529], [787, 529], [771, 529], [754, 530], [738, 531], [722, 532], [697, 536], [675, 537], [658, 539], [640, 540], [622, 542], [606, 542], [586, 542], [565, 542], [546, 540], [523, 538], [484, 538], [452, 538], [427, 538], [409, 538], [390, 537], [367, 534], [344, 531], [328, 531], [306, 530], [274, 530], [247, 530], [231, 530], [212, 530], [194, 531], [178, 531], [158, 531], [139, 531], [113, 531], [95, 531], [74, 531], [53, 530], [38, 529], [22, 526], [7, 521], [0, 507], [16, 512]] ;

// The thing the user needs to move to the goal.
var theBall;
perfectCircle = putVertsInPixels(perfectCircle);

void setup(){
  size(800, 550);

  world.SetGravity(new b2Vec2(0, 10));

  // Create borders
  //var ground = new StaticShape(15, 18.45, 15, 0.1);
  //shapes.push(ground);

  //var leftBorder = new StaticShape(-0.13, 10, 0.1, 8);
  //shapes.push(leftBorder);

  //var rightBorder = new StaticShape(26.77, 10, 0.1, 8);
  // shapes.push(rightBorder);

  theBall = new Shape({rawVerts: perfectCircle,
    isStatic: false,
    isVisible: true,
    position: [7.8, 10.5],
    color: color(getRandomNumber(200,255), getRandomNumber(100,255), getRandomNumber(0,255), 50),
    material: {
      restitution: 0.7,
      density:     0.02,
      friction:    0.3
    }
  });
  shapes.push(theBall);

  var shape = new Shape({rawVerts: leftThingy,
    isStatic: true,
    isVisible: false,
    position: [8,15],
    color: color(getRandomNumber(200,255), getRandomNumber(100,255), getRandomNumber(100,255), 50),
    material: {
      restitution: 0.7,
      density:     Math.random(),
      friction:    Math.random()
    }
  });
  shapes.push(shape);

  /*var ground = new Shape({rawVerts: groundVerts,
    isStatic: true,
    isVisible: false,
    //position: [8,15],
    color: color(getRandomNumber(200,255), getRandomNumber(100,255), getRandomNumber(100,255), 50),
    material: {
      restitution: 0.7,
      density:     Math.random(),
      friction:    Math.random()
    }
  });
  shapes.push(ground);*/


  shape = new Shape({rawVerts: rightThingy,
    isStatic: true,
    isVisible: false,
    //position: [16, 15],
    color: color(getRandomNumber(200,255), getRandomNumber(100,255), getRandomNumber(100,255), 50),
    material: {
      restitution: Math.random(),
      density:     Math.random(),
      friction:    Math.random()
    }
  });
  shapes.push(shape);
}

void update(float delta){
  if(!userWon){
    world.Step(1/60, 10, 10);

    // To easily figure out where to add new static shapes, we map the cursor's pixel
    // coordinates to the world coordinates and output the values.
    var worldCoords = [mouseX/SCALE, mouseY/SCALE];

    debug.addString("FPS: " + Math.round(frameRate));
    debug.addString("World Coords: " + worldCoords);

    if(drawingShape){
      // If there was enough distance between the last point added and this point,
      // we can actually add the vertex to the candidate shape
      if(mag(lastX-mouseX, lastY-mouseY) > fidelity){
        drawingShape.addVertex(new PVector(mouseX, mouseY));
        lastX = mouseX;
        lastY = mouseY;
        point(mouseX, mouseY);
      }
    }

    if(drawingShape != null){
      drawingShape.update(delta);
    }
  }
}

void draw(){
  var delta = (millis() - last)/1000;
  last = millis();

  if(!userWon){
    update(delta);

    background(255, 0);

    if(drawingShape != null){
      drawingShape.draw();
    }

    for(var i = 0; i < shapes.length; i++){
      shapes[i].draw();
    }

    var scorePos = [17.3, 10];
    var bx = theBall.getPosition().x;
    var by = theBall.getPosition().y;

    // Really gross hack to cover missing hole in circle
    stroke(0);
    strokeWeight(3);
    noFill();
    ellipse(bx *SCALE, by * SCALE, 60, 60);
    // end hack

    // Draw goal
    pushMatrix();
    translate(520, 300);
    rotate(frameCount/100);
    for(var i = 0; i <= 2 * PI; i += 0.2){
      point(sin(i) * 30, cos(i) * 30);
    }
    popMatrix();

    // If we get close enough, user wins
    if(dist(bx, by, scorePos[0], scorePos[1]) < 1){
      userWon = true;
    }

    // Move the ball back in the scene if it falls off
    if(by > 20){
      theBall.setPosition(new b2Vec2(7.3, 10.65));
      theBall.setVelocity(0, 0);
    }// [7.8, 10.5],

    debug.draw();
    debug.clear();
  }
  else{
    textSize(100);
    fill(33,66,99, sin(frameCount/20)*100 + 100);
    text("You Win! Ya! :)", 70, 300)
  }
}

void toggleRender(){
  doRender = !doRender;
}

function isStatic(){
  return document.getElementById('isStatic').checked;
}

void mousePressed(){
  drawingShape = new DrawingShape();
  drawingShape.addVertex(new PVector(mouseX, mouseY));
  lastX = mouseX;
  lastY = mouseY;
}

void mouseReleased(){
  // If the user actually closed the shape, then we can create it.
  if(drawingShape.close()){

    console.log(drawingShape.getVertices());

    var shape = new Shape({rawVerts: drawingShape.getVertices(),
                           isStatic: static,
                           isVisible: true,
                           color: color(getRandomNumber(100,255), getRandomNumber(100,255), getRandomNumber(100,255), 50),
                           material: {
                                        restitution: Math.random() - 0.5,
                                        density:     Math.random(),
                                        friction:    Math.random()
                           }
                           });
    if(shape.isValid()){
      shapes.push(shape);
    }
  }

  drawingShape = null;
}