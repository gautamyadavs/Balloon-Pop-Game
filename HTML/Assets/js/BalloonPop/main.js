let game = new BalloonPopGame();

/* Event listeners from CTAT */
var myVars = {
	"question_file" : "PSBalloonPop.brd",
	"tutoring_service_communication" : "javascript"
}

function ctatOnload() {
	initTutor(myVars);
	addTableEventListeners();
};
