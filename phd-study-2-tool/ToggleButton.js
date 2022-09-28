/** Toggle button used for music grids inside blocks. */
class ToggleButton
{
	/**
 	 * Constructor
	 * @param {number} x - top left x co-ordinate for button
	 * @param {number} y - top left y co-ordinate for button
	 * @param {number} width - width of button
	 * @param {number} height - height of button
 	 * @return {void} Nothing
 	 */
	constructor (x, y, width, height)
	{
		this.x = x;
		this.y = y; 
		this.width = width; 
		this.height = height; 

		this.isOn = false;

		this.onColour = orange;	

		this.blocksOutside = false;
	}

/**
 	 * Setter function for button
	 * @param {number} x - the new top left x co-ordinate for button
	 * @param {number} y - the new top left y co-ordinate for button
	 * @param {number} w - the new width of button
	 * @param {number} h - the new height of button
 	 * @return {void} Nothing
 	 */
	update (x, y, w, h)
	{
		this.x = x;
		this.y = y; 
		this.width = w; 
		this.height = h; 
	}

	/**
 	 * Function drawing shapes to canvas, updated regularly
 	 * @return {void} Nothing.
 	 */
	draw()
	{
		var squareColor;

		if (this.isOn)
		{
			squareColor = color(this.onColour);
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

	/**
 	 * Getter function for whether mouse if over toggle button.
 	 * @return {bool} true if mouse if over.
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
 	 * Setter function for turning button on.
 	 * @param {string} newColour - new hex colour for the on button.
 	 * @return {void} Nothing.
 	 */
	setOnColour(newColour){ this.onColour = newColour; }

	/**
 	 * Setter function for turning button on.
 	 * @return {void} Nothing.
 	 */
	setOn(){ this.isOn = true; }

	/**
 	 * Setter function for turning button off.
 	 * @return {void} Nothing.
 	 */
	setOff(){ this.isOn = false; }
	
	/**
 	 * Toggle button to on if off, and vice versa.
 	 * @return {void} Nothing.
 	 */
	toogle()
	{
		this.isOn = !this.isOn;
	}
}