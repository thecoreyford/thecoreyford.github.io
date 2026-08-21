// Thanks to Natalie Freed
// https://gist.github.com/nataliefreed/89da12ee81c2846ce4bdb4027f58696c

function curveBetween(x1, y1, x2, y2, d, h, flip, colour) {
  
  noFill();
  strokeWeight(4);
  stroke(colour);

  //find two control points off this line
  var original = p5.Vector.sub(createVector(x2, y2), createVector(x1, y1));
  var inline = original.copy().normalize().mult(original.mag() * d);
  var rotated = inline.copy().rotate(radians(90)+flip*radians(180)).normalize().mult(original.mag() * h);
  var p1 = p5.Vector.add(p5.Vector.add(inline, rotated), createVector(x1, y1));
  //line(x1, y1, p1.x, p1.y); //show control line
  rotated.mult(-1);
  var p2 = p5.Vector.add(p5.Vector.add(inline, rotated).mult(-1), createVector(x2, y2));
  //line(x2, y2, p2.x, p2.y); //show control line
  bezier(x1, y1, p1.x, p1.y, p2.x, p2.y, x2, y2)
}

