class AbstractGame {
	constructor(initialCharName) {
		this.initialChar = new CharacterAppearance('#initial-char', initialCharName, this.draw);
		this.initialChar.setPosition(50, -100);
		this.initialChar.animateSlideUpInitial();

		let index = Math.floor(Math.random() * 2);
		index = (index < 10) ? `0${index}` : `${index}`;
		this.ensembleChar = new CharacterAppearance('#ensemble-char', `EnsembleCharacterAppearance${index}`, this.draw);
		this.ensembleChar.setPosition(300, - 200);

		this.gameStart = false;
		this.endAnimationStage = false;
	}

	multipleChoiceEvent() {
		let _this = this;

		let onCorrect = function(choiceID) {
			_this.gameUI.displayCorrectBanner(choiceID);
		}

		let onIncorrect = function(choiceID) {
			_this.gameUI.displayIncorrectBanner(choiceID);
		}

		let multipleChoiceEvent = {
			processCommShellEvent: function(event, message) {
				// filter the information
				if (!message || (event != "CorrectAction" && event != "InCorrectAction")) {
					return;
				}
				var sai = message.getSAI();
				if (sai.getSelection() != "adviceQChoices") {
					return;
				}
				
				let studentChoice = message.getInput().replace(/\s+/g, '').replace(':', '');
				if (event == "CorrectAction") {
					onCorrect(studentChoice);
				} else {
					onIncorrect(studentChoice);
				}
			}
		}
		return multipleChoiceEvent;
	}

	numberLineEvent(onSelection, onCorrect, onIncorrect) {
		let numberLineEvent = {
			processCommShellEvent: function(event, message) {
				// filter the information
				if (!message || (event != "CorrectAction" && event != "InCorrectAction")) {
					return;
				}
				let sai = message.getSAI();
				if (sai.getSelection() != "numberLine") {
					return;
				}

				let getXPosition = function(value) {
					let LEFT_END = 120;
					let RIGHT_END = 800;
					return LEFT_END + (value + 1) / 2 * (RIGHT_END - LEFT_END);
				};

				// display custom animation when student selects a point on the number line
				let value = parseFloat(sai.getInput());
				let chosenX = getXPosition(value);
				let chosenY = HEIGHT - Y_OFFSET - 10;
				onSelection(chosenX, chosenY);

				// display custom animation when grading is complete
				if (event == "CorrectAction") {
					onCorrect(chosenX);
				} else {
					onIncorrect(chosenX);
					
				}
			}
		}
		return numberLineEvent;
	}

	tableEvent() {
		let _this = this;
		let event = {
			processCommShellEvent: function(event, message) {
				if (!message) return;

				if (!message.getSAI) {
					let xp = new CTATXML();
					message = new CTATMessage(xp.parseXML(message));
				}

				let sai = message.getSAI();

				if (sai.getSelection() != "jumble") {
					return;
				}
				if (sai.getAction() == "SetOrder" && event != "AssociatedRules") {
					_this.gameUI.removeIncorrectBorder();
				}

				if (event == "InCorrectAction") {
					_this.gameUI.addIncorrectBorder();
				} 
				if (event == "CorrectAction") {
					$('#jumble-submit').remove();
					_this.gameUI.addCorrectBorder();
					_this.ensembleChar.animateSlideUpFinal();
				}
			}
		}
		return event;
	}

	bucketEvent() {
		let _this = this;
		let event = {
			processCommShellEvent: function(event, message) {
				if (!message) return;

				if (!message || (event != "CorrectAction" && event != "InCorrectAction" && event != "UntutoredAction")) {
					return;
				}

				if (!message.getSAI) {
				    // parse the XML content and pass it to a CTATMessage
				    let xp = new CTATXML();
				    message = new CTATMessage(xp.parseXML(message));
				}

				let sai = message.getSAI();
				if (sai.getSelection() != "leftBucket" && sai.getSelection() != "rightBucket") {
					return;
				}

				if (event === "CorrectAction") {
					$('.after-add').css('cursor', 'auto');
					_this.gameUI.markBucketNumbers(true);
					$('#bucket-submit').remove();
					_this.ensembleChar.animateSlideUpFinal();
				} else if (event === "InCorrectAction") {
					_this.gameUI.markBucketNumbers(false);
				} 
				else if (event === "UntutoredAction" && sai.getAction() === "Add") {
					_this.gameUI.unmarkBucketNumbers();
					_this.gameUI.drawUpdatedBuckets();
					$('#bucket-submit button').removeClass('CTAT--incorrect');
				}
			}
		}
		return event;
	}

	lockComponent(id) {
		let component = CTATShellTools.findComponent(id)[0];
		component.lock();
	}

	unlockComponent(id) {
		let component = CTATShellTools.findComponent(id)[0];
		component.unlock();
		component.setEnabled(true);
	}

	start() {
		this.gameStart = true;
	}

	restrictTextAreaInput() {
		$('textarea').keypress(function(e) {
			let allowedChars = [46];
			for (let i = 48 ; i < 58 ; i++) {
				allowedChars.push(i);
			}
		    let k = e.which;
		    let currentText = $(this).val();

		    // input can only contain numbers and at most one dot
		    // input length is at most 5
		    let refuseInput =
		    	allowedChars.indexOf(k) < 0 ||
		    	(k == 46 && currentText.includes('.')) ||
		    	(currentText.length == 5);

		    if (refuseInput) {
		    	e.preventDefault();
		    }
		});
	}

	restrictTextBoxInput() {
		$('input').keypress(function(e) {
			let allowedChars = [];
			for (let i = 48 ; i < 58 ; i++) {
				allowedChars.push(i);
			}
			if (allowedChars.indexOf(e.which) < 0) {
				e.preventDefault();
			}
		});
	}

	registerAdditionGrading() {
		$('#additionSubmit').on("click", function() {
			let inputs = [
				$('#carryTensCTAT input').val(), $('#carryOnesCTAT input').val(),
				$('#carryTenthsCTAT input').val(), $('#carryHundredthsCTAT input').val(),
				"_",
				$('#ansTensCTAT input').val(), $('#ansOnesCTAT input').val(),
				$('#ansTenthsCTAT input').val(), $('#ansHundredthsCTAT input').val()
			];
			let finalAnswer = "";
			inputs.forEach(function(elem) {
				finalAnswer += (elem == "" ? "0" : elem);
			});
			CTATCommShell.commShell.gradeSAI("finalAnswer", "UpdateText", finalAnswer);
		});
	}

	registerSequenceGrading() {
		$('#field1D, #field1E textarea').on("change", function() {
			let firstNumber = parseFloat($('#field1D textarea').val());
			let secondNumber = parseFloat($('#field1E textarea').val());
			if (!isNaN(firstNumber) && !isNaN(secondNumber)) {
				CTATCommShell.commShell.gradeSAI("sequence1", "UpdateText", firstNumber + "_" + secondNumber);
			}
		});

		$('#field2D, #field2E textarea').on("change", function() {
			let firstNumber = parseFloat($('#field2D textarea').val());
			let secondNumber = parseFloat($('#field2E textarea').val());
			if (!isNaN(firstNumber) && !isNaN(secondNumber)) {
				CTATCommShell.commShell.gradeSAI("sequence2", "UpdateText", firstNumber + "_" + secondNumber);
			}
		});

		$('#field3D, #field3E textarea').on("change", function() {
			let firstNumber = parseFloat($('#field3D textarea').val());
			let secondNumber = parseFloat($('#field3E textarea').val());
			if (!isNaN(firstNumber) && !isNaN(secondNumber)) {
				CTATCommShell.commShell.gradeSAI("sequence3", "UpdateText", firstNumber + "_" + secondNumber);
			}
		});
	}
}