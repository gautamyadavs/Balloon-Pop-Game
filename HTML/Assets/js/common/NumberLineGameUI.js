class NumberLineGameUI extends GameUI {
	drawCTATComponents() {
		super.drawCTATComponents();
		$('body').append(`
		    <div 
		      id="numberLine" class="CTATNumberLine"
		      data-ctat-minimum="-1"
		      data-ctat-maximum="1"
		      data-ctat-large-tick-step="1"
		      data-ctat-small-tick-step="1"
		      data-ctat-disable-on-correct="true"
		      data-ctat-enabled="false"
		      style="width: ${WIDTH - 2*X_OFFSET - 100};">
		    </div>
		`);
	}
}