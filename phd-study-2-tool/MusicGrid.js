/** A grid of toggle buttons used to represent our music. */
class MusicGrid 
{
	/**
 	 * Constructor
	 * @param {number} x - top left x co-ordinate for the music grid
	 * @param {number} y - top left y co-ordinate for the music grid
	 * @param {number} width - width of the music grid
	 * @param {number} height - height of the music grid
	 * @param {object} parent - the parent object of the music grid
 	 * @return {void} Nothing
 	 */
	constructor (x, y, width, height, parent)
	{
		this.x = x;
		this.y = y; 
		this.width = width - 10;
		this.height = height;

		this.parent = parent;

		this.gridWidth = 8;
		this.gridHeight = 8;

		this.toggleButtonColoursOnAnalysis = false;

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

	/**
 	 * Updates the position of the music grid and its buttons.
	 * @param {number} x - top left x co-ordinate for the music grid
	 * @param {number} y - top left y co-ordinate for the music grid
	 * @param {number} w - width of the music grid
	 * @param {number} h - height of the music grid
 	 * @return {void} Nothing
 	 */
	update (x, y, w, h)
	{
		this.x = x + (w * 0.075) + 5.5;
		this.y = y + (h * 0.05) + 0.1; 
		this.width = w * 0.76;
		this.height = h * 0.89;

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


	/**
 	 * Toggle if the buttons should be transparent given if a block is outside the workspace.
	 * @param {bool} isTransparent - if true set the buttons for the grid to be transparent. 
 	 * @return {void} Nothing
 	 */
	toggleTransparency(isTransparent)
	{
		for (let i = 0; i < this.toggleButtons.length; ++i)
  		{
  			this.toggleButtons[i].blocksOutside = isTransparent;
  		}
	}

	/**
 	 * Draws the grid of buttons to the canvas. 
 	 * @return {void} Nothing
 	 */
	draw()
	{
		noStroke();
		fill(darkGrey)

		if (this.toggleButtonColoursOnAnalysis){
			this.setToggleButtonColours();
		}

		rect(this.x, this.y, this.width, this.height);
  
  		for (let i = 0; i < this.toggleButtons.length; ++i)
  		{
  			this.toggleButtons[i].draw();	
  		}
	}

	/**
 	 * Whether mouse is over the music grid.
 	 * @return {bool} true is mouse is over the grid. 
 	 */
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

	/**
 	 * If mouse is pressed check if any of the buttons need to be toggled. 
 	 * @return {void} Nothing
 	 */
	mousePressed() 
	{
		for (let i = 0; i < this.toggleButtons.length; ++i)
		{
	  		if(this.toggleButtons[i].hasMouseOver())
	  		{
	  			this.parent.interacted = true;

	  			// if (this.parent.flying === false && this.parent.flying !== undefined){
	  			this.toggleButtons[i].toogle();	
	  			// }
	  			

	  			logger.log(JSON.stringify({"timestamp": str(round(millis(),3)),
										   "blockID": this.parent.getID(),
										   "blockGrid": this.parent.getGridArray(), 
										   "desc": "Toggled note",
										   "indexOfButton": str(i),
										   "setToOn": this.toggleButtons[i].isOn,
										   "isAI": this.parent.isAI}, null, "\t") 
	  									   + "\n");
	  		}	
	  	}
	}

	/**
 	 * Takes a boolean array and uses this to toggle the buttons of the musical grid as either on or off.
	 * @param {array} boolArray - an array of 1's and 0's for setting the grid values.
 	 * @return {void} Nothing
 	 */
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

	/**
 	 * Getter for the array of buttons which make up the music grid.
 	 * @return {array} of toggle buttons.
 	 */
	getInternalButtonsArray()
	{
		return this.toggleButtons;
	}

	/**
 	 * Change the on colour for all of the grids buttons. 
 	 * @return {void} nothing. 
 	 */
	setAllButtonOnColours(colour)
	{
		for (let i = 0; i < this.toggleButtons.length; ++i)
		{
			this.toggleButtons[i].setOnColour(colour);
		}
	}

	/**
 	 * Highlights patterns by changing toggle on buttons.
 	 * @return {void} nothing. 
 	 */
	setToggleButtonColours()
	{
		// Make orange to clear the palette
		for (let i = 0; i < (this.toggleButtons.length - 7); ++i){
			this.toggleButtons[i].setOnColour(orange);
		}
		
		// Check Ascending
		for (let i = 0; i < (this.toggleButtons.length - 7); ++i)
  		{
  			if (i % 8 !== 0) // ignore top row
  			{
  				let start = i; 
				let end = start + 7;
				if (this.toggleButtons[start].isOn === true 
					&& this.toggleButtons[end].isOn === true)
				{
					this.toggleButtons[start].setOnColour(googGreen);
					this.toggleButtons[end].setOnColour(googGreen);
				}
  			}
  			
  		}

  		// // Check Descending
  		// for (let i = 0; i < (this.toggleButtons.length - 9); ++i)
  		// {
  		// 	if ((i+1) % 8 !== 0) // ignore bottom row
  		// 	{
  		// 		let start = i; 
				// let end = start + 9;
				// if (this.toggleButtons[start].isOn === true 
				// 	&& this.toggleButtons[end].isOn === true)
				// {
				// 	this.toggleButtons[start].setOnColour(purple);
				// 	this.toggleButtons[end].setOnColour(purple);
				// }
  		// 	}
  			
  		// }

  // 		// Check for thirds
		// for (let i = 0; i < (this.toggleButtons.length - 2); ++i)
  // 		{
  // 			let myList = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
  // 			if (!myList.includes(i)) // ignore bottom rows
  // 			{
  // 				let start = i; 
		// 		let end = start + 2;
		// 		if (this.toggleButtons[start].isOn === true 
		// 			&& this.toggleButtons[end].isOn === true)
		// 		{
		// 			this.toggleButtons[start].setOnColour(googGreen);
		// 			this.toggleButtons[end].setOnColour(googGreen);
		// 		}
  // 			}
  // 		}

  		// Check for dissonance
		for (let i = 0; i < (this.toggleButtons.length - 1); ++i)
  		{
  			if ((i+1) % 8 !== 0) // ignore bottom row
  			{
  				let start = i; 
				let end = start + 1;
				if (this.toggleButtons[start].isOn === true 
					&& this.toggleButtons[end].isOn === true)
				{
					this.toggleButtons[start].setOnColour(purple);
					this.toggleButtons[end].setOnColour(purple);
				}
  			}
  		}


	}
}