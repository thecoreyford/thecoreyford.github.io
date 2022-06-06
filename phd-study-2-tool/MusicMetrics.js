class MusicMetrics
{
	// We take the play button to help generate note sequences
	constructor (playButton)
	{
		this.playButton = playButton;
		this.buffer = [];
		this.pitchesInPeice = [];
	}

	compareStartTimes (a, b) 
	{
		if (a.startTime < b.startTime)
		{
    		return -1;
  		}
  		
  		if (a.startTime > b.startTime)
  		{
    		return 1;
  		}
  		
  		return 0;
	}

	calculateGetNotes()
	{
		processDataset() //< collect all the blocks into the dataset. 

		// Find all start blocks 
		var startBlocks = data.filter (function(d) {return d["leftConnection"] === null;});
		startBlocks = startBlocks.filter (function(d) {return d["x"] >= workspaceX;});
		startBlocks = startBlocks.filter (function(d) {return d["y"] >= workspaceY;});
		startBlocks = startBlocks.filter (function(d) {return d["x"] < workspaceX+workspaceWidth;});
		startBlocks = startBlocks.filter (function(d) {return d["y"] < workspaceY+workspaceHeight;});

		// Empty the buffer! 
		this.buffer = []; 

		// For each of the found start blocks...
		for (let i = 0; i < startBlocks.length; ++i)
		{
			var current = startBlocks[i]["block"];
			var previous;
			do
			{
				let sequence; //< have a sequence 

				// push to list 
				if (this.buffer[0] === undefined) {
					sequence = this.playButton.gridArrayToNoteSequence (current.getGridArray());

				} else {
					sequence = this.playButton.gridArrayToNoteSequence (current.getGridArray());
				}

				for(let j = 0; j < sequence.notes.length; j++)
				{
					this.buffer.push (sequence.notes[j]);
				}
				
				// step to the next node in list
				previous = current;
				current = current.nextBlock;
			} while (current != null)
		}	

		
		this.buffer = this.buffer.sort (this.compareStartTimes)
	}

	getPitchCount()
	{
		this.pitchesInPeice = [];
		for (let i = 0; i <  this.buffer.length; ++i)
		{
			if (!this.pitchesInPeice.includes (this.buffer[i].pitch))
			{
				this.pitchesInPeice.push (this.buffer[i].pitch);
			}
		}

		return this.pitchesInPeice.length;
	}

	getPitchRange()
	{
		this.getPitchCount() //< to update pitches in piece

		// Format so that math doesn't go crazy 

		// this.pitchesInPeice = Math.max.apply(Math, this.pitchesInPeice);

		return Math.abs(Math.min.apply(Math, this.pitchesInPeice) - Math.max.apply(Math, this.pitchesInPeice))
	}

	getAveragePitchInterval()
	{
		// Collect the start times in the piece
		var startTimesInPiece = [];
		for (let i = 0; i <  this.buffer.length; ++i)
		{
			if (!startTimesInPiece.includes (this.buffer[i].startTime))
			{
				startTimesInPiece.push (this.buffer[i].startTime);
			}
		}


		// Get the array of pitch intervals
		var pitchIntervals = [];
		for (let i = 0; i < startTimesInPiece.length - 1; ++i)
		{
			let curr = this.buffer.filter (function(d) {return d["startTime"] === startTimesInPiece[i];});
			let next = this.buffer.filter (function(d) {return d["startTime"] === startTimesInPiece[i+1];});

			for (let c = 0; c < curr.length; ++c)
			{
				for (let n = 0; n < next.length; ++n)
				{
					pitchIntervals.push (Math.abs (curr[c].pitch - next[n].pitch));
				}
			}

		}
		
		// calculate average 
		const sum = pitchIntervals.reduce((a, b) => a + b, 0);
		const avg = (sum / pitchIntervals.length) || 0;

		return avg
	}

	calculateMusicalDistancesForData()
	{
		// Get main values
		this.calculateGetNotes(); //<--- to be used in the functions below 
		var userPitchCount = this.getPitchCount();
		var userPitchRange = this.getPitchRange();
		var userAveragePitchInterval = this.getAveragePitchInterval();

		// Add these distances the dataset
		for (let g = 0; g < generated_data.length; ++g)
		{
			generated_data[g]["pitchCountDist"] = Math.abs(userPitchCount - generated_data[g]["pitch_count"]);
			generated_data[g]["pitchRangeDist"] = Math.abs(userPitchRange - generated_data[g]["pitch_range"]);
			generated_data[g]["averagePitchIntervalDist"] = Math.abs(userAveragePitchInterval - generated_data[g]["average_pitch_interval"]);
		}

		// this.getMostSimilarDataValues("Pitch Count");
	}

	//=========

	getMostSimiliarValues(metric)
	{
		if (metric === "pitchCount")
		{
			// sort by metric 
			generated_data = generated_data.sort((a, b) => (a.pitchCountDist > b.pitchCountDist) ? 1 : -1);

			// take the top few values 
			// var pitchCount = generated_data.filter (function(d) {
				// return d["pitchCountDist"] === generated_data[0]["pitchCountDist"];
			// });

			// return pitchCount;
		}

		if (metric === "pitchRange")
		{
			// sort by metric 
			generated_data = generated_data.sort((a, b) => (a.pitchRangeDist > b.pitchRangeDist) ? 1 : -1);

			// take the top few values 
			// var pitchRange = generated_data.filter (function(d) {
				// return d["pitchRangeDist"] === generated_data[0]["pitchRangeDist"];
			// });

			
		}

		if (metric === "averagePitchInterval")
		{
			// sort by metric 
			generated_data = generated_data.sort((a, b) => (a.averagePitchIntervalDist > b.averagePitchIntervalDist) ? 1 : -1);

			// take the top few values 
			// var averagePitchIntervalDist = generated_data.filter (function(d) {
				// return d["averagePitchIntervalDist"] === generated_data[0]["averagePitchIntervalDist"];
			// });
			
			// return averagePitchIntervalDist;
		}

		return generated_data.slice (0, 15);

	}



}



