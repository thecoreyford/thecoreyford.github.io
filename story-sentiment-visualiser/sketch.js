// VARIABLES

const canvasWidth = 610;
const canvasHeight = 510;

var afinn, happy, sad, triangle;

var valenceScore = 0; 

//===========================================================================

// MAIN FUNCTIONS  

function preload() 
{
	happy = loadImage("happy.png");
	sad = loadImage("sad.png");
	triangle = loadImage("triangle.png");

	afinn = loadJSON ("AFINN-111.json");

	var myTextArea = createElement ('textarea');  
    myTextArea.attribute ("rows", "10");
    myTextArea.attribute ("cols", "50");
    myTextArea.position (15, 110);
    myTextArea.size(600,400);
    myTextArea.input(textAdded);
}

function setup() 
{
  	createCanvas (canvasWidth, canvasHeight);
}

function draw() 
{
	let scalar = 20;
	
	background (-valenceScore * scalar, valenceScore * scalar, 0);
	// background(0,0,0);
 	
 	fill(255,255,255);
	rect(50, 45, 500, 10);

 	image (sad, 20, 10, 80, 80);
 	image (happy, 510, 10, 80, 80);


 	triangleScore = valenceScore * scalar;
 	if((valenceScore*scalar) > 200){
 		triangleScore = 200;
 	}else if ((valenceScore*scalar) < -210){
		triangleScore = -210;
	}
 	image (triangle, 290 + triangleScore, 45, 40, 40);
}

function textAdded()
{
	let words = this.value (); 
	words = words.split (" ");
	
	valenceScore = 0;
	for (let i = 0; i < words.length; ++i)
	{
		if (afinn[words[i].toLowerCase()] != undefined){
			valenceScore = valenceScore + afinn[words[i].toLowerCase()];
		}
	}
}