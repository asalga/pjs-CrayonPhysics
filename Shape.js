/**
 * A shape can be be dynamic (it can move around and rotate) or
 * it can be static.
 *
 */

// body.GetPosition();
//
//
// world.CreateBody()
// world.DestroyBody
class Shape{

  // Box2D body object.
  var body;

  var triangles;
  var deleteMe;
  var lifeTime;

  // In most cases shapes will be visible, but we may want to have the
  // borders of the scene invisible
  var isVisible;

  // If the object is static, it does not move or rotate.
  var isStatic;

  // Geometric center of the shape.
  var center = [0, 0];
  var pos = [0,0];

  var col;

  var isValid;

  // Used for debugging and profiling
  var numFixtures = 0;
  /**
   * config
   *
   * rawVerts in pixels
   * isVisible - useful for borders (not used yet)
   * isStatic
   * col - color
   *
   */
  Shape(config){
    var last,
        sum,
        lifeTime = 0;

    // Get the configuration data
    rawVerts = cloneVertices(config.rawVerts);

    isVisible = config.isVisible;
    isStatic = config.isStatic;

    col = config.color;
    deleteMe = false;
    valid = true;

    // Place the vertices in world space.
    for(var i in rawVerts){
      rawVerts[i][0] /= SCALE;
      rawVerts[i][1] /= SCALE;
    }

    // For now we keep things simple and create a triangle fan of fixtures
    // which compose the body. For that, we need to figure out the center of
    // the shape.
    center = getCenter(rawVerts);

    //
    pos = config.position  || center;

    // Move the shape to the origin
    for(var i = 0; i < rawVerts.length; i++){
      rawVerts[i][0] -= center[0];
      rawVerts[i][1] -= center[1];
    }

    // Figure out if the list of vertices are clockwise. We need to construct
    // the triangles in a counter clockwise order because that's what box2d
    // expects.
    sum = 0;
    for(var i = 1; i < rawVerts.length; i++){
      var v1 = rawVerts[i-1];
      var v2 = rawVerts[i];
      sum += (v2[0] - v1[0]) * (v2[1] + v1[1]);
    }

    // If the sum is greater than 0, the vertices are clockwise and we need
    // to convert that to counter-clockwise.
    if(sum > 0){
      rawVerts.reverse();
    }

    var vertices = rawVerts;

    // Create a triangle fan from the vertices
    last = null;
    triangles = [];

    for(var i = 0; i < vertices.length-1; i += 1){
      var triangle = [];

      if(last === null){
        triangle.push( {x: vertices[i][0], y: vertices[i][1]} );
      }
      else{
        triangle.push( {x: vertices[last][0], y: vertices[last][1]} );
      }

      triangle.push( {x: vertices[i+1][0], y: vertices[i+1][1] } );
      triangle.push( {x: 0, y: 0} );

      triangles.push(triangle);
      last = i + 1;
    }

    // Box2D goodness
    var bodyDef = new b2BodyDef();
    bodyDef.type = isStatic ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;

    console.log(pos[0]);

    bodyDef.position.x = pos[0]
    bodyDef.position.y =  pos[1];

    body = world.CreateBody(bodyDef);
    //body.SetPosition(b2Vec());

    // TODO: change this to use a material
    var fixDef = new b2FixtureDef;
    fixDef.density = config.material.density;
    fixDef.friction = config.material.friction;
    fixDef.restitution = config.material.restitution;

    try{
      // Create the triangles in box2D
      for (var j = 0; j < triangles.length-1; j++) {
        var points = triangles[j];

        var one = new b2Vec2();
        one.Set(points[0].x, points[0].y);

        var two = new b2Vec2();
        two.Set(points[1].x, points[1].y);

        var three = new b2Vec2();
        three.Set(points[2].x, points[2].y);

        var vecs = [one, two, three];
        //for (var i = 0; i < points.length; i++) {
          //console.log(j);
          //var vec = new b2Vec2();
          //vec.Set(points[i].x, points[i].y);
          //vecs[i] = vec;
        //}
        fixDef.shape = new b2PolygonShape();
        fixDef.shape.SetAsArray(vecs, vecs.length);
        body.CreateFixture(fixDef);
        numFixtures++;
      }
      }catch(exception){
        console.log('Created invalid shape');
        deleteMe = true;
        valid = false;
      }
  }

  boolean isValid(){
    return valid;
  }


  /**
   *  !!! need implementation
   */
  void mustRemove(){
    return deleteMe;
  }

  /***
   * Remove the Box2D physical object
   */
  void remove(){
    if(body){
      world.DestroyBody(body);
      body = null;
    }
  }

  void setVelocity(x,y){
    body.SetLinearVelocity(new b2Vec2(x,y));
  }

  void setPosition(bvec){
    body.SetPosition(bvec);
  }

  Array getPosition(){
    return body.GetPosition();
  }


  /**
   *
   */
  void draw(){
    lifeTime++;

    if(!body){
      return;
    }

    // This is a bit convoluted. Essentially, if debugging is on,
    // render the shapes no matter what.
    if((!doRender || !isVisible) && !debug.isOn()){
      return;
    }

    var pos = body.GetPosition();
    var fixtures = body.GetFixtureList();

    pushMatrix();

    translate(pos.x * SCALE, pos.y * SCALE);
    rotate(body.GetAngle());

    // If debugging is on, we want to see all the individual triangles which
    // compose the body.
    if(debug.isOn()){
      strokeWeight(1);
      stroke(0);
      fill(col);

      for(var i = 0; i < triangles.length-1; i++){
        triangle( 0, 0,
                  triangles[i][0].x * SCALE, triangles[i][0].y * SCALE,
                  triangles[i+1][0].x * SCALE, triangles[i+1][0].y * SCALE);
      }
    }
    // If debugging is off, draw the body normally.
    else{
      strokeWeight(3);
      stroke(0);
      fill(col);

      // TODO: This can probably be faster if this was an image.
      beginShape();
      for(var i = 0; i < triangles.length-1; i++){
        vertex(triangles[i][0].x * SCALE, triangles[i][0].y * SCALE);
        vertex(triangles[i+1][0].x * SCALE, triangles[i+1][0].y * SCALE);
      }
      endShape(TRIANGLE_FAN);
    }
    popMatrix();

    // Draw goal
  }

  void setVisible(vis){
    visible = vis;
  }
}