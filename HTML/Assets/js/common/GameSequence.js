const gameNames = [
	"EnterIfYouDare", "CatchTheGhost", "ThirstyVampire", "NightOfTheZombies",
	"WesternShooter", "OKCorral", "LassoBronco", 
	"RocketScience", "SpaceRaider", "AlienEscape", 
	"JungleZipline", "AncientTemple", "PhotoSafari",
	"CastleAttack", "KnightsOath", "Joust",
	"Football", "Goal",
	"BalloonPop", "FerrisWheel", "WhacAGopher",
	"WalkThePlank", "PegLegShop", "FireTheCannon"
];

const numberOfInstancesPerGame = 10;

const gameTooltips = [
	["Help the ghost into the haunted house.", "Correctly place a decimal number on a number line."],
	["Catch ghosts in the two containers.", "Compare decimal numbers to a threshold."],
	["Make sure that a vampire gets enough blood.", "Add two decimal numbers together."],
	["Freeze a zombie with a powerful amulet.", "Correctly place a decimal number on a number line."],
	["Shoot targets in the Wild West.", "Put decimal numbers in the correct order."],
	["Capture horses in the correct corrals.", "Compare decimal numbers to a threshold."],
	["Capture a bucking bronco with a lasso.", "Correctly place a decimal number on a number line."],
	["Fill a rocket with fuel for space flight.", "Put decimal numbers in the correct order."],
	["Shoot alien spaceships.", "Put decimal numbers in the correct order."],
	["Escape from an alien by escaping in the pod.", "Complete sequences of decimal numbers."],
	["Zipline into the trees.", "Put decimal numbers in the correct order."],
	["Unlock the ancient temple's doors to uncover the secret.", "Complete sequences of decimal numbers."],
	["Take pictures of a lion in the jungle.", "Correctly place a decimal number on a number line."],
	["Use a catapult to shoot castles.", "Put decimal numbers in the correct order."],
	["Help the knights begin their sacred oath.", "Complete a sequence of decimal numbers."],
	["Help the red knight win the joust.", "Correctly place decimal numbers on a number line."],
	["Kick field goals!", "Put decimal numbers in the correct order."],
	["Kick a goal past the tough goalie.", "Correctly place a decimal number on a number line."],
	["Shoot darts at balloons.", "Put decimal numbers in the correct order."],
	["Ride the Ferris wheel!", "Complete sequences of decimal numbers."],
	["Hit gophers with a mallet.", "Put decimal numbers in the correct order."],
	["Force pirates off the plank.", "Compare decimal numbers to a threshold."],
	["Help the pirate make peg legs.", "Add two decimal numbers together."],
	["Shoot at the attacking ships.", "Compare decimal numbers to a threshold."]
];

const gameTypes = [
	"Number_Line", "Bucket", "Addition", "Number_Line", 
	"Sorting", "Bucket", "Number_Line",
	"Sorting", "Sorting", "Sequence",
	"Sorting", "Sequence", "Number_Line",
	"Sorting", "Sequence", "Number_Line",
	"Sorting", "Number_Line",
	"Sorting", "Sequence", "Sorting",
	"Bucket", "Addition", "Bucket"
];

let gameSequence = constructGameSequence();
let gameTypeMap = constructGameTypeMapping();

function constructGameSequence() {
	let sequence = ['Demographic', 'GameSurvey', 'Intro', 'Map'];
	// three instances of each game
	gameNames.forEach(function (name) {
		for (let i = 0 ; i < numberOfInstancesPerGame; i++) {
			sequence.push(name);
		}
	});
	sequence.push('Ending');
	sequence.push('PostSurvey');
	sequence.push('Evaluation');
	sequence.push('Evaluation2');
	return sequence;
}

function constructGameTypeMapping() {
	let map = {};
	["Number_Line", "Bucket", "Addition", "Sorting", "Sequence"].forEach(function (type) {
		map[type] = [];
	});
	gameNames.forEach(function (name, index) {
		map[gameTypes[index]].push(name);
	});
	return map;
}

function camelCaseToSpace(string) {
	if (string === 'OKCorral') return 'OK Corral';
	return string.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });
}

function getIconFromType(type) {
	if (type === 'Number Line') return 'linear_scale';
	if (type === 'Sorting') return 'arrow_upward';
	if (type === 'Bucket') return 'view_agenda';
	if (type === 'Addition') return 'alarm_add';
	if (type === 'Sequence') return 'fast_forward'
	return '';
}