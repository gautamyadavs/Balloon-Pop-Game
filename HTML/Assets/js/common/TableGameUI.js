class TableGameUI extends GameUI {
	constructor(canvas) {
		super(canvas);
		this.TUTOR_TARGET = 0;
		this.ENVIRONMENT_TARGET = 1;
		this.numberOfTargetsShot = 0;
	}

	/**
	 * Draws the targets to shoot at.
	 * @param targets an array of targets that contain the number labels.
	 * @param environmentTargets an array of extra targets in the background not related to the tutor.
	 */
	drawTargets(targets, environmentTargets) {
		this.targets = targets;
		this.environmentTargets = environmentTargets;
		this.targetImages = [];
		this.environmentTargetImages = [];

		for (let i = 0 ; i < targets.length ; i++) {
			let target = targets[i];
			let targetDiv = $(`<div style="position: absolute;" id="${target.name}"></div>`);
			targetDiv.css({
				'left' : target.x,
				'top' : target.y,
				'background-image' : `url(${target.path})`,
			});
			$('body').append(targetDiv);
			this.targetImages.push(targetDiv);
		}

		for (let i = 0 ; i < environmentTargets.length ; i++) {
			let target = environmentTargets[i];
			let targetDiv = $(`<div style="position: absolute;" id="${target.name}"></div>`);
			targetDiv.css({
				'left' : target.x,
				'top' : target.y,
				'background-image' : `url(${target.path})`,
			});
			$('body').append(targetDiv);
			this.environmentTargetImages.push(targetDiv);
		}
	}

	drawStaticTargets(targets, environmentTargets) {
		this.targets = targets;
		this.environmentTargets = environmentTargets;
		this.targetImages = [];
		this.environmentTargetImages = [];

		for (let i = 0 ; i < targets.length ; i++) {
			let target = targets[i];
			let targetDiv = $(`<img style="position: absolute;" id="${target.name}">`);
			targetDiv.attr('src', target.path);
			targetDiv.css({
				'left' : target.x,
				'top' : target.y,
			});
			$('body').append(targetDiv);
			this.targetImages.push(targetDiv);
		}

		for (let i = 0 ; i < environmentTargets.length ; i++) {
			let target = environmentTargets[i];
			let targetDiv = $(`<img style="position: absolute;" id="${target.name}">`);
			targetDiv.attr('src', target.path);
			targetDiv.css({
				'left' : target.x,
				'top' : target.y,
			});
			$('body').append(targetDiv);
			this.environmentTargetImages.push(targetDiv);
		}
	}

	drawJumble(jumbleX, jumbleY, labelLocationsX, labelLocationsY = 0) {
		this.jumbleX = jumbleX;
		this.jumbleY = jumbleY;
		$('#jumble-block').css({'left' : jumbleX, 'top' : jumbleY});
		for (let i = 0 ; i < labelLocationsX.length ; i++) {
			$(`#decimalText${i + 1}`).css({
				'left' : labelLocationsX[i],
				'top' : labelLocationsY
			});
		}
	}

	/**
	 * Displays the target at x, if it exists, being shot.
	 * If shot target contains a number label, displays the flying label animation and add the corresponding label to the bottom jumble.
	 * Also performs a custom action on the target being shot (specified in child classes).
	 * @param {x} the horizontal position being shot.
	 * @param {destY} the y-location of where the label will fall to.
	 * @param {movieClipInfo} Movieclip data of the flying label.
	 * @param {onShot} callback function on the target being shot.
	 */
	shootTargetAt(x, destX, destY, movieClipInfo, onShot, delay = 0) {
		let shotTargetInfo = this.findTargetAt(x);

		if (shotTargetInfo && shotTargetInfo.type == this.TUTOR_TARGET) {
			// get the number label contained in this target
			let labelBox = $(`#decimalText${shotTargetInfo.index + 1}`);

			// get the position of this target
			let sourceX = shotTargetInfo.target.x;
			let sourceY = shotTargetInfo.target.y;

			// move the label to the bottom
			this.displayFlyingLabel(movieClipInfo, labelBox, sourceX, sourceY, destX, destY, delay);
		}

		onShot(shotTargetInfo);
	}

	/**
	 * Check if there is a target at location x.
	 * @param {x} the input horizontal position.
	 * @return a tuple of three values:
	 * 		type - the type of target, either TUTOR_TARGET or ENVIRONMENT_TARGET
	 *		target - the Target object containing information about the found target.
	 *		image - the corresponding svg image of the found target.
	 * or null if no target is found.
	 */	
	findTargetAt(x, update = true) {
		// check if there is a tutor target at x
		for (let i = this.targets.length - 1 ; i >= 0 ; i--) {
			let target = this.targets[i];
			let targetWidth = getWidth(this.targetImages[i]);
			if (!target.shot && target.x <= x && x <= target.x + targetWidth) {
				if (update) {
					target.shot = true;
				}
				return {
					type: this.TUTOR_TARGET, 
					target: this.targets[i], 
					image: this.targetImages[i],
					index: i
				};
			}
		}
	
		// check if there is an environment target at x
		for (let i = 0 ; i < this.environmentTargets.length ; i++) {
			let target = this.environmentTargets[i];
			let targetWidth = getWidth(this.environmentTargetImages[i]);
			if (!target.shot && target.x <= x && x <= target.x + targetWidth) {
				target.shot = true;
				return {
					type: this.ENVIRONMENT_TARGET, 
					target: this.environmentTargets[i], 
					image: this.environmentTargetImages[i],
					index: i
				};
			}
		}

		return null;
	}

	/**
	 * Move the label from its original position to the bottom of the screen,
	 * and append it as the last element in the current CTATJumble ordering.
	 * @param {movieclipInfo} Movieclip data of the flying label.
	 * @param {labelBox} the CTATTextField that is the number label.
	 */
	displayFlyingLabel(movieClipInfo, labelBox, sourceX, sourceY, destX, destY, delay) {
		let _this = this;
		if (!movieClipInfo) {
			TweenMax.delayedCall(delay, function() {
				_this.finishAnimation(labelBox, destX, destY);
			});
			return;
		}

		_this.numberOfTargetsShot ++;
		labelBox.appendTo($('#jumble'));
		// initialize a new flying label spritesheet
		let flyingLabel = $('<div class="table-game-number-flying-label"></div>');
		$('body').append(flyingLabel);
		flyingLabel.hide();
		flyingLabel.css({'left' : sourceX + 50, 'top' : sourceY});
		flyingLabel.JSMovieclip(movieClipInfo);

		// display the flying animation
		flyingLabel.delay(delay).animate(
			{
				'left' : destX,
				'top' : destY - 30
			},
			{
				duration: 1500,
				progress: function() {
					if (labelBox.is(':visible')) {
						labelBox.hide();
						flyingLabel.show();
						flyingLabel.data('JSMovieclip').play(true);
					}
				},
				complete: function() {
					flyingLabel.remove();
					_this.finishAnimation(labelBox, destX, destY);			
				}
			}
		);
	}

	finishAnimation(labelBox, destX, destY) {
		let _this = this;
		// console.log(this.numberOfTargetsShot);
		labelBox.css({
			'left' : destX - _this.jumbleX, 
			'top' : destY - _this.jumbleY + 20,
			'z-index' : 5
		});
		labelBox.addClass('fallen-label');
		labelBox.show();
		if (_this.numberOfTargetsShot == 4 && !$('#jumble-submit button').is(':visible')) {
			TweenMax.delayedCall(1.0, function() {
				CTATShellTools.findComponent('jumble')[0].setEnabled(true);
				$('#jumble-submit').css('top', destY - _this.jumbleY - 50);
				$('#jumble-submit button').show();
				$('#jumble-submit button').click();
			})	
		}
	}

	addIncorrectBorder() {
		$('.table-game-number-label').addClass('CTAT--incorrect');
		$('.table-game-number-label').css('color', 'red');
	}

	addCorrectBorder() {
		$('.table-game-number-label').addClass('CTAT--correct');
		$('.table-game-number-label').css('color', '#32cd32');
	}

	removeIncorrectBorder() {
		$('.table-game-number-label').removeClass('CTAT--incorrect');
		$('.table-game-number-label').css('color', 'black');
	}
}

/**
 * A container for a target in the shooter game.
 */
class Target {
	/**
	 * @constructor
	 * @param x the target's absolute x-location with respect to the parent jumble. 
	 * @param y the target's absolute y-location with respect to the parent jumble.
	 * @param name the target's name.
	 */
	constructor(x, y, name) {
		this.x = x;
		this.y = y;
		this.name = name;
		this.shot = false;
	}

	/**
	 * Set the path to the image source file.
	 * @param {directory} the name of the directory that contains the image file.
	 */
	setPath(directory) {
		this.path = `Assets/images/${directory}/${this.name}.png`;
	}
}