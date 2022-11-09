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

		this.timing = -10000.0;
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

		if (this.vae.initialized)
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

			let vaeTemperature = 1.75;
			// print(vaeTemperature);

			// For the workspaces
			for (let i = -2; i > -5; i=i-1)
			{
				// get id's 
				let workspaceId = 0; 
				let colour = "";
				if(i == -2){workspaceId = 0; colour = djOrange;}; 
				if(i == -3){workspaceId = 1; colour = djGreen2;} 
				if(i == -4){workspaceId = 2; colour = djPink;};

				// get note sequence
				let ns = playButton.startPlayback(i, true);
				if (ns === undefined || ns === null) {
					print("err: undefined");
     				return;
				}
				ns = mm.sequences.quantizeNoteSequence(ns,4);

				// generate similar samples 
				this.vae.similar(ns, 1, 0.65, vaeTemperature).then(function(sample)  {
					let s1 = mm.sequences.unquantizeSequence(sample[0]); //unquantize 

					// convert note sequences to blocks (checking the right notes)	
					let grid = playButton.noteSequenceToBoolArray(s1["notes"]);

					// push to the blocks at the anchored places 
					musicBlocks.push (new AIBlock (aiWorkspacePlaces[workspaceId][0].x, 
												   aiWorkspacePlaces[workspaceId][0].y, 
												   200, 100, colour, grid));
				});
				
				this.vae.similar(ns, 1, 0.65, vaeTemperature).then(function(sample)  {
					let s1 = mm.sequences.unquantizeSequence(sample[0]); //unquantize 

					// convert note sequences to blocks (checking the right notes)	
					let grid = playButton.noteSequenceToBoolArray(s1["notes"]);

					// push to the blocks at the anchored places 
					musicBlocks.push (new AIBlock (aiWorkspacePlaces[workspaceId][1].x, 
												   aiWorkspacePlaces[workspaceId][1].y, 
												   200, 100, colour, grid));
				});
				// hide the third things...
				// this.vae.similar(ns, 1, 0.7, vaeTemperature).then(function(sample)  {
				// 	let s1 = mm.sequences.unquantizeSequence(sample[0]); //unquantize 

				// 	// convert note sequences to blocks (checking the right notes)	
				// 	let grid = playButton.noteSequenceToBoolArray(s1["notes"]);

				// 	// push to the blocks at the anchored places 
				// 	musicBlocks.push (new AIBlock (aiWorkspacePlaces[workspaceId][2].x, 
				// 								   aiWorkspacePlaces[workspaceId][2].y, 
				// 								   200, 100, colour, grid));
				// });
			}
		}

		this.timing = millis();

		// get orange note sequence 
	}

	//TODO: comment
	drawCurves()
	{
		if((millis() - this.timing) < 4000.0)
		{



			processDataset("all"); //< collect all the blocks into the dataset. 
			let blks = data.filter(function(d){return d["x"] >= workspace[0].getX();});
			blks = blks.filter(function(d){return d["y"] >= workspace[0].getY();});
			blks = blks.filter(function(d){return d["x"] < workspace[0].getX()+workspace[0].getWidth();});
			blks = blks.filter(function(d){return d["y"] < workspace[0].getY()+workspace[0].getHeight();});
			

			for (let i = 0; i < blks.length; i++){
				// top 
				if(blks[i].y > workspace[1].getY() 
				  && blks[i].y < workspace[1].getY() + workspace[1].getHeight())
				{
					let myColour = color(djOrange);
					myColour.setAlpha(255 - (((millis() - this.timing) / 4000.0) * 255));
					curveBetween(blks[i].x + 100, 
								 blks[i].y, 
								 1249, 
								 198,
								 0.2,
								 0.2,
								 1,
								 myColour);
				}

				// middle 
				if(blks[i].y > workspace[2].getY() 
				  && blks[i].y < workspace[2].getY() + workspace[2].getHeight())
				{
					let myColour = color(djGreen2);
					myColour.setAlpha(255 - (((millis() - this.timing) / 4000.0) * 255));
					curveBetween(blks[i].x + 100, 
								 blks[i].y, 
								 1268, 
								 420,
								 0.2,
								 0.2,
								 1,
								 myColour);
				}

				// bottom 
				if(blks[i].y > workspace[3].getY() 
				  && blks[i].y < workspace[3].getY() + workspace[3].getHeight())
				{
					let myColour = color(djPink);
					myColour.setAlpha(255 - (((millis() - this.timing) / 4000.0) * 255));
					curveBetween(blks[i].x + 100, 
								 blks[i].y, 
								 1245, 
								 698,
								 0.2,
								 0.2,
								 0,
								 myColour);
				}
			}

		}
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