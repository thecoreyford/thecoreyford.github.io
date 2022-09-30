/** Class for draggable AI blocks, extending MusicBlock. */
class AIBlock extends MusicBlock
{

  /**
   * Constructor
   * @param {number} x - top left x co-ordinate of the block
   * @param {number} y - top left y co-ordinate of the block
   * @param {number} width - width of the block
   * @param {number} height - height of the block
   * @param {array} music_grid - a boolean grid of generative music, to set the buttons
   * @return {void} Nothing.
   */
	constructor(x, y, width, height, music_grid)
	{
		super(x, y, width, height)

		this.grid.setInternalButtonsFromBoolArray(music_grid);
    this.grid.setToggleButtonColours();
		
		this.isAI = true;
	}

  /** 
   * Overridden show button with the different coloured puzzle piece image.
   * return {void} Nothing.
   */
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