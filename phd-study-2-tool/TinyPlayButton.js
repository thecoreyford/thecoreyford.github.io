/** A play button which triggers to the larger play button class, to playback snippets of audio for a block..*/
class TinyPlayButton //TODO: this would be better called surrogate play button or something like that... 
{
	/**
 	 * Constructor
	 * @param {number} x - top left x co-ordinate for play button's block
	 * @param {number} y - top left y co-ordinate for play button's block
	 * @param {number} w - width of play button's block
	 * @param {number} h - height of play button's block
	 * @param {int} id - unique identifier for the block this tiny play button belongs to.
	 * @param {object} mute - the mute button also on this block
 	 * @return {void} Nothing
 	 */
	constructor(x,y,w,h,id,mute,workspace = false)
	{
		this.x = x + 10; 
		this.y = y + 6; 
		this.id = id;
		if (workspace) {
			this.width = w;
			this.height = h;
		} else {
			this.width = 20;//(id === -1) ? w || 20; 
			this.height = 20;//(id === -1) ? h || 20;
		}

		this.mute = mute; 

		this.flashing = false;
		this.flashOffset = 0.001;
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
	draw (x,y,w,h)
	{
		// update pos
		this.x = x + 10; 
		this.y = y + 6; 
		var myAlpha = 255;
		if (this.id > 0) //if it is on a block
		{
			if (this.mute !== null) 
			{

				for(let wks = 0; wks < workspace.length; wks++)
	      		{
					if (this.x - 10 < workspace[wks].getX() 
			  			|| this.x - 10 > workspace[wks].getX()+workspace[wks].getWidth() 
			  			|| this.y - 6 < workspace[wks].getY() 
			  			|| this.y -6 > workspace[wks].getY() + workspace[wks].getHeight()
			  			|| this.mute.isMuted === true)
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
		  }

  		// draw the mini playback button...
		var buttonBackground = color(veryDarkGrey);
		buttonBackground.setAlpha(255);
		fill(buttonBackground);
		if (this.flashing) //... Implement the flashing...
		{
			drawingContext.shadowBlur = 100 * sin(this.flashOffset); 
			drawingContext.shadowColor = color(207,7,70);
			this.flashOffset += 0.075;
		}
		rect (this.x, this.y, this.width, this.height, 4);
		rect (this.x, this.y, this.width, this.height, 4);
		rect (this.x, this.y, this.width, this.height, 4);
		drawingContext.shadowBlur = 0;
		
		// // ...with a triangle on it
		var triangleColour = color(white);
		triangleColour.setAlpha(myAlpha);
		fill(triangleColour);
		triangle(this.x+5, this.y+3, 
				 this.x+20-3, this.y+10,
				 this.x+5, this.y+18);
		}
		else
		{
			this.width = w; 
			this.height = h;

			if (playButton.mode === "PLAYING" || playButton.mode === "PREPARE_BUFFER") 
			{
				fill (red);
			}
			else
			{
				fill (veryDarkGrey);
			}
			
			if (this.flashing) //... Implement the flashing...
			{
				drawingContext.shadowBlur = 100 * sin(this.flashOffset); 
				drawingContext.shadowColor = color(207,7,70);
				this.flashOffset += 0.075;
			}
			rect (this.x, this.y, this.width, this.height, 5);
			rect (this.x, this.y, this.width, this.height, 5);
			rect (this.x, this.y, this.width, this.height, 5);
			drawingContext.shadowBlur = 0;
			// rect (this.x, this.y, this.width, this.height, 5);

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
				playButton.startPlayback (this.id);
			}
			else if (this.id < 0)
			{
				playButton.stopPlayback();
			}

			this.flashing = false;
		}
	}
}