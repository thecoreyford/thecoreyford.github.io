/** GUI Play button which also controls the playback of note block sequences.*/
class PlayButton
{
	/**
 	 * Constructor
	 * @param {number} x - top left x co-ordinate for play button
	 * @param {number} y - top left y co-ordinate for play button
	 * @param {number} width - width of play button
	 * @param {number} height - height of play button
 	 * @return {void} Nothing
 	 */
	constructor (x,y,width,height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.player = new mm.Player();

		this.midiBuffer = [];
		this.highlightBuffer = [];
		this.playhead = 0; 
		this.mode = "STOPPED"; // "PREPARE_BUFFER" || "PLAYING"
	}

	/** 
	 * Updates the GUI of the play button based on its mode.
	 * @return {void} Nothing
	 */
	draw()
	{
		if (this.mode === "PLAYING" || this.mode === "PREPARE_BUFFER") 
		{
			fill (red);
		}
		else
		{
			fill (green);
		}
		
		rect (this.x, this.y, this.width, this.height);

		fill(lightGrey);
		if (this.mode === "PLAYING" || this.mode === "PREPARE_BUFFER")
		{
			rect(this.x + 7, this.y + 7, this.width * 0.66, this.height * 0.66);

		}
		else
		{
			triangle(this.x + 7, this.y + 7, 
					 this.x + this.width - 7, (this.y + this.height * 0.5),
					 this.x + 7, this.y + this.height - 7);
		}
	}

	/**
 	 * Given the playhead position, update the play button's current mode
 	 * @return {void} Nothing
 	 */
	updatePlayback()
	{
		if (this.playhead >= this.midiBuffer.length)
		{
			this.mode = "STOPPED";
			this.playhead = 0; 
			// make sure all highlights are off... 

		}

		if (this.mode === "PREPARE_BUFFER")
		{
			let totalNotes = {notes: [], totalTime: 4};
			for (let i = 0; i < this.midiBuffer[this.playhead].length; ++i) 
			{
				// Combine the notes vertically for the blocks 
				for (let notes = 0; notes < this.midiBuffer[this.playhead][i]["notes"].length; ++notes){
					totalNotes["notes"].push(this.midiBuffer[this.playhead][i]["notes"][notes]);	
				}
				
			}

			// show highlights for blocks 
			for (let h = 0; h < this.highlightBuffer[this.playhead].length; ++h){
				this.highlightBuffer[this.playhead][h].showHighlight = true;
			}


			this.player.start(totalNotes); //< Plays the first start buffer chunk 
			this.mode = "PLAYING";
		}

		if (this.mode === "PLAYING" && !this.player.isPlaying())
		{
			// hide highlights for blocks 
			for (let h = 0; h < this.highlightBuffer[this.playhead].length; ++h){
				this.highlightBuffer[this.playhead][h].showHighlight = false;
			}

			this.playhead += 1;
			this.mode = "PREPARE_BUFFER"; //TODO: to function to stop gap.
		}

	}

	/**
 	 * Either stop or start playback if play button is pressed. 
 	 * @return {void} Nothing
 	 */
	mousePressed()
	{
		if (mouseX >= this.x 
		    && mouseX <= this.x+this.width
		    && mouseY >= this.y
		    && mouseY <= this.y+this.height)
		{

			if (this.player.isPlaying())
			{
				this.player.stop();
				this.mode = "STOPPED";
				// stop highlights 
				for (let h = 0; h < this.highlightBuffer[this.playhead].length; ++h){
					this.highlightBuffer[this.playhead][h].showHighlight = false;
				}
			}
			else
			{
				this.startPlayback();
			}
		}
	}

	/**
 	 * Start playback given the users current data.
 	 * @return {void} Nothing
 	 */
	startPlayback()
	{
		processDataset() //< collect all the blocks into the dataset. 

		// Find start blocks (filter example)
		var startBlocks = data.filter(function(d){return d["leftConnection"] === null;});
		startBlocks = startBlocks.filter(function(d){return d["x"] >= workspaceX;});
		startBlocks = startBlocks.filter(function(d){return d["y"] >= workspaceY;});
		startBlocks = startBlocks.filter(function(d){return d["x"] < workspaceX+workspaceWidth;});
		startBlocks = startBlocks.filter(function(d){return d["y"] < workspaceY+workspaceHeight;});

		// Empty the buffers! 
		this.midiBuffer = []; 
		this.highlightBuffer = [];

		// For each of the found start blocks...
		for (let i = 0; i < startBlocks.length; ++i)
		{
			var index = 0; //< keep track of the buffer index
			

			var current = startBlocks[i]["block"];
			var previous;//startBlocks[i]["block"];

			do
			{
				if (this.midiBuffer[index] !== undefined) //< should be same for highlight
				{
					// index exists 
					this.midiBuffer[index].push(this.gridArrayToNoteSequence(current.getGridArray()));
					this.highlightBuffer[index].push(current);
				}
				else
				{
					// index doesn't exist, so create the array 
					// for this chunk in the buffer 
					this.midiBuffer.push([this.gridArrayToNoteSequence(current.getGridArray())]);
					this.highlightBuffer.push([current]);
				}

				// step to the next node in list
				previous = current;
				current = current.nextBlock;
				index += 1;
			} while (current != null)
		}

		// Start the beautiful music... 
		this.playhead = 0; 
		this.mode = "PREPARE_BUFFER";
	}

	/**
 	 * For an array of buttons, calculated the corresponding MIDI note sequence
	 * @param {array} gridArray - an array of toggle buttons 
 	 * @return {void} Nothing
 	 */
	gridArrayToNoteSequence (gridArray)
	{
		// TODO: Hard-coding here is bad, but as we need the note 
		// list this will suffice for now.!

		let noteSequence = {notes: [], totalTime: 4};

		let counter = 0; 
		for (let col = 0; col < 8; ++col) // column
		{
  			for (let row = 0; row < 8; ++row) // row 
  			{
  				let midiPitch = [72, 71, 69, 67, 65, 64, 62, 60];
  				let midiStartTime = [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5];
  				let midiEndTime = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0];

  				if (gridArray[counter].isOn === true)
  				{
  					noteSequence["notes"].push({pitch: midiPitch[row], 
  												startTime: midiStartTime[col], 
  												endTime: midiEndTime[col],
  												velocity: 20});
  				}

  				counter++;
  			}
  		}

  		return noteSequence;	
	}

}