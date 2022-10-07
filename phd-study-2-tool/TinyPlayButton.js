/** A play button which triggers to the larger play button class, to playback snippets of audio for a block..*/
class TinyPlayButton
{
	/**
 	 * Constructor
	 * @param {number} x - top left x co-ordinate for play button's block
	 * @param {number} y - top left y co-ordinate for play button's block
	 * @param {number} w - width of play button's block
	 * @param {number} h - height of play button's block
	 * @param {int} id - unique identifier for the block this tiny play button belongs to.
 	 * @return {void} Nothing
 	 */
	constructor(x,y,w,h,id)
	{
		this.x = x + 10; 
		this.y = y + 6; 
		this.id = id;
		if(id === -2){
			this.width = w;
			this.height = h;
		}else{
			this.width = 20;//(id === -1) ? w || 20; 
			this.height = 20;//(id === -1) ? h || 20;
		}
		
	}

	/**
 	 * Constructor
	 * @param {number} x - top left x co-ordinate for play button's block
	 * @param {number} y - top left y co-ordinate for play button's block
	 * @param {number} w - width of play button's block
	 * @param {number} h - height of play button's block
	 * @param {int} id - unique identifier for the block this tiny play button belongs to.
 	 * @return {void} Nothing
 	 */
	draw(x,y,w,h)
	{
		// update pos
		this.x = x + 10; 
		this.y = y + 6; 
		// this.width = w; 
		// this.height = h; 
		var myAlpha = 255;
		if(this.id !== -2) //< if we are not looking at the block stack... . 
		{
			for(let wks = 0; wks < workspace.length; wks++)
      		{
				if (this.x - 10 < workspace[wks].getX() 
		  			|| this.x - 10 > workspace[wks].getX()+workspace[wks].getWidth() 
		  			|| this.y - 6 < workspace[wks].getY() 
		  			|| this.y -6 > workspace[wks].getY() + workspace[wks].getHeight())
		  		{
		  			// Button is outside of the workspace so lets make transparent 
		  			myAlpha = 50;
		  		}
		  		else
		  		{
		  			myAlpha = 255;
		  			break;
		  		}
		  	}

	  		// draw the mini playback button...
			var buttonBackground = color(green);
			buttonBackground.setAlpha(myAlpha);
			fill(buttonBackground);
			rect(this.x, this.y, this.width, this.height,4);
			
			// ...with a triangle on it
			var triangleColour = color(white);
			triangleColour.setAlpha(myAlpha);
			fill(triangleColour);
			triangle(this.x+5, this.y+3, 
					 this.x+20-3, this.y+10,
					 this.x+5, this.y+18);
		}
		else
		{
			if (playButton.mode === "PLAYING" || playButton.mode === "PREPARE_BUFFER") 
			{
				fill (red);
			}
			else
			{
				fill (green);
			}
			
			rect (this.x, this.y, this.width, this.height, 5);

			fill(lightGrey);
			if (playButton.mode === "PLAYING" || playButton.mode === "PREPARE_BUFFER")
			{
				rect (this.x + 7, this.y + 7, this.width * 0.66, this.height * 0.66);

			}
			else
			{
				triangle (this.x + 7, this.y + 7, 
						  this.x + this.width - 7, (this.y + this.height * 0.5),
						  this.x + 7, this.y + this.height - 7);
			}
		}
	}

	/**
 	 * If clicked, play block with said ID.
 	 * @return {void} Nothing
 	 */
	onClicked()
	{
		if (mouseX > this.x 
			&& mouseX < this.x + this.width 
			&& mouseY > this.y 
			&& mouseY < this.y + this.height) {

			if (playButton.mode === "STOPPED")
			{
				playButton.startPlayback(this.id);
			}
			else if (this.id === -2)
			{
				playButton.stopPlayback();
			}
		}
	}
}