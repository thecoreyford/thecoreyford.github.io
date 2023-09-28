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
	constructor(x, y, width, height, defaultColour, music_grid)
	{
		super(x, y, width, height)

		this.grid.setInternalButtonsFromBoolArray(music_grid);
    // this.grid.setToggleButtonColours();
		
		this.isAI = true;

    this.defaultColour = defaultColour;

    this.flying = false;
    this.flyPhase = 0;
    this.pendingTime = 0.0; 
    this.flyData = {"beginX": 20.0, // Initial x-coordinate
                   "beginY": 10.0, // Initial y-coordinate
                   "endX": 570.0, // Final x-coordinate
                   "endY": 320.0, // Final y-coordinate
                   "distX": 0.0, // X-axis distance to move
                   "distY": 0.0,// Y-axis distance to move
                   "exponent": 4, // Determines the curve
                   "x": 0.0, // Current x-coordinate
                   "y": 0.0, // Current y-coordinate
                   "step": 0.015, // Size of each step along the path
                   "pct": 0.0}; // Percentage traveled (0.0 to 1.0)
  }
  
  /**
   * On pressed, sets the offset values for where the mouse has selected the block. 
   * @return {void} Nothing
   */
  // pressed() //override
  // {
    // print("look!");
      // Did I click on the rectangle?
      // if (mouseX > this.x 
        // && mouseX < this.x + this.width 
        // && mouseY > this.y 
        // && mouseY < this.y + this.height
        // && this.grid.hasMouseOver() === false) {
      
      // Start dragging
      // this.dragging = true;

      // If so, keep track of relative location 
      // of click to corner of rectangle
      // this.offsetX = this.x - mouseX;
      // this.offsetY = this.y - mouseY;

      // }

      // this.tinyPlay.onClicked(); //< should this be played?.
      // this.muteButton.mousePressed();
  // }

  //TODO: Comment 
  startFly()
  {
    // get blocks in the workspace & with no right connection
    let targets = data.filter(function(d){return d["rightConnection"] === null;});
    targets = targets.filter(function(d){return d["x"] >= workspace[0].getX();});
    targets = targets.filter(function(d){return d["y"] >= workspace[0].getY();});
    targets = targets.filter(function(d){return d["x"] < workspace[0].getX()+workspace[0].getWidth();});
    targets = targets.filter(function(d){return d["y"] < workspace[0].getY()+workspace[0].getHeight();});

    if (targets.length > 0) 
    {
      // pick a block 
      let myIdx = int(random(0, targets.length));

      // update the stats 
      this.flyData.pct = 0.0;
      this.flyData.beginX = this.x;
      this.flyData.beginY = this.y;
      this.flyData.endX = targets[myIdx].x + this.width;
      this.flyData.endY = targets[myIdx].y + 5;
      this.flyData.distX = this.flyData.endX - this.flyData.beginX;
      this.flyData.distY = this.flyData.endY - this.flyData.beginY;

      this.flying = true;
      this.pendingTime = 0.0; 
      this.flyPhase = 0; 
      this.flashing = true;
    }
  }

  /** 
   * Overridden show button with the different coloured puzzle piece image.
   * return {void} Nothing.
   */
	show() 
  {
      if (this.interacted === false)
      {
          if (this.flying === true)
          {
              this.flyData.pct += this.flyData.step;
              if (this.flyData.pct < 1.0) {
                this.x = this.flyData.beginX + this.flyData.pct * this.flyData.distX;
                this.y = this.flyData.beginY 
                    + pow(this.flyData.pct, this.flyData.exponent) 
                    * this.flyData.distY;
              }
              else
              {
                if (this.flyPhase === 0)
                {
                  this.flyPhase = 1; 
                  this.flying = false;
                  this.pendingTime = millis();
                }

                if (this.flyPhase === 2)
                {
                  this.flyPhase = 0;
                  this.flying=false;
                  this.pendingTime = 0.0;
                  bin.mouseReleased (musicBlocks); //< delete
                }
                
              }

              this.grid.update(this.x + 15, this.y, this.width - 15, this.height);
          }

          if (this.flyPhase === 1)
          {
            if ((this.pendingTime - startTime) > (15 * 1000)) // after 15 seconds
            {
              // send the block away to the bin! 
              this.flyData.pct = 0.0;
              this.flyData.beginX = this.x;
              this.flyData.beginY = this.y;
              this.flyData.endX = 1337;
              this.flyData.endY = 808;
              this.flyData.distX = this.flyData.endX - this.flyData.beginX;
              this.flyData.distY = this.flyData.endY - this.flyData.beginY;
              this.flyPhase = 2;
              this.flying = true;
            }
            else
            {
              this.pendingTime = millis();
            }
          }
      }
      else
      {
        this.flashing = false;
      }

      //----- 

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
      let c = "";
      for (let wks = 1; wks < workspace.length; ++wks)
      {
        if (this.x > workspace[wks].getX() 
        && this.x < workspace[wks].getX() + workspace[wks].getWidth() 
        && this.y > workspace[wks].getY() 
        && this.y < workspace[wks].getY() + workspace[wks].getHeight())
        {
          
          c = workspace[wks].getSecretColour();
          this.grid.setAllButtonOnColours (c);
          break;
        }
        else
        {
          c = this.defaultColour;
          this.grid.setAllButtonOnColours (this.defaultColour);
        }
      }
      if(c === djGreen2){image(puzzle_image_green, this.x, this.y, this.width, this.height);}
      if(c === djOrange){image(puzzle_image_orange, this.x, this.y, this.width, this.height);}
      if(c === djPink){image(puzzle_image_pink, this.x, this.y, this.width, this.height);}          


      // copied over from music block so highlighting on playback is preserved 
      if (this.showHighlight === true){
      	let highlightColour = color(yellow);
	  		highlightColour.setAlpha(80);
	  		fill(highlightColour);
	  		rect(this.x - 5, this.y - 2.5, this.width + 5, this.height + 5, 10);
      } 

      if (this.flashing) //... Implement the flashing...
      {
        drawingContext.shadowBlur = 100 * sin(globalFlashOffset) * 0.2; 
        drawingContext.shadowColor = color(yellow);
        globalFlashOffset += 0.005;
      }

	}


  /**
   * On pressed, sets the offset values for where the mouse has selected the block. 
   * @return {void} Nothing
   */
  pressed() //override
  {
      // Did I click on the rectangle?
      if (mouseX > this.x 
        && mouseX < this.x + this.width 
        && mouseY > this.y 
        && mouseY < this.y + this.height
        && this.grid.hasMouseOver() === false) {
    

      // Start dragging
      this.dragging = true;


      this.interacted = true;

      // If so, keep track of relative location 
      // of click to corner of rectangle
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;

      }

      this.tinyPlay.onClicked(); //< should this be played?.
      // this.muteButton.mousePressed();
  }
}