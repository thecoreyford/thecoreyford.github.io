/** GUI Play button which also controls the playback of note block sequences.
	It also acts as the playback engine e.g. any playback triggered must go through the playback block.*/

var highlightTrackerIdx = 0;

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

		// this.player = new mm.Player();
		this.player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');

		this.midiBuffer = [];
		this.highlightBuffer = [];
		this.highlights = [];
		this.mode = "STOPPED"; // "PREPARE_BUFFER" || "PLAYING"
		this.callbackObject  = {run: function()
									{
										highlightTrackerIdx++;										
									}, 
							   stop: function(){}};
		this.player.callbackObject = this.callbackObject; 


		this.playLevelCounts = {"all": 0, "timeline": 0,  "block": 0};

		this.flashing = false;

		// for playhead movement
		this.timelineStartOffset = 25;
		this.shiftAmount = 10;
		this.prevHighTracker = 0;
	}

	/** 
	 * Updates the GUI of the play button based on its mode.
	 * @return {void} Nothing
	 */
	draw()
	{

		if (this.mode === "PLAYING")
		{
			if (musicBlocks.length <= 9)
			{
				this.shiftAmount += 1.5;				
			}
			else
			{
				this.shiftAmount += 2.5;
			}

		}

		// Play button GUI
		if (this.mode === "PLAYING") 
		{			
			fill (red);
		}
		else
		{
			fill (lightGrey);
		}
		
		if (this.flashing) //... Implement the flashing...
		{
			drawingContext.shadowBlur = 100 * sin(globalFlashOffset); 
			drawingContext.shadowColor = color(yellow);
			globalFlashOffset += 0.075;
		}
		rect (this.x, this.y, this.width, this.height, 5);
		rect (this.x, this.y, this.width, this.height, 5);
		rect (this.x, this.y, this.width, this.height, 5);
		drawingContext.shadowBlur = 0;


		// fill(djLightGrey);
		if (this.mode === "PLAYING")
		{
			fill(lightGrey);
			rect(this.x + 7, this.y + 7, this.width * 0.66, this.height * 0.66);

			if (highlightTrackerIdx !== 0)
			{
				try
				{
					// figure out the boundary for showing highlights 
					let currTime = this.highlights[0][highlightTrackerIdx-1]["time"] + 0.5; 
					currTime = 4.0*Math.ceil(currTime/4.0);
					// print(highlightTrackerIdx-1, (" : ") ,currTime);
					
					// Turn off highlights --- removed for optimised
					// for (let i = 0; i < data.length; ++i){
					// 	data[i]["block"].showHighlight = false;
					// }

					// filter the blocks that need to be turned on
					// change below to === current time for not continuing highlighting 
					let c = this.highlights[0].filter(function(d){return d["elapsed"] <= currTime;});
					// c = c.filter(function(d){return d["time"] >/ (currTime-4.0);});
					for (let i = 0; i < c.length; ++i){
						c[i]["block"].showHighlight = true;

						// do things for the playhead GUI
						// let blks = data.filter(function(d){return timeline.getX() >= d["x"]
						// 				  			  && timeline.getX() <= d["x"]
						// 				  			  	 + d["block"].width});
						if (this.prevHighTracker !== currTime)
						{
							this.shiftAmount = 0;
							this.prevHighTracker = currTime;
						}
						timeline.setX(c[i]["block"]["x"] 
									  + this.timelineStartOffset
									  + this.shiftAmount);
					}
				}
				catch(err){}
			}
		}
		else
		{
			fill(djLightGrey);
			triangle(this.x + 7, this.y + 7, 
					 this.x + this.width - 7, (this.y + this.height * 0.5),
					 this.x + 7, this.y + this.height - 7);
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
				this.stopPlayback();
			}
			else
			{
				this.startPlayback(-1);
			}

			this.flashing = false;
		}
	}

	/**
 	 * Start playback given the users current data.
 	 * 
 	 * @return {void} Nothing
 	 */
	startPlayback(id, returnNoteSequence = false)
	{
		processDataset("all") //< collect all the blocks into the dataset. 

		highlightTrackerIdx = 0;
		// Empty the buffers! 
		this.highlightBuffer = [];
		this.midiBuffer = [];
		this.highlights = [[]];

		// Find start blocks (filter example)
		var startBlocks;
		if (id < 0)
		{
			if(returnNoteSequence === true) {
				// Count up all the start blocks and play the entire piece!!!
				startBlocks = data.filter(function(d){return d["leftConnection"] === null;});
			}else{
				//Find blocks where timeline.getX() is between X and X + block.width; 
				startBlocks = data.filter(function(d){return timeline.getX() >= d["x"]
										   && timeline.getX() <= d["x"]+d["block"].width});
			}			

			let workspaceID = -1;
			if (id === -1) { //TODO: this is bad hard-coding but seems to work so meh...
				workspaceID = 0; 
				this.playLevelCounts["all"] = this.playLevelCounts["all"] + 1;
			} else if (id === -2) { 
				workspaceID = 1; 
				this.playLevelCounts["timeline"] = this.playLevelCounts["timeline"] + 1;
			}
			else if (id === -3) {
				workspaceID = 2;
				this.playLevelCounts["timeline"] = this.playLevelCounts["timeline"] + 1;
			} else {
				workspaceID = 3;
				this.playLevelCounts["timeline"] = this.playLevelCounts["timeline"] + 1;
			}
			startBlocks = startBlocks.filter(function(d){return d["x"] >= workspace[workspaceID].getX();});
			startBlocks = startBlocks.filter(function(d){return d["y"] >= workspace[workspaceID].getY();});
			startBlocks = startBlocks.filter(function(d){return d["x"] < workspace[workspaceID].getX()+workspace[workspaceID].getWidth();});
			startBlocks = startBlocks.filter(function(d){return d["y"] < workspace[workspaceID].getY()+workspace[workspaceID].getHeight();});

			// For each of the found start blocks...
			for (let i = 0; i < startBlocks.length; ++i)
			{
				var index = 0; //< keep track of the buffer index

				var current = startBlocks[i]["block"];
				var previous;//startBlocks[i]["block"];

				do
				{
					if (this.highlightBuffer[index] !== undefined)
					{
						// add to the master buffer 
						let x = this.gridArrayToNoteSequence (current.getGridArray(), index * 4.0, current.x, current.y)["notes"];
						for(let i = 0; i < x.length; ++i) {
							this.midiBuffer[0]["notes"].push (x[i]);
							this.highlights[0].push ({"block": current, 
													 "time": x[i]["startTime"],
													 "elapsed": 4.0*Math.ceil((x[i]["startTime"]+0.5)/4.0)});
						};

						// index exists 
						this.highlightBuffer[index].push (current);
					}
					else
					{
						if (index === 0 /* create buffer if not there */) 
						{
							this.midiBuffer.push (this.gridArrayToNoteSequence(current.getGridArray(),0,current.x, current.y));


							for(let i = 0; i < this.midiBuffer[0]["notes"].length; ++i) {
								this.highlights[0].push ({"block": current, 
													      "time": this.midiBuffer[0]["notes"][i]["startTime"],
													 	  "elapsed": 4.0*Math.ceil((this.midiBuffer[0]["notes"][i]["startTime"]+0.5)/4.0)});
							}
						} 
						else 
						{
							let x = this.gridArrayToNoteSequence(current.getGridArray(), index * 4.0,current.x, current.y)["notes"];
							for(let i = 0; i < x.length; ++i) {
								this.midiBuffer[0]["notes"].push(x[i]);
								this.highlights[0].push ({"block": current, 
													      "time": x[i]["startTime"],
														  "elapsed": 4.0*Math.ceil((x[i]["startTime"]+0.5)/4.0)});
							};
							this.midiBuffer[0]["totalTime"] = (index * 4.0) + 4.0;
						}
						
						// update trackers
						this.highlightBuffer.push([current]);
					}

					// step to the next node in list
					previous = current;
					current = current.nextBlock;
					index += 1;
				} while (current != null)
			}
		}
		else
		{
			this.playLevelCounts["block"] = this.playLevelCounts["block"] + 1;
			// only play the block requested! 
			startBlocks = data.filter(function(d){return d["id"] === id;});
			var current = startBlocks[0]["block"];	
			this.midiBuffer.push(this.gridArrayToNoteSequence(current.getGridArray(),0,current.x, current.y));
			for (let i = 0; i < this.midiBuffer[0]["notes"].length; ++i) {
								this.highlights[0].push({"block": current, 
													 	"time": this.midiBuffer[0]["notes"][i]["startTime"],
													 	"elapsed": 4.0*Math.ceil((this.midiBuffer[0]["notes"][i]["startTime"]+0.5)/4.0)});}
			this.highlightBuffer.push([current]);
		}		

		// Start the beautiful music... 
		if (startBlocks.length !== 0 && !this.player.isPlaying()
			&& returnNoteSequence === false) {
			this.highlights[0] = this.highlights[0].sort((a, b) => (a.elapsed > b.elapsed) ? 1 : -1);
			this.mode = "START_PLAYING";
		}

		if (returnNoteSequence === true)
		{
			return this.midiBuffer[0];
		}
		return null; 
	}

	/**
 	 * Given the playhead position, update the play button's current mode
 	 * @return {void} Nothing
 	 */
	updatePlayback()
	{
		if (!this.player.isPlaying() && this.mode !== "START_PLAYING")
		{
			this.mode = "STOPPED";
			this.stopPlayback();
			highlightTrackerIdx = 0;
		}

		if (this.mode === "START_PLAYING")
		{
			// do things for the playhead GUI
			let blks = data.filter(function(d){return timeline.getX() >= d["x"]
										  			  && timeline.getX() <= d["x"]
										  			  	 + d["block"].width});
			timeline.setX(blks[0]["x"] + this.timelineStartOffset);
			this.shiftAmount = 0;

			// then actually start playing
			this.player.start(this.midiBuffer[0]);
			this.mode = "PLAYING";
		}
	}

	/**
 	 * Stops current playback and updates highlights accordingly.
 	 * @return {void} Nothing
 	 */
	stopPlayback()
	{
		this.player.stop();
		this.mode = "STOPPED";
		
		// stop highlights 
		for (let h = 0; h < musicBlocks.length; h++){
			musicBlocks[h].showHighlight = false;
		}
	}

	/**
 	 * For an array of buttons, calculated the corresponding MIDI note sequence
	 * @param {array} gridArray - an array of toggle buttons 
	 * @param {float} offset - the amount to offset note values by
 	 * @return {void} Nothing
 	 */
	gridArrayToNoteSequence (gridArray, offset = 0, _x, _y)
	{

		// figure out the instrument
		let inst = -1;
		if(_x >= workspace[1].getX() 
			&& _y >= workspace[1].getY()
			&& _x < workspace[1].getX()+workspace[1].getWidth()
			&& _y < workspace[1].getY()+workspace[1].getHeight()){
			inst = 72; // Clarinet
		}	
		if(_x >= workspace[2].getX() 
			&& _y >= workspace[2].getY()
			&& _x < workspace[2].getX()+workspace[2].getWidth()
			&& _y < workspace[2].getY()+workspace[2].getHeight()){
			inst = 43; // Cello
		}
		if(_x >= workspace[3].getX() 
			&& _y >= workspace[3].getY()
			&& _x < workspace[3].getX()+workspace[3].getWidth()
			&& _y < workspace[3].getY()+workspace[3].getHeight()){
			inst = 0; // Piano
		}
		// return d["x"] >= workspace[workspaceID].getX();});
		// startBlocks = startBlocks.filter(function(d){return ;});
		// startBlocks = startBlocks.filter(function(d){return ;});
		// startBlocks = startBlocks.filter(function(d){return ;});



		// TODO: Hard-coding here is bad, but as we need the note 
		// list this will suffice for now.!

		let noteSequence = {notes: [], totalTime: 4};

		let counter = 0; 
		for (let col = 0; col < 8; ++col) // column
		{
  			for (let row = 0; row < 8; ++row) // row 
  			{
  				let midiPitch = [72, 71, 69, 67, 65, 64, 62, 60];
  				let midiStartTime = [0.0 + offset, 0.5 + offset, 1.0 + offset, 1.5 + offset, 2.0 + offset, 2.5 + offset, 3.0 + offset, 3.5 + offset];
  				let midiEndTime = [0.5 + offset, 1.0 + offset, 1.5 + offset, 2.0 + offset, 2.5 + offset, 3.0 + offset, 3.5+ offset, 4.0 + offset];

  				if (gridArray[counter].isOn === true)
  				{
  					noteSequence["notes"].push({program: inst,
  												pitch: inst === 43 ? midiPitch[row] - 24 : midiPitch[row], 
  												startTime: midiStartTime[col], 
  												endTime: midiEndTime[col],
  												velocity: 100});
  				}

  				counter++;
  			}
  		}

  		return noteSequence;	
	}



	//TODO: Comment
	setPlayLevelCountsAndGUI()
	{
		// turn off all flashing 
		this.flashing = false;
		for(let i = 1; i < 4; ++i)//TODO: No hardcoding
		{
			workspace[i].tinyPlay.flashing=false;
		}

		//-----

		// // If mostly using the timelines
		// if (this.playLevelCounts["timeline"] >= this.playLevelCounts["block"]
		// 	&& this.playLevelCounts["timeline"] >= this.playLevelCounts["all"])
		// {
		// 	// try listening to a single block
		// 	let myData = data.filter(function(d){return d["x"] >= workspace[0].getX();});
		// 	myData = myData.filter(function(d){return d["y"] >= workspace[0].getY();});
		// 	myData = myData.filter(function(d){return d["x"] < workspace[0].getX()+workspace[0].getWidth();});
		// 	myData = myData.filter(function(d){return d["y"] < workspace[0].getY()+workspace[0].getHeight();});

		// 	if (myData.length > 0){
		// 		myData[int(random(0,myData.length))]["block"].tinyPlay.flashing=true;
		// 	}	
		// } 
		/*else*/ 
		if (this.playLevelCounts["timeline"] > this.playLevelCounts["all"])
		{
			// if mostly using block things 
			// listen to everything as a whole!
			this.flashing = true;	
		}
		else //if (this.playLevelCounts["all"] < this.playLevelCounts["timeline"]) // no middles
		{
			// if listening to everything
			let myData, timelineID;
			let count = 0;
			do
			{
				timelineID = int(random(1,4));
				myData = data.filter(function(d){return d["x"] >= workspace[timelineID].getX();});
				myData = myData.filter(function(d){return d["y"] >= workspace[timelineID].getY();});
				myData = myData.filter(function(d){return d["x"] < workspace[timelineID].getX()+workspace[timelineID].getWidth();});
				myData = myData.filter(function(d){return d["y"] < workspace[timelineID].getY()+workspace[timelineID].getHeight();});
				count = count + 1;
			} while (myData.length == 0 && count !== 10)

			// listen to a timeline
			if (count !== 10) {
				workspace[timelineID].tinyPlay.flashing = true;
			}
		}

		// reset counter for next time 
		this.playLevelCounts["timeline"] = 0;
		this.playLevelCounts["block"] = 0;
		this.playLevelCounts["all"] = 0;
	}

	//TODO: Comment
	getPlayLevelCounts()
	{
		return this.PlayLevelCounts;
	}


	// TODO: Comment 
	setX(newX)
	{
		this.x = newX;
	}

	// TODO: Comment 
	setXandY(x,y)
	{
		this.x = x;
		this.y = y;
	}

	//TODO: comment
	noteSequenceToBoolArray (noteSequence, offset = 0)
	{
		// Make a blank array 
		let gridArray = [];
		for(let j = 0; j < (8 * 8); j++){
			// gridArray.push([]);
			// for(let i = 0; i < 8; i++){
			gridArray.push(0);
		}
		// }


		// thanks to 2/11/2019 by Gav's blog Find the closest number in an array JavaScript
		for (let n = 0; n < noteSequence.length; n++)
		{
			if (noteSequence[n]["startTime"] >= 4.0){
				return gridArray;
			}

			let colIdx = (((8 * (noteSequence[n]["startTime"] + 0.5)) / 4) - 1);


  			let midiPitch = [72, 71, 69, 67, 65, 64, 62, 60];
			let needle = noteSequence[n]["pitch"];
			if(needle < 60){needle = needle + 24;}; //< for the cello

			const closest = midiPitch.reduce((a, b) => {
    			return Math.abs(b - needle) < Math.abs(a - needle) ? b : a;
			});
			let rowIdx = midiPitch.indexOf(closest);

			gridArray[(int(colIdx) * 8) + rowIdx] = 1;
		}

		return gridArray;



		// let counter = 0; 
		// for (let col = 0; col < 8; ++col) // column
		// {
  // 			for (let row = 0; row < 8; ++row) // row 
  // 			{
  // 				let midiPitch = [72, 71, 69, 67, 65, 64, 62, 60];
  // 				let midiStartTime = [0.0 + offset, 0.5 + offset, 1.0 + offset, 1.5 + offset, 2.0 + offset, 2.5 + offset, 3.0 + offset, 3.5 + offset];
  // 				let midiEndTime = [0.5 + offset, 1.0 + offset, 1.5 + offset, 2.0 + offset, 2.5 + offset, 3.0 + offset, 3.5+ offset, 4.0 + offset];

  // 				if (gridArray[counter].isOn === true)
  // 				{
  // 					noteSequence["notes"].push({pitch: midiPitch[row], 
  // 												startTime: midiStartTime[col], 
  // 												endTime: midiEndTime[col],
  // 												velocity: 20});
  // 				}

  // 				counter++;
  // 			}
  // 		}

  // 		return noteSequence;	
	}


}