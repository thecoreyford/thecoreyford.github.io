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
		rect(180,160,850,10,5);

		// ellipse (this.ellipseX, 155,20,20);
		playButton.setXandY(this.ellipseX - 20,142.5);

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

		fill (yellow);
		rect (180,160,this.ellipseX - 180,10,5);

		textSize(20);
		let myColour2 = color(djLightGrey);
		myColour2.setAlpha(40);
		fill(myColour2);
		text("> > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > >", 180, 170);

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

	setX(newX)
	{
		this.ellipseX = newX;
	}

	shift(amount)
	{
		this.ellipseX = this.ellipseX + amount;
	}

	getX()
	{
		return this.ellipseX; 
	}
}