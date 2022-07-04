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
			
			// bad practice showing this in here but YOLO
			for (let i = 0; i < scribbles.length; ++i){
				if(scribbles[i].bong !== undefined) {scribbles[i].bong=false;}
			}
		}
		else
		{
			image(stoppic, this.x, this.y, this.width, this.width);
			if(scribbles.length <= 0){this.isPlaying = false}; // also bad practice!
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