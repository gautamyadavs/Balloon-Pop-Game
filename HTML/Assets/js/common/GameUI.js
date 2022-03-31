class GameUI {

	/**
	 * Initialize the game's UI, including game elements and CTAT components.
	 * @constructor
	 */
	constructor() {
		this.draw = SVG('canvas');
		this.drawGameComponents();
		this.drawCTATComponents();
		this.correctX = addImage('correctX', 'Assets/images/common/CorrectX.png', 0, 0, 9999).hide();
		this.incorrectX = addImage('incorrectX', 'Assets/images/common/IncorrectX.png', 0, 0, 9999).hide();
		this.correctX.css({
			'position' : 'absolute',
			'pointer-events' : 'none'
		});
		this.incorrectX.css({
			'position' : 'absolute',
			'pointer-events' : 'none'
		});
	}

	/**
	 * Draw the game elements. To be overwritten by child class.
	 */
	drawGameComponents() {
		// to be overwritten
	}

	/**
	 * Draw the CTAT components common to all games.
	 */
	drawCTATComponents(headerX = 60) {
		// append the 4 answer choices under the question prompt
		$('#adviceSection').append(this.addMultipleChoiceQuestions()).hide();
	}

	/**
	 * Shuffle the 4 multiple choice answers and arrange them in a 2 x 2 grid.
	 * @return {string} - the HTML code for the grid.
	 */ 
	addMultipleChoiceQuestions() {
		// helper function to shuffle an array in-place
		let shuffle = function(a) {
			for (let i = a.length; i; i--) {
		        let j = Math.floor(Math.random() * i);
		        [a[i - 1], a[j]] = [a[j], a[i - 1]];
		    }
		    return a;
		}

		// shuffle the 4 provided answers
		this.questionOrder = shuffle([1, 2, 3, 4]);

		// HTML code for one answer choice (radio button + text)
		let answerChoice = function(index) {
			let htmlCode =
	    		`<td class="button-cell">
		    		<div id="p4Answer${index}" class="CTATRadioButton"
		    		     name="adviceQChoices"></div>
		    	</td>
		    	<td class="text-cell">
		    		<div id="p4Choice${index}" class="CTATTextField"></div>
		    	</td>`;
		    return htmlCode;
		}

		// HTML code for the 2 x 2 grid of 4 answer choices
		let questionTable = 
			`<table>
				<tr>
					${answerChoice(this.questionOrder[0])}
					${answerChoice(this.questionOrder[1])}
				</tr>
				<tr></tr>
				<tr>
					${answerChoice(this.questionOrder[2])}
					${answerChoice(this.questionOrder[3])}
				</tr>
			</table>`;

		return questionTable;
	}


	/**
	 * Display a green X on the selected answer and a success banner
	 * when student correctly answers the multiple choice question.
	 * @param {choiceID} - the index of the selected answer.
	 */
	displayCorrectBanner(choiceID) {
		this.incorrectX.hide();

		// find which radio button was clicked and place an X mark on top of it
		let id = parseInt(choiceID.charAt(choiceID.length - 1));
		$(`#p4Answer${id}`).append(this.correctX);
		setPosition(this.correctX, -15, -15);
		this.correctX.show();

		// remove previous banner (if there is any)
		if (this.banner) {
			this.banner.remove();
		}

		// create new banner
		let randomBannerIndex = Math.floor(Math.random() * 26) + 1;
		randomBannerIndex = (randomBannerIndex >= 10) ? `${randomBannerIndex}` : `0${randomBannerIndex}`;
		let source = `Assets/images/common/Yes_Symbols/Yes_${randomBannerIndex}.png`;
		this.banner = addImage('banner', source, 300, 300, 1000);

		showDoneButton();
	}

	/**
	 * Display a red X on the selected answer and an error banner
	 * when student incorrectly answers the multiple choice question.
	 * @param {choiceID} - the index of the selected answer.
	 */
	displayIncorrectBanner(choiceID) {
		// find which radio button was clicked and place an X mark on top of it
		let id = parseInt(choiceID.charAt(choiceID.length - 1));
		$(`#p4Answer${id}`).append(this.incorrectX);
		setPosition(this.incorrectX, -15, -15);
		this.incorrectX.show();

		if (this.banner) {
			this.banner.remove();
		}
		
		// create new banner
		let randomBannerIndex = Math.floor(Math.random() * 29) + 1;
		randomBannerIndex = (randomBannerIndex >= 10) ? `${randomBannerIndex}` : `0${randomBannerIndex}`;
		let source = `Assets/images/common/No_Symbols/No_${randomBannerIndex}.png`;
		this.banner = addImage('banner', source, 300, 300, 1000); 
	}

	drawUpdatedBuckets() {
		let grid = this.bucketGrids;

		let leftBucketIds = $('#leftBucket .CTATDragNDrop--item').map(function() {
			return $(this).attr('id');
		}).get();
		leftBucketIds.forEach(function (id, arrIndex) {
			$('#' + id).css({
				'left' : grid[arrIndex][0], 
				'top' : grid[arrIndex][1],
				'z-index' : arrIndex < 3 ? 200 : 250
			});
		});

		// update right bucket
		let rightBucketIds = $('#rightBucket .CTATDragNDrop--item').map(function() {
			return $(this).attr('id');
		}).get();
		rightBucketIds.forEach(function (id, arrIndex) {
			$('#' + id).css({
				'left' : grid[arrIndex][0], 
				'top' : grid[arrIndex][1],
				'z-index' : arrIndex < 3 ? 200 : 300
			});

		});
	}

	markBucketNumbers(isCorrect) {
		$('.CTATDragNDrop--item p').css('color', isCorrect ? '#32cd32' : 'red');
	}

	unmarkBucketNumbers() {
		$('.CTATDragNDrop--item p').css('color', 'black');
	}
}

/**
 * Get the x-location of an element with respect to the page.
 * @param {element} - the input HTML element.
 * @return {float} the 'left' CSS property of the element.
 */
function getX(element) {
	return parseFloat(element.css('left'));
}

/**
 * Get the x-location of an element with respect to the page.
 * @param {element} - the input HTML element.
 * @return {float} the 'left' CSS property of the element.
 */
function getY(element) {
	return parseFloat(element.css('top'));
}

/**
 * Get the width of an element in pixels.
 * @param {element} - the input HTML element.
 * @return {float} the 'width' CSS property of the element.
 */
function getWidth(element) {
	return parseFloat(element.css('width'));
}

/**
 * Get the height of an element in pixels.
 * @param {element} - the input HTML element.
 * @return {float} the 'height' CSS property of the element.
 */
function getHeight(element) {
	return parseFloat(element.css('height'));
}

/**
 * Get the x- and y-location of an element's center point with respect to the page.
 * @param {element} - the input HTML element.
 * @return {Array} an array where the first and second number 
 * are the x- and y-location of the element's center respectively.
 */
function getCenter(element) {
	return [
		getX(element) + getWidth(element)/2,
		getY(element) + getHeight(element)/2
	];
}

/**
 * Set the position of an element by modifying it's 'lef' and 'top' CSS properties.
 * @param element the input HTML element.
 * @param {x} - the input x-location.
 * @param {y} - the input y-location.
 */
function setPosition(element, x, y) {
	element.css({
		'left' : x,
		'top' : y
	});
}

/**
 * Add a <div> to the HTML body with the specified inputs.
 * @param {x} - the input x-location.
 * @param {y} - the input y-location.
 * @param {width} - the input width in pixels.
 * @param {height} - the input height in pixels.
 * @param {zIndex} -  the input z-location.
 * @param {divClass} - a string that contains all the CSS classes of this div.
 * @param {divId} - the ID of this div.
 * @return {object} the jQuery object representing the newly created div.
 */
function addDiv(x, y, width, height, zIndex = 0, divClass = '', divId = '') {
	let div = $('<div></div>');
	if (divClass.length > 0) {
		div.addClass(divClass);
	}
	if (divId.length > 0) {
		div.attr('id', divId);
	}
	div.css({
		'position' : 'absolute',
		'left' : x,
		'top' : y,
		'width' : width,
		'height' : height,
		'z-index' : zIndex
	});
	$('body').append(div);
	return div;
}

/**
 * Add an <img> to the HTML body with the specified inputs.
 * @param {id} - the input id.
 * @param {source} - the path to the image source.
 * @param {x} - the input x-location.
 * @param {y} - the input y-location.
 * @param {zIndex} -  the input z-location.
 * @return {object} the jQuery object representing the newly created image.
 */
function addImage(id, source, x, y, zIndex = 200) {
	let img = $(`<img src="${source}" id="${id}">`);
	img.css({
		'position' : 'absolute',
		'left' : x,
		'top' : y,
		'z-index' : zIndex
	});
	$('body').append(img);
	return img;
}

/**
 * Add a div with the specified background image to the HTML body at the specified location.
 * @param {src} - the path to the image source.
 * @param {x} - the input x-location.
 * @param {y} - the input y-location.
 * @param {width} - the input width in pixels.
 * @param {height} - the input height in pixels.
 * @param {zIndex} -  the input z-location.
 * @return {object} the jQuery object representing the newly created div.
 */
function addDivImage(src, x, y, width, height, id = '', zIndex = 200) {
	let div = addDiv(x, y, width, height, zIndex, '', id);
	div.css('background-image',`url('${src}')`);
	$('body').append(div);
	return div;
}