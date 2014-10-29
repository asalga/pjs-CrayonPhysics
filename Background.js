
void drawPaper(){
  background(255);

  // Blue horizontal lines
  stroke(0, 0, 150);
  strokeWeight(1);

  for(var i = 0; i <= height; i += 20){
    line(0, i, width, i);
  }
	
  // Red vertical line
  stroke(150, 0, 0);
  line(60, 0, 60, width);
}

