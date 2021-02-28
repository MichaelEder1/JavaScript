let failString = [];
$(document).ready(function ()
{
	getContrast();
	
	//register 'change' eventhandler on both color input fields
	$("#qr-code-foregroundColor").on("change", function ()
	{
		getContrast();
	});
	$("#qr-code-backgroundColor").on("change", function ()
	{
		getContrast();
	});
	
	$("#generateCode").on("click", function (e)
	{
		e.preventDefault();
		generateQRCode();
	})
});

/*
	This function calcs the contrast ratio between the fore- and background color
	by using the API provided by webaim.org
*/
function getContrast() {
	let foreground = $("#qr-code-foregroundColor").val().substring(1);
	let background = $("#qr-code-backgroundColor").val().substring(1);
	let api = `https:webaim.org/resources/contrastchecker/?fcolor=${foreground}&bcolor=${background}&api`;
	$.get(api, function (data)
	{
		let contrast = data.ratio;
		$("#qr-code-contrastChecker").text("Contrast: 1:" + contrast);
		setColorScheme(contrast);
	});
}

/*
    This function will check the current color-contrast between fore- and background color and decide,
    if it's okay, or if it could/should be improved: >= 1:7 -> WCAG AAA | => 1:4.5 -> WCAG AA
 */
function setColorScheme(contrast) {
	//TODO: je nach Kontrast Wert farblich gestalten --> Param erster Wert des Kontrast (=> Contrast-Ratio: 4:1 -> Param = 4)
	let symbol = $("#qr-code-contrastChecker-symbol");
	if (Number(contrast) >= 7) {
		symbol.html(`<i class ="fas fa-check"></i>`);
		symbol.css("color", "green");
		
	} else if (Number(contrast) >= 4.5) {
		symbol.html(`<i class ="fas fa-exclamation"></i>`);
		symbol.css("color", "yellow");
		
	} else if (Number(contrast) < 4.5) {
		symbol.html(`<i class ="fas fa-times"></i>`);
		symbol.css("color", "red");
		setFailures("Ratio should be at least >= 1:4.5")
	}
}

/*
	This function creates the QR Code by using the goqr.com API
 */
function generateQRCode() {
	
	//this variables are used for falsy user inputs
	//if there is an error, it will be stored as a string in this array
	let failSection = $(".failSection");
	//if a error section is already displayed, hide it.
	failSection.text("").toggle();
	
	//get data from input fields
	let data = $("#qr-code-data").val();
	let size = $("#qr-code-size").val();
	let foregroundColor = $("#qr-code-foregroundColor").val().substring(1);
	let backgroundColor = $("#qr-code-backgroundColor").val().substring(1);
	let format = $("#qr-code-format").val();
	
	//check, if input is valid
	if (data === "") {
		setFailures("Please enter data, you want for the QR Code!");
	}
	if (Number(size) < 10) {
		setFailures("Please enter a size of at least 10px");
	}

	//print all errors into the failSection div
	for (let err of failString) {
		failSection.append(err + "<br>");
	}
	failSection.toggle();
	
	//only proceed if the array length is o (else, there would be error messages in it)
	if (failString.length !== 0) {
		failString = [];
		return;
	}

	//Api Call with the variables from form
	let api = `https://api.qrserver.com/v1/create-qr-code/?data=${data}&size=${size}x${size}&charset-source=UTF-8&charset-target=UTF-8&color=${foregroundColor}&bgcolor=${backgroundColor}&format=${format}`;
	
	//Set the source of the image you will see on the page to the generated QR Code
	$("#qr-code-generator-output-image").attr({
		"src": api
	}, {
		"alt": ("Download generated QR Code (" + format + " file)")
	});
	//Set the download link to the QR Code source
	$("#qr-code-generator-output-download-link").attr({
		"href": api
	}, {
		"download": ("QR Code for " + data)
	});
	//Show the output section
	$(".qr-code-generator-output").show(300);
}

/*
	This small function adds error messages into the failString array
 */
function setFailures(message) {
	failString.push(message);
}