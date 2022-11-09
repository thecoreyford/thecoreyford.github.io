/** Workspace area for assembling blocks. */
class Workspace 
{
	/**
 	 * Constructor
	 * @param {number} x - top left x co-ordinate for workspace
	 * @param {number} y - top left y co-ordinate for workspace
	 * @param {number} width - width of workspace
	 * @param {number} height - height of workspace
 	 * @return {void} Nothing
 	 */
	constructor (x,y,width,height,id,colour=djLightGrey,secretColour=djLightGrey)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.colour = colour;
		this.secretColour = secretColour;
		this.id = id;

		
		this.tinyPlay = new TinyPlayButton(this.x - 50,
										   this.y - 5,
										   40,
										   40,
										   this.id,
										   null,
										   true);
		
	}

	/**
 	 * Getter for X co-ordinate
 	 * @return {number} x co-ordinate for workspace
 	 */
	getX(){return this.x;}

	/**
 	 * Getter for Y co-ordinate
 	 * @return {number} y co-ordinate for workspace
 	 */
	getY(){return this.y;}

	/**
 	 * Getter for width
 	 * @return {number} width of workspace
 	 */
	getWidth(){return this.width;}

	/**
 	 * Getter for height
 	 * @return {number} width of workspace
 	 */
	getHeight(){return this.height;}

	/**
 	 * Getter for height
 	 * @return {number} width of workspace
 	 */
	getID(){return this.id;}

	/**
 	 * Getter for colour
 	 * @return {string} hex colour for the workspace
 	 */
	getColour(){return this.colour;}

	/**
 	 * Getter for secret colour
 	 * @return {string} hex secret colour for the workspace
 	 */
	getSecretColour(){return this.secretColour;}

	/**
 	 * Function drawing shapes to canvas, updated regularly
 	 * @return {void} Nothing.
 	 */
	draw()
	{
		fill (this.colour);
		rect (this.x, this.y, this.width, this.height, 10);

		if (this.id !== -1)
		{
			this.tinyPlay.draw (this.x - 50, 
								this.y - 5, 
								this.tinyPlay.width, 
								this.tinyPlay.height);
		}
	}

	/**
 	 * Check the on click for tiny play buttons... 
 	 * @return {void} Nothing.
 	 */
	onClicked()
	{
		if (this.id !== -1)
		{
			this.tinyPlay.onClicked();
		}
	}

}