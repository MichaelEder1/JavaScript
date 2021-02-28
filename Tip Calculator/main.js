window.onload = function ()
{
	let tipBar = document.querySelector("#tip-bar");
	let tipSpan = document.querySelector("#tip-span");
	let inputTotal = document.querySelector("#input-total");
	let tipResultSpan = document.querySelector("#tip-result-span");
	let totalResultSpan = document.querySelector("#total-result-span");
	
	inputTotal.oninput = function()
	{
		calc();
	}
	
	tipBar.oninput = function ()
	{
		tipSpan.textContent = tipBar.value;
		calc();
	}
	
	function calc() {
		calcTip();
		calcTotal();
	}
	
	function calcTip() {
		tipResultSpan.value = Number(inputTotal.value)*Number(tipSpan.textContent)/100;
	}
	
	function calcTotal() {
		totalResultSpan.value = Number(inputTotal.value)+Number(tipResultSpan.value);
	}
}