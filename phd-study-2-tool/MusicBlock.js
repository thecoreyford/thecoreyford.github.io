

class MusicBlock
{

	constructor (x, y, width, height)
	{
		this.dragging = false; // Is the object being dragged?

	    this.x = x;
	    this.y = y;
	    this.width = width; 
	    this.height = height;

	    this.grid = new MusicGrid(this.x, this.y, this.width, this.height);
	   	this.grid.update(this.x, this.y, this.width, this.height);

	   	// connections 
	   	this.nextBlock = null;
	   	this.previousBlock = null;

	   	// playback feedback; 
	   	this.showHighlight = false; 

	   	this.isAI = false;
	}

	//=================================================================	

	// WRAPPER FOR DRAG LOGIC: 

	draw()
	{
		this.update();
		this.show();

		this.grid.draw();
	}

	mousePressed()
	{
		this.pressed();
		this.grid.mousePressed();
	}

	mouseReleased()
	{
		this.released();
	}

	//=================================================================

	// DRAG LOGIC:
	// Taken from Shiffman. See https://editor.p5js.org/codingtrain/sketches/U0R5B6Z88 .

	update() 
	{
	    // Adjust location if being dragged
	    if (this.dragging) 
	    {

	    	// undo block connections
			  if (this.previousBlock != null)
			  {
			  	  this.previousBlock.nextBlock = null
			  	  this.previousBlock = null
			  }

		      this.x = mouseX + this.offsetX;
		      this.y = mouseY + this.offsetY;
		      this.grid.update(this.x, this.y, this.width, this.height);
		      
		      this.updateNeighbours();
	    }
  	}

  	updateNeighbours()
  	{
  		var current = this.nextBlock;
  		var previous = this;

  		while(current != null)
  		{
			current.x = previous.x + previous.width - 18;
			current.y = previous.y;
			current.grid.update(current.x, current.y, current.width, current.height);

			// step to the next node in list
			previous = current;
			current = current.nextBlock;
  		}
  		
  	}

  	show() 
  	{
  		if (this.x < workspaceX 
  			|| this.x > workspaceX+workspaceWidth 
  			|| this.y < workspaceY 
  			|| this.y > workspaceY + workspaceHeight)
  		{
  			// Block is outside of the workspace so lets make transparent 
  			tint (255, 126);
  			this.grid.toggleTransparency(true);
  		}
  		else
  		{
  			tint (255, 255);
  			this.grid.toggleTransparency(false);
  		}
  		

	    image(puzzle_image, this.x, this.y, this.width, this.height);

	    if (this.showHighlight === true){
	    	let highlightColour = color(yellow);
  			highlightColour.setAlpha(80);
  			fill(highlightColour);
  			rect(this.x - 5, this.y - 2.5, this.width + 5, this.height + 5, 10);
	    }

	    // ellipse(this.x + 180, this.y, 10, 10);
	    // ellipse(this.x + this.width, this.y, 10, 10);
	    // ellipse(this.x + 180, this.y + this.height, 10, 10);
	   	// ellipse(this.x + this.width, this.y + this.height, 10, 10);

	}

	pressed() 
	{
	    // Did I click on the rectangle?
	    if (mouseX > this.x 
	    	&& mouseX < this.x + this.width 
	    	&& mouseY > this.y 
	    	&& mouseY < this.y + this.height
	    	&& this.grid.hasMouseOver() === false) {
			
			// Start dragging
			this.dragging = true;

			// If so, keep track of relative location 
			// of click to corner of rectangle
			this.offsetX = this.x - mouseX;
			this.offsetY = this.y - mouseY;
	    }
	}

  	released() 
  	{
    	this.dragging = false; // Quit dragging
  	}

  	//=================================================================

  	// CONNECTION LOGIC 

  	getLeftPoints() 
  	{
  		// both top then both bottom, left to right
	    return [this.x, this.y, 
	    		this.x + 20, this.y,
	    		this.x, this.y + this.height,
	    		this.x + 20, this.y + this.height];
  	}

  	getRightPoints() 
  	{
  		// both top then both bottom, left to right
	    return [this.x + 180, this.y, 
	    		this.x + this.width, this.y,
	    		this.x + 180, this.y + this.height,
	    		this.x + this.width, this.y + this.height,];
  	}

  	shouldMakeConnection(other) 
  	{
  		// Very helpful site here: https://www.geeksforgeeks.org/find-two-rectangles-overlap/
  		
  		let rx1 = this.getLeftPoints()[0];
  		let ry1 = this.getLeftPoints()[1];
  		let rx2 = this.getLeftPoints()[6];
  		let ry2 = this.getLeftPoints()[7];

  		let lx1 = other[0];
  		let ly1 = other[1];
  		let lx2 = other[6];
  		let ly2 = other[7];

    	if ( lx1 < rx2 
    		 && lx2 > rx1 
    		 && ly1 < ry2 
    		 && ly2 > ry1 )
        {   
    		return true;
    	}

		return false;
  	}

  	setNextBlock(newConnection) 
  	{
  		this.nextBlock = newConnection;
  	}

  	setLeftConnection(newConnection)
  	{
		this.previousBlock = newConnection; 
	}

	setRightConnection(newConnection)
	{
		this.nextBlock = newConnection; 
	}

	getLeftConnection()
	{
		return this.previousBlock; 
	}

	getRightConnection()
	{
		return this.nextBlock; 
	}

	getGridArray()
	{
		return this.grid.getInternalButtonsArray();
	}

}