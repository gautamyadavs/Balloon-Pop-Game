/* CTAT functions called in BRD */
function ctatStartStateCompleted(input) {
	console.log("start state completed");
}

function fireShowDetailedInstructions(input) {
	console.log("show detailed instructions");
  	$('#instructionsText').html(input);
}

function fireHidePSCharacter(input) {
	console.log("hide initial character");
	$('#bubble').remove();
	$('#buttonImage').hide();
	$('#startImageButton').remove();
	$('#initial-char').animate(
		{
			'top' : HEIGHT
		},
		{
			duration: 2000,
			complete: function() {
				this.remove();
				$('.reveal-on-start').show();
				game.start();
				TweenMax.delayedCall(2.0, function() {
					$('#bubble').remove();
				})
			}
		}
	);
}

function fireGamePlayComplete(input) {
	console.log("fire game play complete");
}

function fireHideDetailedInstructions(input) {
	console.log("hide detailed instructions");
	$('#instructionsText').html('');
}

function showDoneButton(input) {
	console.log("show done button");
	$('#buttonImage').attr('src', 'Assets/images/common/DoneButtonSymbol.png');
	$('#buttonImage').on("click", function() {
		$('#buttonImage').hide();
		$('#adviceQDoneButton button').click();
		$('#done button').click();
	});	
}

/* Event listeners for CTAT events */
function addNumberLineEventListeners() {
	/* Check the correctness of number line selection */
	CTATCommShell.commShell.addGlobalEventListener(game.numberLineEvent());

	/* Check the correctness of multiple choice question */
	CTATCommShell.commShell.addGlobalEventListener(game.multipleChoiceEvent());
}

function addTableEventListeners() {
	/* Check the correctness of number arrangement */
	CTATCommShell.commShell.addGlobalEventListener(game.tableEvent());

	/* Check the correctness of multiple choice question */
	CTATCommShell.commShell.addGlobalEventListener(game.multipleChoiceEvent());
}

function overwriteNextGameLink() {
	// move to the next problem in the problem set, instead of back to the map
	let startStateEndListener = {
		processCommShellEvent: function(event, message) {
			if (event === "StartStateEnd") {
				let urlComponents = CTATConfiguration.get('curriculum_service_url').split("/");
				let index = parseInt(urlComponents[urlComponents.length - 1]);

				// redirect to next problem (evaluation survey) instead of the map
				urlComponents = CTATConfiguration.get('run_problem_url').split("/");
				urlComponents.push("" + (index + 1));
				let url = urlComponents.join("/");
				CTATConfiguration.set('run_problem_url', url);
			}
		}
	}
	CTATCommShell.commShell.addGlobalEventListener(startStateEndListener);
}