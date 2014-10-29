/**
 * TODO: rename to CandidateShape?
 */
class DrawingShape{
  var vertices;
  boolean isClosed;

  DrawingShape(){
    vertices = [];
    isClosed = false;
  }

  /**
   * Get a copy of the vertices of this shape.
   */
  ArrayList getVertices(){
    return cloneVertices(vertices);
  }

  /**
   * Add another vertex to the shape. Once the shape is closed, new vertices
   * cannot be added.
   */
  void addVertex(PVector v){
    if(isClosed){
      return;
    }
    vertices.push([v.x, v.y]);
  }

  /**
   * Tell the shape to close the loop of itself.
   */
  boolean close(){
    var numVerts = vertices.length;

    // Shape can only be closed once.
    if(isClosed || numVerts < 2){
      return;
    }
    isClosed = true;

    // Try to close the shape?
    var diffX = abs(vertices[0][0] - vertices[numVerts-1][0]);
    var diffY = abs(vertices[0][1] - vertices[numVerts-1][1]);

    // Fix this
    vertices.push([vertices[1][0], vertices[1][1]]);

    isClosed = mag(diffX, diffY) < 10.0;
    return isClosed;
  }

  void update(float delta){
  }
  
  void draw(){
    noFill();

    strokeWeight(5);
    stroke(0);

    beginShape();
    var i;
    for(i = 0; i < vertices.length; i++){
      vertex(vertices[i][0],vertices[i][1]);
    }
    endShape();
  }
}
