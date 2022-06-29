// VARIABLES

const canvasWidth = 610;
const canvasHeight = 510;

var scribbles = [];
var pen = new Pen(80,10,50);
var play = new Play(10,10,50);


var playhead = 0;
var current = 0; 

var playpic, stoppic, penpic, rubberpic;

const synth = new Tone.PolySynth().toDestination();
//===========================================================================

// MAIN FUNCTIONS  

function preload() 
{
	playpic = loadImage("play.png");
	stoppic = loadImage("stop.png");
	penpic = loadImage("pen.png");
	rubberpic = loadImage("rubber.png");
}

function setup() 
{
  	createCanvas (canvasWidth, canvasHeight);
}

function draw() 
{	
	background (230);
	noStroke();

	if (mouseIsPressed === true 
		&& pen.isPen 
		&& playhead % 2 === 0 
		&& play.isPlaying === false) {

		scribbles.push(new Ball(mouseX, mouseY, 20));
	}

	
	for (let i = 0; i < scribbles.length; ++i){

		if (mouseIsPressed ===true 
			&& pen.isPen === false
			&& play.isPlaying === false)
		{
			scribbles[i].collided();
		}
		

		fill(0, 0, 200);
		if (scribbles[i].killed === true) fill(230);
		if (scribbles[i].bong === true) fill(0,255,0);
	
		ellipse(scribbles[i].x, scribbles[i].y, scribbles[i].width);
	}

	// play sound
	if (play.isPlaying === true)
	{
		scribbles = scribbles.sort((a, b) => (a.x > b.x) ? 1 : -1);
		scribbles = scribbles.filter (function(d) {return d.killed === false;});

				
		if (playhead % 10 == 0){

			if(current !== 0) {scribbles[current-1].bong = false;}
			if(scribbles[current].bong != undefined) {scribbles[current].bong=true;}

			synth.triggerAttackRelease((canvasHeight - scribbles[current].y), "8n");	

			current=current+1;
		}
	}

	if (current >= scribbles.length && current!=0){
		play.isPlaying = false;
	}

	playhead = playhead + 1;


	pen.draw();
	play.draw();
} 

function mousePressed()
{
	play.mousePressed();
	pen.mousePressed();
}