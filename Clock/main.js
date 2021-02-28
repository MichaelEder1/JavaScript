$(document).ready(function ()
{
	setInterval(clock, 1000);
});

function clock() {
	//get current time
	let date = new Date();
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();
	let day = date.getUTCDate();
	let year = date.getFullYear();
	
	//add leading 0 if value is <10
	if (hours < 10) hours = "0" + hours;
	if (minutes < 10) minutes = "0" + minutes;
	if (seconds < 10) seconds = "0" + seconds;
	
	//write hours, minutes, seconds in spans
	$("#hours").html(hours);
	$("#minutes").html(minutes);
	$("#seconds").html(seconds)
	
	//define month name
	const monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"];
	let month = monthNames[date.getMonth()];
	
	$("#date").html(day + ". " + month + " " + year);
}