class BalloonPopGame extends AbstractGame {
	constructor() {
		super("Zork");
		this.gameUI = new BalloonPopUI();
		this.finishShooting = false;
	}

	start() {
		super.start();

		let _this = this;
		$(document).on("mousemove", function (e) {
			if (_this.finishShooting) return;
			let x = e.pageX;
			let y = e.pageY;
			if (x < 0 || x > WIDTH || y < 540 || y > HEIGHT) return;
			_this.gameUI.currentDart.setPosition(x - 20);
		});

		$(document).on("click", function (e) {
			if (_this.finishShooting) return;
			let randomY = Math.floor(Math.random()) * 120 + 280;
			_this.gameUI.shootDart(e.pageX, randomY);
		});
	}
}