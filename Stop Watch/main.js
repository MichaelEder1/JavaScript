window.onload = function ()
{
	//get buttons
	let startTimerButton = document.querySelector("#start");
	let stopTimerButton = document.querySelector("#stop");
	let resetTimerButton = document.querySelector("#reset");
	
	let interval;
	
	//add click-handler on every button
	startTimerButton.onclick = function ()
	{
		clearInterval(interval);
		interval = setInterval(startTimer, 1000);
	}
	
	stopTimerButton.onclick = function ()
	{
		stopTimer(interval)
	};
	
	resetTimerButton.onclick = function ()
	{
		resetTimer(interval);
	}
}

function startTimer() {
	//get seconds and minute text content
	let minute = Number(document.querySelector("#minute").innerHTML);
	let seconds = Number(document.querySelector("#seconds").innerHTML);
	
	seconds++;
	if (seconds > 59) {
		minute++;
		seconds = 0;
	}
	
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	
	if (minute < 10) {
		minute = "0" + minute;
	}
	
	document.querySelector("#minute").innerHTML = minute;
	document.querySelector("#seconds").innerHTML = seconds;
}

function stopTimer(interval) {
	clearInterval(interval);
}

function resetTimer(interval) {
	document.querySelector("#minute").innerHTML = "00";
	document.querySelector("#seconds").innerHTML = "00";
	stopTimer(interval);
}