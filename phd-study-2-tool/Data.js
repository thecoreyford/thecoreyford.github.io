/**
 * @file Functions for storing and manipulating the dataset of generated music.
 * @author Corey Ford
 */

// THIS WEBSITE IS VERY HELPFUL: http://learnjsdata.com/iterate_data.html

var data = [] //< dataset of the current users block information, in a filterable format. 

/**
 * Clears the block metadata.
 * @return {void} nothing.
 */
function clearDataset()
{
	data = []
}


/**
 * Collects all the block metadata and places into a dataset.
 * @return {void} nothing.
 */
function processDataset()
{
	clearDataset();

	for (let i = 0; i < musicBlocks.length; ++i)
	{
		data.push({"block": musicBlocks[i], 
	 			   "grid": musicBlocks[i].getGridArray(), 
	 			   "x": musicBlocks[i].x, 
	 			   "y": musicBlocks[i].y, 
	 			   "leftConnection":musicBlocks[i].getLeftConnection(), 
	 			   "rightConnection":musicBlocks[i].getRightConnection(),
	 			   "isAI": musicBlocks[i].isAI});
	}
}



