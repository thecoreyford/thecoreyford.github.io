class Pen
{
	constructor(x, y, width)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.isPen = true;
	}

	draw()
	{
		if (this.isPen === true)
		{	
			image(penpic, this.x, this.y, this.width, this.width);
		}
		else
		{
			image(rubberpic, this.x, this.y, this.width, this.width);
		}
	}
	
	mousePressed()
	{
		if (mouseX >= this.x 
		    && mouseX <= this.x+this.width
		    && mouseY >= this.y
		    && mouseY <= this.y+this.width)
		{
			this.isPen = !(this.isPen);
		}
	}
}