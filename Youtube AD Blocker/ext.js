/**
 * Skip ad-movie by 'skip-button'.
 *
 * @returns {Element} skip button
 */
function tryToSkipAdBySkipButton() {
	const skipButton = document.getElementsByClassName("ytp-ad-skip-button")[0];
	
	if (skipButton) {
        skipButton.click();
		console.log("MY AD BLOCKER: Skip ad-movie by 'skip-button'");
		return true;
    }
	
    return false;
}

/**
 * Skip ad-movie by 'info-panel'.
 *
 * @returns {Element} skip button
 */
function tryToSkipAdByInfoPanel() {
	const adInfoButton = document.getElementsByClassName("ytp-ad-info-hover-text-button")[0];
	
	if (!adInfoButton) {
		return false;
    }
	
	adInfoButton.click();
	const adInfoMuteAdButton = document.getElementsByClassName("ytp-ad-info-dialog-mute-button")[0];
	
	if (!adInfoMuteAdButton) {
		return false;
    }
	
	adInfoMuteAdButton.click();
	
	let reasonsRadioButtons = document.getElementsByClassName("ytp-ad-feedback-dialog-reason-text");
	let targetReasonRadioButton;
	
	for (let button of reasonsRadioButtons) {
        if(button.innerText === "Появляется слишком часто") {
			targetReasonRadioButton = button;			
			break;
		}
    }
	
	if(!targetReasonRadioButton) {
		return false;
	}
	
	targetReasonRadioButton.click();
	
	let confirmAdDialogButton = document.getElementsByClassName("ytp-ad-feedback-dialog-confirm-button")[0];
	confirmAdDialogButton.click();
	console.log("MY AD BLOCKER: Skip ad-movie by 'info-panel'");
	
    return true;
}

/**
 * Check displayed skip button every 0.1 second. If displays - click them.
 *
 * @type {number}
 */
const skipMovieFinderInterval = setInterval(() => {
    if (!tryToSkipAdBySkipButton()) {
        tryToSkipAdByInfoPanel();
    }
}, 100);

/**
 * Return close ad banner button.
 *
 * @returns {Element} close button
 */
function getCloseButton() {
    return document.getElementsByClassName("ytp-ad-overlay-close-button")[0];
}

/**
 * Check displayed close button every 0.1 second. If displays - click them.
 *
 * @type {number}
 */
const closeBannerFinderInterval = setInterval(() => {
    const closeButton = getCloseButton();

    if (closeButton) {
        closeButton.click();
		console.log("MY AD BLOCKER: Close banner");
    }
}, 100);
