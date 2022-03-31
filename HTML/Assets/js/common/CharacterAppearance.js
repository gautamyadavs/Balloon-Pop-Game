class CharacterAppearance {

	constructor(id, name, canvas) {
		this.character = $(id);
		this.draw = canvas;
		// path to the character image
		let path = `Assets/images/common/Characters/${name}.png`;

		// set character image to div background
		this.character.attr('src', `${path}`);
		this.character.css('top', HEIGHT + 100);
		this.hide();
	}

	animateSlideTo(dest, onComplete, delay = 0) {
		this.character.delay(delay).fadeIn().animate(
			{
				'top' : dest
			},
			{
				duration: 1500,
				complete: onComplete
			}
		);
	}
	
	animateSlideUpInitial() {	
		let char = this.character;
		let displaySpeechBubble = function() {
			if (!char.is(':visible')) return;
			let x = getX(char) + getWidth(char) - 20;
			let y = getY(char) + 30;
			let randomIndex = Math.floor(Math.random() * 10);
			let bubblePath = `Assets/images/common/PS_Speech_Bubbles/PSTurnSpeechBubble000${randomIndex}.png`;
			let bubble = $(`<img id="bubble" class="graphics" src=${bubblePath}>`);
			$('body').append(bubble);
			bubble.css({
				'left' : x,
				'top' : y,
				'z-index' : 9999
			});
			// clicking on the button image triggers the real (and hidden) CTAT button
			$('#buttonImage').show().css('cursor', 'pointer');
			$('#buttonImage').on("click", function() {
				$('#startImageButton button').click();
			});
		}

		this.animateSlideTo(HEIGHT - 300, displaySpeechBubble);
	}

	animateSlideUpFinal(delayInSeconds = 1.0) {
		let _this = this;

		let onComplete = function() {
			_this.character.remove();
			$('#adviceSection').show();
			$('#buttonImage').show();
			$('#buttonImage').attr('src', 'Assets/images/common/QuestionArrow0002.png');
		}

		TweenMax.delayedCall(delayInSeconds, function() {
			_this.animateSlideTo(200);
			_this.animateSlideTo(HEIGHT, onComplete, 500);
		});
	}

	animateSlideUpAndDownWithCustomBubble(bubblePath, bubbleX, bubbleY, dest, onComplete, timeUntilSlideDown = 1000) {
		let _this = this;

		let bubble = $(`<img src=${bubblePath}>`);

		let displaySpeechBubble = function() {
			$('body').append(bubble);
			bubble.css({
				'left' : bubbleX,
				'top' : bubbleY,
				'z-index' : 9999,
				'position' : 'absolute'
			});
			bubble.delay(timeUntilSlideDown).fadeOut();
		}

		let finish = function() {
			_this.character.hide();
			if (onComplete) onComplete();
		}

		this.animateSlideTo(dest, displaySpeechBubble);
		this.animateSlideTo(HEIGHT, finish, timeUntilSlideDown);
	}

	setPosition(x, y) {
		this.character.css('bottom', y);
		this.character.css('left', x);
	}

	hide() {	
		this.character.hide();
		$('.graphics').remove();
	}
}


