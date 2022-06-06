class AIBlock extends MusicBlock
{
	constructor(x, y, width, height, music_grid)
	{
		super(x, y, width, height)

		this.grid.setInternalButtonsFromBoolArray(music_grid);
		
		this.isAI = true;
	}

	show() 
  	{
      if (this.x < workspaceX 
        || this.x > workspaceX+workspaceWidth 
        || this.y < workspaceY 
        || this.y > workspaceY + workspaceHeight)
      {
        // Block is outside of the workspace so lets make transparent 
        tint (255, 126);
        this.grid.toggleTransparency(true);
      }
      else
      {
        tint (255, 255);
        this.grid.toggleTransparency(false);
      }

	    image(puzzle_image2, this.x, this.y, this.width, this.height);

	    // copied over from music block so highlighting on playback is preserved 
	    if (this.showHighlight === true){
	    	let highlightColour = color(yellow);
  			highlightColour.setAlpha(80);
  			fill(highlightColour);
  			rect(this.x - 5, this.y - 2.5, this.width + 5, this.height + 5, 10);
	    }
	}
}