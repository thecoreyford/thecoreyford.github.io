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
	constructor(x, y, width, height, music_grid, defaultColour)
	{
		super(x, y, width, height)

		this.grid.setInternalButtonsFromBoolArray(music_grid);
    // this.grid.setToggleButtonColours();
		
		this.isAI = true;

    this.defaultColour = defaultColour;
	}

  /** 
   * Overridden show button with the different coloured puzzle piece image.
   * return {void} Nothing.
   */
	show() 
  	{
      if (this.x < workspace[0].getX() 
        || this.x > workspace[0].getX()+workspace[0].getWidth() 
        || this.y < workspace[0].getY() 
        || this.y > workspace[0].getY() + workspace[0].getHeight()
        || this.muteButton.isMuted)
      {
        // Block is outside of the workspace so lets make transparent 
        tint (255, 126);
        this.grid.toggleTransparency(true);
        //TODO: make this work >>>  this.tinyPlay.toggleTransparency(true);
      }
      else
      {
        tint (255, 255);
        this.grid.toggleTransparency(false);
        //break;
      }
      
      // Change whole block colours when dragged to a timeline
      for (let wks = 1; wks < workspace.length; ++wks)
        {
          if (this.x > workspace[wks].getX() 
          && this.x < workspace[wks].getX() + workspace[wks].getWidth() 
          && this.y > workspace[wks].getY() 
          && this.y < workspace[wks].getY() + workspace[wks].getHeight())
          {
            this.grid.setAllButtonOnColours (workspace[wks].getColour());
            break;
          }
          else
          {
            this.grid.setAllButtonOnColours (this.defaultColour); 
          }
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