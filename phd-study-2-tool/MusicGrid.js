class MusicGrid 
{
	constructor (x, y, width, height)
	{
		this.x = x;
		this.y = y; 
		this.width = width;
		this.height = height;

		this.gridWidth = 8;
		this.gridHeight = 8;

		this.padding = 0.5;

		this.toggleButtons = [];

		for (let j = 0; j < this.gridWidth; ++j) 
		{
  			for (let i = 0; i < this.gridHeight; ++i) 
  			{
  				this.toggleButtons.push(new ToggleButton (this.x + (this.width / this.gridWidth) * j + (this.padding * 0.5),
  			 										this.y + (this.height / this.gridHeight) * i + (this.padding * 0.5), 
  			 										(this.width / this.gridWidth) - this.padding,
  			 										(this.height / this.gridHeight) - this.padding));
  			}
  		}	
	}

	update (x, y, w, h)
	{
		this.x = x + (w * 0.075) + 5;
		this.y = y + (h * 0.05); 
		this.width = w * 0.78;
		this.height = h * 0.9;

		let counter = 0; 
		for (let j = 0; j < this.gridWidth; ++j) 
		{
  			for (let i = 0; i < this.gridHeight; ++i) 
  			{
  				this.toggleButtons[counter].update(this.x + (this.width / this.gridWidth) * j + (this.padding * 0.5),
  			 							  		   this.y + (this.height / this.gridHeight) * i + (this.padding * 0.5), 
  			 							  	       (this.width / this.gridWidth) - this.padding,
  			 							           (this.height / this.gridHeight) - this.padding);

  				counter++;
  			}
  		}	
	}

	toggleTransparency(isTransparent)
	{
		for (let i = 0; i < this.toggleButtons.length; ++i)
  		{
  			this.toggleButtons[i].blocksOutside = isTransparent;
  		}
	}

	draw()
	{
		noStroke();
		fill(darkGrey)
		rect(this.x, this.y, this.width, this.height);
  
  		for (let i = 0; i < this.toggleButtons.length; ++i)
  		{
  			this.toggleButtons[i].draw();	
  		}
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

	mousePressed() 
	{
		for (let i = 0; i < this.toggleButtons.length; ++i)
		{
	  		if(this.toggleButtons[i].hasMouseOver())
	  		{
	  			this.toggleButtons[i].toogle();
	  		}	
	  	}
	}

	setInternalButtonsFromBoolArray(boolArray)
	{
		for (let i = 0; i < boolArray.length; ++i)
		{
			if (boolArray[i] === 1)
			{
				this.toggleButtons[i].setOn();
			}
			else
			{
				this.toggleButtons[i].setOff();
			}
		}

	}

	getInternalButtonsArray()
	{
		return this.toggleButtons;
	}
}