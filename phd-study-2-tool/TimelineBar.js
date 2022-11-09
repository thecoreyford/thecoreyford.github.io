class TimelineBar
{

	//TODO: Comment nicely 
	//TODO: remove the hard coding 

	constructor ()
	{
		this.ellipseX = 180;
	}

	draw()
	{
		fill(djLightLightGrey);
		rect(180,150,850,30,5);

		// ellipse (this.ellipseX, 155,20,20);
		playButton.setXandY(this.ellipseX - 20,145);

		// if (mouseIsPressed === true 
		// 	&& mouseX > 180 
		// 	&& mouseX < 180 + 900
		// 	&& mouseY > 150 
		// 	&& mouseY < 150 + 30) 
		// {
			let myColour = color(red);
			myColour.setAlpha(80);
			fill(myColour);
			rect (this.ellipseX - 3, 150, 5, 600, 5);
		// }

		// rect(this.ellipseX,150,900 - (this.ellipseX - 300),12,5);
	}

	mousePressed()
	{
		if (mouseX > 180 
			&& mouseX < 180 + 850 
			&& mouseY > 150 
			&& mouseY < 150 + 30) {
			this.ellipseX = mouseX;
		}
	}

	getX()
	{
		return this.ellipseX; 
	}
}