class Dart {
	constructor(dart) {
		this.dart = dart;
		this.dart.JSMovieclip({
			framerate: 24,
			frames: [{ x : 0, y : 0 }, { x : 0, y : 159 }, { x : 0, y : 318 }, { x : 55, y : 0 }, { x : 55, y : 159 }, { x : 55, y : 318 }, { x : 110, y : 0 }, { x : 110, y : 159 }, { x : 110, y : 318 }, { x : 165, y : 0 }, { x : 165, y : 159 }, { x : 165, y : 318 }, { x : 220, y : 0 }, { x : 275, y : 0 }, { x : 330, y : 0 }, { x : 385, y : 0 }, { x : 440, y : 0 }, { x : 220, y : 159 }, { x : 220, y : 318 }, { x : 275, y : 159 }, { x : 275, y : 318 }, { x : 330, y : 159 }, { x : 330, y : 318 }, { x : 385, y : 159 }]
		});
		this.mc = this.dart.data('JSMovieclip');
	}

	setPosition(x, y) {
		this.dart.css({
			'left' : x,
			'top' : y ? y : Dart.INITIAL_Y()
		});
	}

	shoot(x, y, onComplete) {
		this.mc.play(false);
		this.dart.animate(
			{
				'left' : x,
				'top' : y
			},
			{
				duration: 500,
				complete: onComplete
			}
		);
	}

	isVisible() {
		return this.dart.is(':visible');
	}

	remove() {
		this.dart.remove();
	}

	static INITIAL_Y() {
		return 560;
	}
}