class BlockCreator
{

	constructor (x,y,width,height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	draw()
	{
		fill(darkGrey);
		rect(this.x, this.y, this.width, this.height);
		fill(lightGrey);
		rect(this.x + (this.width * 0.5) - 2.5, this.y + 5, 5, 30);
		rect(this.x + 5, this.y + (this.height * 0.5) - 2.5, 30, 5);
	}

	hasMouseOver()
	{
		if (mouseX >= this.x 
		    && mouseX <= this.x+this.width
		    && mouseY >= this.y
		    && mouseY <= this.y+this.height)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
}