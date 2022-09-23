/** Wrapper for the data logger object. */
class Logger
{
	constructor() 
	{
		this.logFiles = false;
		this.logged_items = ""; 
	}

	log (newString)
	{ 
		if (this.logFiles) {this.logged_items  = this.logged_items + newString;}	
	}

	printLog()
	{
		if (this.logFiles) {print (this.logged_items);}
	}

	save()
	{
		if (this.logFiles)
		{
			// Take what we need from the music blocks array.
			// We have to take this more cautious approach so we 
			// don't get into trouble with circular includes
			// I.e. next block points to a block itself... . 
			
			let myBlockArray = [];
			for (let i = 0; i < musicBlocks.length; ++i)
			{
				// get a boolean array for the toggle buttons
				let toggleArray = [];
				for (let j = 0; j < musicBlocks[i].grid.toggleButtons.length; ++j){
					if(musicBlocks[i].grid.toggleButtons[j].isOn === true){
						toggleArray.push(1)
					}else{
						toggleArray.push(0)
					}
				}

				// push to the main array 
				myBlockArray.push({x: musicBlocks[i].x, 
								   y: musicBlocks[i].y, 
								   width: musicBlocks[i].width, 
								   height: musicBlocks[i].height, 
								   musicGrid: toggleArray, 
								   id: musicBlocks[i].id, 
								   isAI: musicBlocks[i].isAI});
			}


			// Stringify into a JSON format... 
			var JsonObject = JSON.stringify(myBlockArray);

			// Write to file... 
			var today = new Date();
			var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
			var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
			var dateTime = date+' '+time;
	 
			var file_name = "save file " + dateTime + ".json";

			var dbx = new Dropbox.Dropbox({ accessToken: access_token });

			dbx.filesUpload({path: '/' + file_name, contents: JsonObject})
			.then( function (response) {
				console.log(response);
			})
			.catch( function (error){
				console.log(error);
			})
		}
	} 
}