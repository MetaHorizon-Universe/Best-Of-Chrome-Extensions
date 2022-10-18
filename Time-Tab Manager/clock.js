window.onload = function() {
	let hours = 0;
	let minutes = 0;
	let seconds = 0;

	let time = new Date();
	const greetingEle = document.getElementById('greeting')

	hours = time.getHours()
	minutes = time.getMinutes()
	seconds = time.getSeconds()

	showTime(hours, minutes, seconds);
	setInterval(calculateTime, 1000);
	calculateTime();

	
	function showTime (hours, minutes, seconds) {
		// Set greeting message according to the time
		if (hours < 12) {
			greetingEle.innerText = "Good Morning"
		} else if (hours >= 12 && hours <= 16) {
			greetingEle.innerText = "Good Afternoon"
		} else if (hours > 16 && hours <= 18) {
			greetingEle.innerText = "Good Evening"
		} else {
			greetingEle.innerText = "Good Night"
		}

		if (hours !== 12) {
			hours %= 12
		}
		if (hours < 10) {
			hours = '0' + (hours)
		}
		if (minutes < 10) {
			minutes = '0' + minutes
		}
		if (seconds < 10) {
			seconds = '0' + seconds
		}
		const time = hours + " : " + minutes + " : " + seconds;
		document.getElementById('timer').innerHTML = time
	}

	function updateMinutes() {
		if (minutes == 59) {
			minutes = 0;
			updateHours();
		} else {
			minutes++;
		}
	}

	function updateHours() {
		if (hours == 12) {
			hours = 1;
		} else {
			hours++;
		}
	}

	function calculateTime(){
		if (seconds == 59) {
			seconds = 0;
			updateMinutes();
		} else {
			seconds++;
		}
		showTime(hours, minutes, seconds);
	}
}
