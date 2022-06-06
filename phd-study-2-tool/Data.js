// THIS WEBSITE IS VERY HELPFUL: http://learnjsdata.com/iterate_data.html

var data = []

function clearDataset()
{
	data = []
}

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



// TODO: Find the blocks visible on the screen 
// Find start blocks 
// Calculate note lists by block 
// Play out note lists







