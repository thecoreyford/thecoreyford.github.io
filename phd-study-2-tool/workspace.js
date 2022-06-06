class Workspace 
{
	
	constructor (x,y,width,height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		
	}

	getX(){return this.x;}

	getY(){return this.y;}

	getWidth(){return this.width;}

	getHeight(){return this.height;}

	draw()
	{
		fill (lightBlue);
		rect (this.x, this.y, this.width, this.height);
	}

}