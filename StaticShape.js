/*

  A static shape in the game cannot move

  Static shapes are useful to define game boundries and obstacles the user
  must overcome.
 */
class StaticShape{
  var body, bodyDef, w, h;

  StaticShape(x, y, w, h){
    this.w = w;
    this.h = h;
    bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x =  x;
    bodyDef.position.y =  y;

    var fixDef = new b2FixtureDef();
    fixDef.density = 1;
    fixDef.friction = 1;
    fixDef.restitution = 0;

    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsBox(w,h);

    //add it
    body = world.CreateBody(bodyDef);
    body.CreateFixture(fixDef);
  }


  void setPosition(x,y){
    //body.SetPosition(x,y)
    //bodyDef.position.x = x;
    //bodyDef.position.y = y;
  }

  void draw(){
    strokeWeight(1);
    noFill();
    fill(230, 120, 100);

    var pos = body.GetPosition();
    pushMatrix();
    translate(pos.x * SCALE, pos.y * SCALE);
    rotate(body.GetAngle());
    rect(-(w/2) * SCALE*2,
        -(h/2) * SCALE*2 ,
        w * SCALE*2, h * SCALE *2);
    popMatrix();
  }

  void createPhysicalRep(){
    // Create Shape
    // Create Fixture
    // Create BodyDef
    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = 10;
    bodyDef.position.y = 10;

    var fixDef = new b2FixtureDef;
    fixDef.density = 1;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;

    fixDef.shape = new b2PolygonShape();
    fixDef.shape.setAsBox(10, 0.5);

    //add it
    world.CreateBody(bodyDef).CreateFixture(fixDef);
  }

}