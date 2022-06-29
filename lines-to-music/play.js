class Play
{
	constructor(x, y, width)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.isPlaying = false;
	}

	draw()
	{
		if (this.isPlaying === false)
		{	
			image(playpic, this.x, this.y, this.width, this.width);
		}
		else
		{
			image(stoppic, this.x, this.y, this.width, this.width);
		}
		

	}
	
	mousePressed()
	{
		if (mouseX >= this.x 
		    && mouseX <= this.x+this.width
		    && mouseY >= this.y
		    && mouseY <= this.y+this.width)
		{
			this.isPlaying = !(this.isPlaying);
			current = 0;
		}
	}
}