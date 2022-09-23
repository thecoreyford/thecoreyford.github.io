/** Bin object for removing blocks from the canvas. */
class Bin 
{
	/**
 	 * Constructor
	 * @param {number} x - top left x co-ordinate of the bin
	 * @param {number} y - top left y co-ordinate of the bin
	 * @param {number} width - width of the bin
	 * @param {number} height - height of the bin
 	 * @return {void} Nothing
 	 */
	constructor (x, y, width, height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	/**
 	 * Draws bin to canvas and tilts if mouse over.
 	 * @return {void} Nothing
 	 */
	draw()
	{
		tint (255, 255); //<-- always draw the bin fully opaque 

		if (mouseX > this.x 
	    	&& mouseX < this.x + this.width 
	    	&& mouseY > this.y 
	    	&& mouseY < this.y + this.height) 
		{
			image (binOpen, this.x, this.y, this.width, this.height);
		}
		else
		{
			image (binClosed, this.x, this.y, this.width, this.height);
		}	
	}

    /**
 	 * On mouse released, checks if bin should remove any blocks from array
	 * @param {array} musicBLocks - the array of music blocks in the project.
 	 * @return {void} Nothing
 	 */
	mouseReleased (musicBlocks)
	{
		let lx1 = this.x;
		let ly1 = this.y;
		let rx1 = this.x + this.width; 
		let ry1 = this.y + this.height;

		for (let i = 0; i < musicBlocks.length; i++)
		{
			let lx2 = musicBlocks[i].x; 
			let ly2 = musicBlocks[i].y; 
			let rx2 = musicBlocks[i].x + musicBlocks[i].width; 
			let ry2 = musicBlocks[i].y + musicBlocks[i].height; 

			// if a block is over the bin delete it
			if ((lx1 < rx2 || lx2 > rx1) && (ly1 < ry2 || ly2 > ry1)) 
			{   
				musicBlocks = musicBlocks.splice (musicBlocks.indexOf(musicBlocks[i]), 1);
				if (i != 0) {i = i - 1;}
			}

		}
	}

}