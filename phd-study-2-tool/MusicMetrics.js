/** Wrapper for functions calculating metrics for user's music compositions*/
class MusicMetrics
{
	/**
 	 * Constructor
	 * @param {object} playButton - play button, which we use to generate note sequences from toggle button presses.
 	 * @return {void} Nothing
 	 */
	constructor (playButton)
	{
		this.playButton = playButton;
		this.buffer = [];
		this.pitchesInPeice = [];
	}

	/**
 	 * Compares time stamps and returns if bigger, smaller or equal. Used with the js sort function.
	 * @param {number} a - timestamp of first time
	 * @param {number} b - timestamp of second time 
 	 * @return {number} 1 if first start time is larger, -1 if smaller, 0 if same.
 	 */
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

	/**
 	 * Fills the buffer with the current set of notes used in the composition, for metrics to be calculated on. 
 	 * @return {void} Nothing.
 	 */
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

	/**
 	 * Counts the current number of pitches used in the composition.
 	 * @return {void} Nothing.
 	 */
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

	/**
 	 * Calculates the average pitch for the current composition. 
 	 * @return {void} Nothing.
 	 */
	getAveragePitch()
	{
		var allPitches = [];
		for (let i = 0; i <  this.buffer.length; ++i){
			allPitches.push (this.buffer[i].pitch)
		}

		// calculate average 
		const sum = allPitches.reduce((a, b) => a + b, 0);
		const avg = (sum / allPitches.length) || 0;

		return avg;
	}

	/**
 	 * Calculates the abs difference between the lowest and highest pitch used in the users piece.
 	 * @return {void} Nothing.
 	 */
	getPitchRange()
	{
		this.getPitchCount() //< to update pitches in piece

		// TODO: Format so that math doesn't go crazy 

		// this.pitchesInPeice = Math.max.apply(Math, this.pitchesInPeice);

		return Math.abs(Math.min.apply(Math, this.pitchesInPeice) - Math.max.apply(Math, this.pitchesInPeice))
	}

	/**
 	 * Counts the average pitch interval between neighbouring pitches.
 	 * @return {void} Nothing.
 	 */
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

	/**
 	 * Calculates the distances between each generated example and the user's musical metrics.
 	 * @return {void} Nothing.
 	 */
	calculateMusicalDistancesForData()
	{
		// Get main values
		this.calculateGetNotes(); //<--- to be used in the functions below 
		var userPitchCount = this.getPitchCount();
		var userPitchCount = this.getAveragePitch();
		var userPitchRange = this.getPitchRange();
		var userAveragePitchInterval = this.getAveragePitchInterval();

		// Add these distances the dataset
		for (let g = 0; g < generated_data.length; ++g)
		{
			generated_data[g]["pitchCountDist"] = Math.abs(userPitchCount - generated_data[g]["pitch_count"]);
			generated_data[g]["averagePitchDist"] = Math.abs(userPitchRange - generated_data[g]["averagePitchDist"]);
			generated_data[g]["pitchRangeDist"] = Math.abs(userPitchRange - generated_data[g]["pitch_range"]);
			generated_data[g]["averagePitchIntervalDist"] = Math.abs(userAveragePitchInterval - generated_data[g]["average_pitch_interval"]);
		}

		// this.getMostSimilarDataValues("Pitch Count");
	}


	/**
 	 * Returns a list of the top 10 closest matches for a given metric.
 	 * @param {string} metric - the metric for the required sorted list of examples.
 	 * @return {void} Nothing.
 	 */
	getMostSimiliarValues(metric)
	{

		const totalInList = 10;
		// TODO: refactor this using "metric" + dist... would be way neater 

		if (metric === "pitchCount")
		{
			// sort by metric 
			generated_data = generated_data.sort((a, b) => (a.pitchCountDist > b.pitchCountDist) ? 1 : -1);

			// take the top few values 
			var pitchCount = generated_data.filter (function(d) {
				return d["pitchCountDist"] === generated_data[0]["pitchCountDist"];
			});

			// and make sure we have at-least the top 10 values if not possible
			// for variation...
			while (pitchCount.length < totalInList) {
				pitchCount.push(generated_data[pitchCount.length])
			}

			return pitchCount;
		}


		if (metric === "averagePitch")
		{
			// sort by metric 
			generated_data = generated_data.sort((a, b) => (a.averagePitchDist > b.averagePitchDist) ? 1 : -1);

			// take the top few values 
			var averagePitch = generated_data.filter (function(d) {
				return d["averagePitchDist"] === generated_data[0]["averagePitchDist"];
			});

			// and make sure we have at-least the top 10 values if not possible
			// for variation...
			while (averagePitch.length < totalInList) {
				averagePitch.push(generated_data[averagePitch.length])
			}

			return averagePitch;
		}


		if (metric === "pitchRange")
		{
			// sort by metric 
			generated_data = generated_data.sort((a, b) => (a.pitchRangeDist > b.pitchRangeDist) ? 1 : -1);

			// take the top few value
			var pitchRange = generated_data.filter (function(d) {
				return d["pitchRangeDist"] === generated_data[0]["pitchRangeDist"];
			});

			// and make sure we have at-least the top 10 values if not possible
			// for variation...
			while (pitchRange.length < totalInList) {
				pitchRange.push(generated_data[pitchRange.length])
			}

			return pitchRange;
			
		}

		if (metric === "averagePitchInterval")
		{
			// sort by metric 
			generated_data = generated_data.sort((a, b) => (a.averagePitchIntervalDist > b.averagePitchIntervalDist) ? 1 : -1);

			// take the top few values 
			var averagePitchInterval = generated_data.filter (function(d) {
				return d["averagePitchIntervalDist"] === generated_data[0]["averagePitchIntervalDist"];
			});

			// and make sure we have at-least the top 10 values if not possible
			// for variation...
			while (averagePitchInterval.length < totalInList) {
				averagePitchInterval.push(generated_data[averagePitchInterval.length])
			}
			
			return averagePitchInterval;
		}

	}

}
