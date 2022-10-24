/** AI tool which spawns blocks into the interface. */
class AIBlockCreator
{
	/** 
	 * Constructor
	 * @return {void} Nothing.
	 */
	constructor()
	{
		this.onetime = true;

		this.vae = new mm.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small');
		this.vae.initialize();

	}	

	magentaUpdate(musicBlocks)
	{
		// Set up some anchors for where we will spawn blocks from... 
		let anchor1 = {"x": 1120, "y": 110};
		let anchor2 = {"x": 1120, "y": 400};
		let anchor3 = {"x": 1120, "y": 670};

		// set up the co-ords for the ai blocks
		let aiWorkspacePlaces =[[{"x": anchor1.x, "y": anchor1.y},
								{"x": anchor1.x + random (50, 80), "y": anchor1.y + random (60, 80)},
								{"x": anchor1.x + random (50, 80), "y": anchor1.y + random(-100,-70)}],
								[{"x": anchor2.x , "y": anchor2.y },
								{"x": anchor2.x + random (50, 80), "y": anchor2.y + random(-90,-70)},
								{"x": anchor2.x  + random (50, 80), "y": anchor2.y + random (60, 80)}],
								[{"x":anchor3.x , "y":anchor3.y },
								{"x":anchor3.x + random (50, 80), "y":anchor3.y  + random(-60,-70)},
								{"x":anchor3.x - random (50, 80), "y":anchor3.y + random (90, 90)}]];

		//================================================================================

		if (this.vae.initialized && !playButton.player.isPlaying())
		{
			// Find AI blocks in the grey
			processDataset ("all");
			var aiBlocks = data.filter (function(d){return d["isAI"] === true;});
			aiBlocks = aiBlocks.filter (function(d){return d["x"] < workspace[0].getX() 
														  || d["x"] > workspace[0].getX()+workspace[0].getWidth()
														  || d["y"] < workspace[0].getY()
														  || d["y"] > workspace[0].getY() + workspace[0].getHeight()});
			// Remove AI blocks
			for (let i =  0; i < aiBlocks.length; ++i) {
				musicBlocks.splice(musicBlocks.indexOf(aiBlocks[i].block), 1);
			}

			// ---

			let vaeTemperature = 1.0;

			// For the workspaces
			for (let i = -2; i > -5; i=i-1)
			{
				// get id's 
				let workspaceId = 0; 
				let colour = "";
				if(i == -2){workspaceId = 0; colour = orange;}; 
				if(i == -3){workspaceId = 1; colour = googGreen;} 
				if(i == -4){workspaceId = 2; colour = purple;};

				// get note sequence
				let ns = playButton.startPlayback(i, true);
				ns = mm.sequences.quantizeNoteSequence(ns,4);

				// generate similar samples 
				this.vae.similar(ns, 3, 0.9, vaeTemperature).then(function(sample)  {
					let s1 = mm.sequences.unquantizeSequence(sample[0]); //unquantize 

					// convert note sequences to blocks (checking the right notes)	
					let grid = playButton.noteSequenceToBoolArray(s1["notes"]);

					// push to the blocks at the anchored places 
					musicBlocks.push (new AIBlock (aiWorkspacePlaces[workspaceId][0].x, 
												   aiWorkspacePlaces[workspaceId][0].y, 
												   200, 100, grid, colour));
				});
				
				this.vae.similar(ns, 1, 0.8, vaeTemperature).then(function(sample)  {
					let s1 = mm.sequences.unquantizeSequence(sample[0]); //unquantize 

					// convert note sequences to blocks (checking the right notes)	
					let grid = playButton.noteSequenceToBoolArray(s1["notes"]);

					// push to the blocks at the anchored places 
					musicBlocks.push (new AIBlock (aiWorkspacePlaces[workspaceId][1].x, 
												   aiWorkspacePlaces[workspaceId][1].y, 
												   200, 100, grid, colour));
				});

				// hide the third things...
				// this.vae.similar(ns, 1, 0.7, vaeTemperature).then(function(sample)  {
				// 	let s1 = mm.sequences.unquantizeSequence(sample[0]); //unquantize 

				// 	// convert note sequences to blocks (checking the right notes)	
				// 	let grid = playButton.noteSequenceToBoolArray(s1["notes"]);

				// 	// push to the blocks at the anchored places 
				// 	musicBlocks.push (new AIBlock (aiWorkspacePlaces[workspaceId][2].x, 
				// 								   aiWorkspacePlaces[workspaceId][2].y, 
				// 								   200, 100, grid, colour));
				// });
			}
		}

		// get orange note sequence 
	}


	/**
 	 * Blocks to draw on update, spawning AI blocks where needed. 
	 * @param {array} musicBlocks - the music block array which holds all the blocks in the project.
 	 * @return {void} Nothing
 	 */
	update(musicBlocks)
	{
		// Set up some anchors for where we will spawn blocks from... 
		let anchor1 = {"x": 1120, "y": 110};
		let anchor2 = {"x": 1120, "y": 400};
		let anchor3 = {"x": 1120, "y": 670};


		// Find AI blocks in the grey
		processDataset ("all");
		var aiBlocks = data.filter (function(d){return d["isAI"] === true;});
		aiBlocks = aiBlocks.filter (function(d){return d["x"] < workspace[0].getX() 
													  || d["x"] > workspace[0].getX()+workspace[0].getWidth()
													  || d["y"] < workspace[1].getY()
													  || d["y"] > workspace[0].getY() + workspace[0].getHeight()});
		// Remove AI blocks
		for (let i =  0; i < aiBlocks.length; ++i) {
			musicBlocks.splice(musicBlocks.indexOf(aiBlocks[i].block), 1);
		}


		// // For the top left (PITCH COUNT)
		// Calculate the metrics for the users current data 
		musicMetrics.calculateMusicalDistancesForData(1); 
		var valuesMusic = musicMetrics.getMostSimiliarValues("pitchCount", generated_data, 50);
		valuesMusic = musicMetrics.getMostSimiliarValues("averagePitch",valuesMusic, 10);
		valuesMusic = musicMetrics.getMostSimiliarValues("averagePitchInterval",valuesMusic, 5);
		var values = valuesMusic;//musicMetrics.getMostColourValues(orange, valuesMusic, 8);
		musicBlocks.push (new AIBlock (anchor1.x, anchor1.y, 200, 100,
									   values[Math.floor(Math.random()*values.length)]["music_grid"]));
		// values = musicMetrics.getMostColourValues(googGreen, valuesMusic, 8);
		musicBlocks.push (new AIBlock (anchor1.x + random (50, 80), anchor1.y + random(-100,-70), 200, 100,
									   values[Math.floor(Math.random()*values.length)]["music_grid"]));
		// values = musicMetrics.getMostColourValues(purple, valuesMusic, 8);
		musicBlocks.push (new AIBlock (anchor1.x + random (50, 80), anchor1.y + random (60, 80), 200, 100,
									   values[Math.floor(Math.random()*values.length)]["music_grid"]));

		// // // For the top left (AVERAGE PITCH)
		// var values = musicMetrics.getMostSimiliarValues("averagePitch");			
		// musicBlocks.push (new AIBlock (anchor1.x, anchor1.y + random(0,5), 200, 100,
									   // values[Math.floor(Math.random()*values.length)]["music_grid"]));
		// musicBlocks.push (new AIBlock (anchor1.x + random (230, 220), anchor1.y, 200, 100,
									   // values[Math.floor(Math.random()*values.length)]["music_grid"]));
		// musicBlocks.push (new AIBlock (anchor1.x, anchor1.y + random (100, 120), 200, 100,
									   // values[Math.floor(Math.random()*values.length)]["music_grid"]));

		// //// For the top right (PITCH RANGE)
		// // var values = musicMetrics.getMostSimiliarValues("pitchRange");	
		// Calculate the metrics for the users current data 
		musicMetrics.calculateMusicalDistancesForData(2); 
		valuesMusic = musicMetrics.getMostSimiliarValues("pitchCount", generated_data, 50);
		valuesMusic = musicMetrics.getMostSimiliarValues("averagePitch",valuesMusic, 10);
		valuesMusic = musicMetrics.getMostSimiliarValues("averagePitchInterval",valuesMusic, 5);
		values = valuesMusic; //musicMetrics.getMostColourValues(googGreen, valuesMusic, 8);				
		musicBlocks.push (new AIBlock (anchor2.x, anchor2.y, 200, 100,
									    values[Math.floor(Math.random()*values.length)]["music_grid"]));
		// values = musicMetrics.getMostColourValues(orange, valuesMusic, 8);				
		musicBlocks.push (new AIBlock (anchor2.x  + random (50, 80), anchor2.y + random(-90,-70), 200, 100,
									    values[Math.floor(Math.random()*values.length)]["music_grid"]));
		// values = musicMetrics.getMostColourValues(purple, valuesMusic, 8);				
		musicBlocks.push (new AIBlock (anchor2.x  + random (50, 80), anchor2.y + random (60, 80), 200, 100,
									    values[Math.floor(Math.random()*values.length)]["music_grid"]));

		// // // For the bottom left (AVERAGE PITCH INTERVAL)
		// var values = musicMetrics.getMostSimiliarValues("averagePitchInterval");					
		// var values = musicMetrics.getMostSimiliarValues("pitchCount", generated_data, 40);
		// values = musicMetrics.getMostSimiliarValues("pitchRange", values, 30);	
		// Calculate the metrics for the users current data 
		musicMetrics.calculateMusicalDistancesForData(3); 
		valuesMusic = musicMetrics.getMostSimiliarValues("pitchCount", generated_data, 50);
		valuesMusic = musicMetrics.getMostSimiliarValues("averagePitch",valuesMusic, 10);
		valuesMusic = musicMetrics.getMostSimiliarValues("averagePitchInterval",valuesMusic, 5);
		values = valuesMusic; //musicMetrics.getMostColourValues(purple, valuesMusic, 8);				
		musicBlocks.push (new AIBlock (anchor3.x, anchor3.y, 200, 100,
										values[Math.floor(Math.random()*values.length)]["music_grid"]));
		// values = musicMetrics.getMostColourValues(orange, valuesMusic, 8);				
		musicBlocks.push (new AIBlock (anchor3.x + random (50, 80), anchor3.y + random(-60,-70), 200, 100,
										values[Math.floor(Math.random()*values.length)]["music_grid"]));
		// values = musicMetrics.getMostColourValues(googGreen, valuesMusic, 8);				
		musicBlocks.push (new AIBlock (anchor3.x  - random (50, 80), anchor3.y + random (90, 90), 200, 100,
										values[Math.floor(Math.random()*values.length)]["music_grid"]));
	}
}