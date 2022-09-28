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
	constructor (x,y,width,height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
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
 	 * Function drawing shapes to canvas, updated regularly
 	 * @return {void} Nothing.
 	 */
	draw()
	{
		fill (lightBlue);
		rect (this.x, this.y, this.width, this.height, 10);
	}

}