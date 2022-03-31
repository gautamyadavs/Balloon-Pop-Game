class BalloonPopUI extends TableGameUI {
	constructor() {
		super();
		this.numberOfTargetsShot = 0;

		let _this = this;
		$(document).on("mousemove", function(e) {
			_this.mouseX = e.pageX;
		});
	}

	drawGameComponents() {
		// draw background and static components
		this.draw.rect(WIDTH, HEIGHT).fill('#BDFCC9');

		this.draw.image('Assets/images/themes/Playground/Instruction.png')
			.move(X_OFFSET - 5, Y_OFFSET - 10);
		this.draw.image('Assets/images/themes/Playground/Question.png')
		    .loaded(function(loader) {
		  let x = (WIDTH - loader.width)/2 + 10;
		  let y = Y_OFFSET + 90;
		  this.move(x, y);
		});

		this.draw.image('Assets/images/BalloonPop/RedShelf.png').move(30, 540);
		this.draw.image('Assets/images/BalloonPop/BalloonPop_Text.png', 295, 50).x(20);

		// enter information about the targets to shoot at
		let BALLOON_Y = 220;
		let targets = [
			new Target(50, BALLOON_Y, 'RedBalloonSprites'),
			new Target(50 + 200, BALLOON_Y, 'PurpleBalloonSprites'),
			new Target(50 + 200*2, BALLOON_Y, 'GreenBalloonSprites'),
			new Target(50 + 200*3, BALLOON_Y, 'OrangeBalloonSprites')
		];
		targets.forEach(function (elem) {
			elem.setPath('BalloonPop');
		});

		// draw the extra darts
		this.extraDarts = [];
		for (let i = 0 ; i < 4 ; i++) {
			this.addDart(650 + 60*i);
		}

		super.drawTargets(targets, []);
		this.targetImages.forEach(function (elem) {
			elem.addClass('balloon');
			elem.append('<div class="table-game-number-flying-label" style="bottom: 25; left: -10;"></div>');
		});
		
		this.currentDart = new Dart(this.takeOutFirstDart());
		this.animating = false;
	}

	drawCTATComponents() {
		super.drawCTATComponents();
		super.drawJumble(20, 290, [50, 260, 460, 660]);
	}

	targetShot(x) {
		let _this = this;
		let movieClipInfo = {
			framerate: 10,
			frames: [{ x : 0, y : 0 }, { x : 0, y : 148 }, { x : 0, y : 296 }, { x : 0, y : 444 }, { x : 0, y : 592 }, { x : 0, y : 740 }, { x : 198, y : 0 }, { x : 198, y : 148 }, { x : 198, y : 296 }, { x : 198, y : 444 }, { x : 198, y : 592 }, { x : 198, y : 740 }, { x : 396, y : 0 }, { x : 396, y : 148 }, { x : 396, y : 296 }, { x : 396, y : 444 }, { x : 396, y : 592 }, { x : 396, y : 740 }, { x : 594, y : 0 }, { x : 594, y : 148 }, { x : 594, y : 296 }, { x : 594, y : 444 }, { x : 594, y : 592 }, { x : 594, y : 740 }]
		};
		super.shootTargetAt(x, 100 + 200 * _this.numberOfTargetsShot, 455, movieClipInfo, function (shotTargetInfo) {
			if (!shotTargetInfo) return;
			shotTargetInfo.target.shot = true;
			// display pop animation
			let balloon = shotTargetInfo.image;
			balloon.JSMovieclip({
				framerate: 24,
				frames: [{ x : 0, y : 0 }, { x : 187, y : 0 }, { x : 0, y : 225 }, { x : 187, y : 225 }, { x : 0, y : 450 }]
			});

			// change number color to black

			TweenMax.delayedCall(0.5, function() {
				balloon.html('');
				balloon.data('JSMovieclip').play(false);
				let id = balloon.attr('id');
				if (id == 'PurpleBalloonSprites') {
					balloon.animate({'top' : 390}, 1000);
				} else {
					balloon.animate({'top' : 417}, 1000);
				}
				let index = shotTargetInfo.index;
				$(`#decimalText${index + 1}`).css('color', 'black');
			});
			
		}, 500);
		return _this.numberOfTargetsShot;
	}

	findTargetAt(x) {
		let targetIndex = -1;
		if (30 <= x && x <= 190) {
			targetIndex = 0;
		} else if (230 <= x && x <= 390) {
			targetIndex = 1;
		} else if (430 <= x && x <= 590) {
			targetIndex = 2;
		} else if (630 <= x && x <= 790) {
			targetIndex = 3;
		}
		if (targetIndex == -1) return null;
		let target = this.targets[targetIndex];
		if (target.shot) return null;
		return {
			type: this.TUTOR_TARGET, 
			target: this.targets[targetIndex], 
			image: this.targetImages[targetIndex],
			index: targetIndex
		};
	}

	shootDart(x, y) {
		if (this.animating) return;
		this.animating = true;
		this.currentDart.shoot(x, y);
		if (this.dartsCount() == 0) {
			this.addDart(650).show();
		}
		this.currentDart = new Dart(this.takeOutFirstDart());
		if (this.targetShot(x) == 4) {
			this.clearAllDarts();
			this.currentDart.remove();
		}

		let _this = this;
		TweenMax.delayedCall(1.0, function() {
			_this.animating = false;
			_this.currentDart.setPosition(_this.mouseX);

		})
	}

	addDart(x) {
		let dart = $(`<div class="dart reveal-on-start"></div>`);
		dart.css({
			'left' : x,
			'top' : Dart.INITIAL_Y()
		});
		$('body').append(dart);
		this.extraDarts.push(dart);
		return dart;
	}

	takeOutFirstDart() {
		let dart = this.extraDarts.shift();
		return dart;
	}

	clearAllDarts() {
		this.extraDarts.forEach( function (elem) {
			elem.remove();
		})
	}

	dartsCount() {
		return this.extraDarts.length;
	}
}