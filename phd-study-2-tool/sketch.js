/**
 * @file Main file for p5js sketch.
 * @author Corey Ford
 */

//========================================================================================

// VARIABLES

const canvasWidth = 1410;
const canvasHeight = 870; //580;

const workspaceX = 60; //canvasWidth * 0.10; //125
const workspaceY = 130; //canvasHeight * 0.15; //117
const workspaceWidth = 1050; //canvasWidth - (2 * workspaceX); //1000
const workspaceHeight = 620; //canvasHeight - (2 * workspaceY); //546
const workspace2X = workspaceX + 35 + 45; //canvasWidth * 0.10; //125
const workspace2Y = 200; //canvasHeight * 0.15; //117
const workspace2Width = workspaceWidth - 80 - 45; //canvasWidth - (2 * workspaceX); //1000
const workspace2Height = 130; //canvasHeight - (2 * workspaceY); //546
var workspace  = [new Workspace(workspaceX, 
							   workspaceY, 
							   workspaceWidth, 
							   workspaceHeight,-1, djBlack),
					new Workspace(workspace2X, 
							   workspace2Y, 
							   workspace2Width, 
							   workspace2Height, -2, djLightLightGrey, djOrange),
					new Workspace(workspace2X, 
								  workspace2Y + 200, 
								  workspace2Width, 
								  workspace2Height, -3,  djLightLightGrey, djGreen2),
					new Workspace(workspace2X, 
								  workspace2Y + 400, 
								  workspace2Width, 
								  workspace2Height, -4,  djLightLightGrey, djPink)];

// var blockCreator = new BlockCreator(workspace[0].getX() + 60,
// 									workspace[0].getY() + 10,
// 									40,
// 									40);

var playButton = new PlayButton(workspace[0].getX() + 10,
								workspace[0].getY() + 10,
								45,
								45);

var bin = new Bin(workspace[0].getX() + workspace[0].getWidth() + 220, 
				  20 + workspace[0].getHeight() + 130, 
				  70, 85);

var timeline = new TimelineBar();

let musicBlocks = []; //< Array of current blocks

var aiBlockCreator = new AIBlockCreator(); //< Class spawns in AI blocks

var musicMetrics = new MusicMetrics(playButton); //< NOTE: MIDI note sequences is encapsulated through the play button

var logger = new Logger();

var puzzle_image_orange, puzzle_image_pink, puzzle_image_green, binClosed, binOpen;

var blockIDTracker; 

var startTime;

var globalFlashOffset = 0.001;

var doFly = false;

//========================================================================================

// MAIN FUNCTIONS  

/**
 * Preloads images and other info before app launch.
 * @return {void} - Nothing.
 */
function preload() 
{
	blockIDTracker = 0;
	startTime = millis();
	puzzle_image_orange = loadImage("assets/puzzle-orange.png");
	puzzle_image_pink = loadImage("assets/puzzle-pink.png");
	puzzle_image_green = loadImage("assets/puzzle-green.png");
	clarinet = loadImage("assets/clarinet.png");
	piano = loadImage("assets/piano.png");
	cello = loadImage("assets/cello.png");
	binClosed = loadImage("assets/binClosed.png");
	binOpen = loadImage("assets/binOpen.png");
}

/**
 * Sets up canvas before drawing to screen.
 * @return {void} - Nothing.
 */
function setup() 
{
  musicMetrics.getCountOfColour (orange, true); //< TODO: should these be in preload
  musicMetrics.getCountOfColour (purple, true);
  musicMetrics.getCountOfColour (googGreen, true);
  createCanvas (canvasWidth, canvasHeight);
  playButton.setPlayLevelCountsAndGUI();

  // add blue blocks on load 
  musicBlocks.push (new MusicBlock(160, 215, 200, 100));
  musicBlocks.push (new MusicBlock(160, 415, 200, 100));
  musicBlocks.push (new MusicBlock(160, 615, 200, 100));
  //---
  musicBlocks.push (new MusicBlock(30, 18, 200, 100, djGreen2));
  musicBlocks.push (new MusicBlock(280, 18, 200, 100, djOrange));
  musicBlocks.push (new MusicBlock(550, 18, 200, 100, djPink));
  //---
  musicBlocks.push (new MusicBlock(35, 760, 200, 100, djPink));
  musicBlocks.push (new MusicBlock(295, 760, 200, 100, djGreen2));
  musicBlocks.push (new MusicBlock(545, 760, 200, 100, djOrange));
}

/**
 * Timer update for drawings, updating app objects.
 * @return {void} - Nothing.
 */
function draw() 
{
	// draw background with border
	strokeWeight (1);
  	stroke (0);
  	fill (djLightGrey);
  	rect (0, 0, canvasWidth, canvasHeight, 10);
	noStroke ();

	// draw the following onto the background.... 
	for (let i = 0; i < workspace.length; ++i){
		workspace[i].draw();
	}
  	bin.draw();
  	
  	for (let i = 0; i < musicBlocks.length; ++i)
  	{
		musicBlocks[i].draw();
	}

	// blockCreator.draw();

  	// every so many seconds... 
  	let elapsedTime = millis() - startTime; 
	if (elapsedTime > (25 * 1000))
	{
		logger.save();

		if (doFly)
		{
			// get ai blocks not in the workspace and AI
			clearDataset();
			processDataset("all");
			let aiBlocks = data.filter(function(d){return d["isAI"] === true;});
			aiBlocks = aiBlocks.filter(function(d){return d["x"] >= workspace[0].getWidth();});
    		// aiBlocks = aiBlocks.filter(function(d){return d["y"] >= workspace[0].getY();});
    		// aiBlocks = aiBlocks.filter(function(d){return d["x"] < workspace[0].getX()+workspace[0].getWidth();});
    		// aiBlocks = aiBlocks.filter(function(d){return d["y"] < workspace[0].getY()+workspace[0].getHeight();});

			// randomly pick one 
			if (aiBlocks.length > 0)
			{
				var idx, didInteract; 
				do
				{
					idx = int (random(0,aiBlocks.length));
					didInteract = aiBlocks[idx]["block"].getInteracted();
				}
				while (didInteract === true)
					
				// start fly 
				aiBlocks[idx]["block"].startFly();
			}
			startTime = millis();
			doFly = !doFly;
		}
		else
		{
			if (!playButton.player.isPlaying()){
				aiBlockCreator.magentaUpdate (musicBlocks);
				playButton.setPlayLevelCountsAndGUI();
				startTime = millis();
				doFly = !doFly;
			}
		}
	}

  	playButton.updatePlayback();

  	timeline.draw();
  	playButton.draw();

  	aiBlockCreator.drawCurves();

  	//instrument images for the timelines
  	image(piano, 90, 655, 50, 50);
  	image(cello, 90, 460, 50, 50);
  	image(clarinet, 88, 260, 50, 50);
}

//===========================================================================

// INTERACTIVITY

/**
 * If mouse is pressed, move blocks or trigger playback.
 * @return {void} - Nothing.
 */
function mousePressed() 
{
	// // If block creator is pressed
	// if (blockCreator.hasMouseOver()) 
	// {
	// 	musicBlocks.push (new MusicBlock(300 + random(0, 40),
	// 								     270 + random(-20,40),
	// 								     200,
	// 								     100));
	// 	logger.log(JSON.stringify({"timestamp": str(round(millis(),3)),
	// 				"blockID": musicBlocks[musicBlocks.length-1].getID(),
	// 				"blockGrid": "blank",//musicBlocks[musicBlocks.length-1].getGridArray() 
	// 				"desc": "Added non-AI block."},null, "\t") + "\n");
	// }

	// If a music block is pressed 
	for (let i = 0; i < musicBlocks.length; ++i)
	{
		musicBlocks[i].mousePressed();
	}

	// If a tiny plan button is pressed
	for (let i = 1; i < workspace.length; ++i)
	{
		workspace[i].onClicked();
	}

	timeline.mousePressed();
}

/**
 * If left arrow pressed, force new AI blocks (useful to debug)
 * @return {void} - Nothing.
 */
function keyPressed() {
  if (keyCode === LEFT_ARROW && true) {
 	// aiBlockCreator.update (musicBlocks);
 	aiBlockCreator.magentaUpdate (musicBlocks);
  }
}

//TODO: Comment
function mouseDragged() {
	timeline.mousePressed();
}

/**
 * If mouse is released, delete or stop dragging blocks.
 * @return {void} - Nothing.
 */
function mouseReleased()
{
	// If a play button is released
	playButton.mousePressed();

	// delete any blocks from the bin
	bin.mouseReleased (musicBlocks);

	// If a music block is released...
	for (let i = 0; i < musicBlocks.length; ++i)
	{
		// Stop dragging
		musicBlocks[i].mouseReleased();

		for (let j = 0; j < musicBlocks.length; ++j)
		{
			if (j != i)
			{
				let lhsBlock = musicBlocks[j];
				let rhsBlock = musicBlocks[i];

				// if there is an intersection
				if (musicBlocks[i].shouldMakeConnection(musicBlocks[j].getRightPoints()))
				{
					// Reset blocks previous connections
			        if (rhsBlock.getLeftConnection() != null)
			        {
			        	rhsBlock.getLeftConnection().setRightConnection (null);
			        	rhsBlock.setLeftConnection (null);
			        }

			        if (lhsBlock.getRightConnection() != null)
			        {
			            lhsBlock.getRightConnection().setLeftConnection(null);
			            lhsBlock.setRightConnection (null);
			            // Note: did not port all the code here but this seemed to work okay; 
			            // ...fingers crossed!
			        }
		        
			        // The right blocks input should be the left block
			        rhsBlock.setLeftConnection (lhsBlock);
			        
			        // The left blocks input output should be the right block
			        lhsBlock.setRightConnection (rhsBlock);
			        
			        // Position blocks for a more aligned snap
			        lhsBlock.updateNeighbours();
				}
			}
		}
	}
}