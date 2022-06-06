class ToggleButton
{
	constructor (x, y, width, height)
	{
		this.x = x;
		this.y = y; 
		this.width = width; 
		this.height = height; 

		this.isOn = false;

		this.blocksOutside = false;
	}

	update (x, y, w, h)
	{
		this.x = x;
		this.y = y; 
		this.width = w; 
		this.height = h; 
	}

	draw()
	{
		var squareColor;

		if (this.isOn)
		{
			squareColor = color(orange);
		}
		else
		{
			squareColor = color(lightGrey);
		}

		if (this.blocksOutside === true)
  		{
  			squareColor.setAlpha (182);
  		}
  		else
  		{
  			squareColor.setAlpha (255);
  		}
		
		fill(squareColor);
		
		rect (this.x, this.y, this.width, this.height);
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

	setOn(){ this.isOn = true; }
	setOff(){ this.isOn = false; }
	
	toogle()
	{
		this.isOn = !this.isOn;
	}
}