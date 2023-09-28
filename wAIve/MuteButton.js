/** Small button for muting and unmuting blocks. */
class MuteButton
{
	/**
 	 * Constructor
	 * @param {number} x - top left x co-ordinate for play button
	 * @param {number} y - top left y co-ordinate for play button
	 * @param {number} width - width of play button
	 * @param {number} height - height of play button
 	 * @return {void} Nothing
 	 */
	constructor (x,y)
	{
		this.x = x;
		this.y = y;

		this.size = 21;

		this.update(this.x,this.y);

		this.isMuted = false;
	}

	/** 
	 * Updates the GUI of the play button based on its mode.
	 * @return {void} Nothing
	 */
	draw()
	{
		//TODO: unneeded repetition here 
		//TODO: check workspaces and transparency
		if (this.isMuted 
			||this.x - 10 < workspace[0].getX() 
			|| this.x - 10 > workspace[0].getX()+workspace[0].getWidth() 
			|| this.y - 6 < workspace[0].getY() 
			|| this.y -6 > workspace[0].getY() + workspace[0].getHeight())
		{
			var buttonBackground = color(lightGrey);
			buttonBackground.setAlpha(80);
			fill(buttonBackground);
			rect (this.x, this.y, this.size, this.size, 5);

			var buttonBackground = color(darkGrey);
			buttonBackground.setAlpha(80);
			fill(buttonBackground);
			textSize(18);
			text("M", this.x + 3, this.y + 17);
		}
		else
		{
			fill (lightGrey);
			rect (this.x, this.y, this.size, this.size, 5);
			fill("#000000");
			textSize(18);
			text("M", this.x + 3, this.y + 17);
		}
	}

	/** 
	 * Updates the GUI of the play button based on its mode.
	 * @return {void} Nothing
	 */
	update(x,y)
	{
		this.x = x + 10;
		this.y = y + 72;

		this.draw();
	}

	/**
 	 * Either stop or start playback if play button is pressed. 
 	 * @return {void} Nothing
 	 */
	mousePressed()
	{
		if (mouseX >= this.x 
		    && mouseX <= this.x+this.size
		    && mouseY >= this.y
		    && mouseY <= this.y+this.size)
		{
			this.isMuted = !this.isMuted;
		}
	}

}