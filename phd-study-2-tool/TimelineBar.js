class TimelineBar
{

	//TODO: Comment nicely 
	//TODO: remove the hard coding 

	constructor ()
	{
		this.ellipseX = 300;
	}

	draw()
	{
		fill("#000000");
		rect(300,195,900,12,5);

		fill(green);
		ellipse (this.ellipseX, 200,20,20);

		if (mouseIsPressed === true 
			&& mouseX > 300 
			&& mouseX < 300 + 970 
			&& mouseY > 195 
			&& mouseY < 195 + 12) 
		{
			rect (this.ellipseX - 3,195,5,900,5);
		}

		rect(this.ellipseX,195,900 - (this.ellipseX - 300),12,5);
	}

	mousePressed()
	{
		if (mouseX > 300 
			&& mouseX < 300 + 900 
			&& mouseY > 195 
			&& mouseY < 195 + 12) {
			this.ellipseX = mouseX;
		}
	}

	getX()
	{
		return this.ellipseX; 
	}
}