/** Button for adding blocks to the canvas. */ 
class BlockCreator
{
	/**
 	 * Constructor
	 * @param {number} x - top left x co-ordinate of the block creator button
	 * @param {number} y - top left y co-ordinate of the block creator button
	 * @param {number} width - width of the block creator button
	 * @param {number} height - height of the block creator button
 	 * @return {void} Nothing
 	 */
	constructor (x,y,width,height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	/**
 	 * Draws the button onto the canvas.
 	 * @return {void} Nothing
 	 */
	draw()
	{
		// draw a square
		fill (darkGrey);
		rect (this.x, this.y, this.width, this.height, 5);

		// draw a plus symbol on the square... 
		fill (lightGrey);
		rect (this.x + (this.width * 0.5) - 2.5, this.y + 5, 5, 30);
		rect (this.x + 5, this.y + (this.height * 0.5) - 2.5, 30, 5);
	}

	/**
 	 * Function which returns true if mouse is over the block creator button. 
 	 * @return {bool} true is mouse is other button
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
}