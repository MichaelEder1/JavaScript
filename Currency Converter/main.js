let currencyArray = [];
let apiKey = "a48886e0dce12ef7a95c";
$(document).ready(function () {
    getCurrencies();
    autocomplete(document.querySelector("#converter-input-base"), currencyArray);
    autocomplete(document.querySelector("#converter-input-target"), currencyArray);
    $("#convert").on("click", function () {
        getExchangeRate();
    });
});

//This function will get all currency ISO Codes available in this API in an array
function getCurrencies() {
    let api = `http://free.currconv.com/api/v7/currencies?apiKey=${apiKey}`;
    $.get({
        url: api,
        success: function (data) {
            //read JSON file and push currency ISO-Code into an seperate Array
            for (let curr in data.results) {
                currencyArray.push(curr);
            }
        },
        //if something went wrong, throw error message on console
        error: function () {
            console.log("error");
        }
    });
};

function getExchangeRate() {
    //read input fields
    let amount = Number($("#converter-input-amount").val());
    let currencyBase = $("#converter-input-base").val();
    let currenyTarget = $("#converter-input-target").val();

    let apiData = `${currencyBase}_${currenyTarget}`;
    let exchangeRate;
    //create API call
    let api = `http://free.currconv.com/api/v7/convert?q=${apiData}&compact=ultra&apiKey=${apiKey}`;
    $.get(api, function (data) {
        exchangeRate = Number((JSON.stringify(data).split(":")[1].split("}" [0]))[0]);
        console.log(exchangeRate);

        //insert text like 1 EUR ~ 1,16 USD
        $("#exchange-rate").text(`1 ${currencyBase} ~ ${Math.round((Number(exchangeRate) + Number.EPSILON) * 1000) / 1000} ${currenyTarget}`);
        //if an amount is given calc the total sum in the other currency
        if (amount != 0) {
            let total = exchangeRate * amount;
            $("#exchange-total").text(`${amount} ${currencyBase} ~ ${Math.round((Number(total) + Number.EPSILON) * 1000) / 1000} ${currenyTarget}`);
        }
        $("#date").text(new Date());
    });
}

//Code by W3Schools - https://www.w3schools.com/howto/howto_js_autocomplete.asp

//This function will handle the autocompletion feature
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}