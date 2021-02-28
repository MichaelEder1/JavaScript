//Anlegen globaler Variablen
//in dieses Array werden die geöffneten Karten gespeichert
let openCards = [];
//der Counter zählt die Anzahl der Spielzüge
let counter = 0;

$(document).ready(function ()
{
    //Klick auf Start-Button ruft die Funktion zum Berechnen der Paare auf
    //und ruft danach die Funktion zum Generieren des Memorys auf
    $("#buttonStart").click(function ()
    {
        let nrOfCards = getNrOfCards();
        buildBoard(nrOfCards);
    });

    //auf jedes div im Memoryfield mit der Klasse "divs" einen
    //Klick Handler registrieren und dann die Funktion proceedCard aufrufen
    $(document).on("click", (".divs"), function (e)
    {
        proceedCard(e);
    });
});

/**
 * Diese Methode ermittelt die Anzahl der benötigten Memory-Karten
 * @returns {number} liefert als Ergebnis die Anzahl der Karte zurück
 */
function getNrOfCards()
{
    let selection = $("input[name=difficulty]:checked").val();
    switch (selection)
    {
        case "easy":
            return 16;
        case "medium":
            return 24;
        case "hard":
            return 36;
        default:
            console.log("Fehler bei der Bestimmung der Anzahl der Paare");
    }
}

/**
 * Diese Funktion legt das Layout des Memoryfields fest
 * @param cards -> Anzahl der Karten, die auf dem Feld platziert werden sollen
 */
function setLayout(cards)
{
    if (cards === 36)
    {
        $("#memoryField").addClass("bigField");
    }
    else
    {
        $("#memoryField").removeClass("bigField");
    }
}

/**
 * Diese Funktion baut das Memoryfeld mit zufälligen Memory-Karten auf
 * @param cards -> Anzahl der Karten, die platziert werden sollen.
 */
function buildBoard(cards)
{
    setLayout(cards);
    //Clear memory field
    $("#memoryField").empty();

    let arr = [];
    for (let i = 0; i < cards; i++)
    {
        arr.push(i);
        $("#memoryField").append("<div class='divs'><img alt='' width='200' src='' id='i" + i + "' /></div>");
    }

    let r;
    for (let i = 0; i < (cards / 2); i++)
    {
        r = getRandom(0, arr.length - 1);
        $("#memoryField div #i" + arr[r]).attr("src", "images/img_" + i + ".png");
        arr.splice(r, 1); //deletes the element on index r

        r = getRandom(0, arr.length - 1);
        $("#memoryField div #i" + arr[r]).attr("src", "images/img_" + i + ".png");
        arr.splice(r, 1);
    }
    //Array-Länge und counter mit 0 initialisieren/auf 0 setzen
    openCards.length = 0;
    counter = 0;

    //Bilder der Memorykarten verstecken
    $("img").addClass("hidden").hide();
}

/**
 * Diese Funktion ermittelt das Minimum und Maximum zweier gegebenen Zahlen
 * @param min -> erste Zahl
 * @param max -> zweite Zahl
 * @returns {number|*} -> liefert entweder -1 zurück, wenn min > max, min + random, wenn min<max oder min, wenn min==max
 */
function getRandom(min, max)
{
    if (min > max)
    {
        return -1;
    }
    if (min === max)
    {
        return min;
    }
    return min + parseInt(Math.random() * (max - min + 1));
}

/**
 * Diese Funktion ist nun für einen Spielzug zuständig. Zuerst wird die aufgedeckte
 * Karte in ein Array gespeichert. Wenn zwei Karten aufgedeckt wurde, werden alle
 * anderen Karten deaktiviert (bzw. der Click Handler gelöscht), dann werden die Karten
 * geprüft und schließlich alle Karten wieder aktiviert (bzw. Click Handler registriert)
 * @param e -> geklickte Karte (bzw. geklicktes div)
 */
function proceedCard(e)
{
    let clickedCard = e.currentTarget.childNodes;
    //geklickte Karte anzeigen
    $(clickedCard[0]).fadeIn(300);

    //hier sollte eigentlich der Handler für die geklickte Karte
    //gelöst werden - funktioniert aber leider nicht :(
    $(clickedCard[0]).parent().addClass("currentCard");
    //console.log($(".divs.currentCard"));
    //$(document).off(".divs.currentCard");

    //Speichert die geöffnete Karte in das Array
    openCards.push(clickedCard);
    console.log("Card pushed on array");

    if (openCards.length === 2)
    {
        disableCards();
        checkCards(openCards);
        $(openCards[0]).parent().removeClass("currentCard");
        $(openCards[1]).parent().removeClass("currentCard");

        openCards.length = 0;
        enableCards();
    }
}

/**
 * Die Funktion überprüft die Karte anhand deren src-Werte.
 * @param openCards -> Array mit den geöffneten Karten
 */
function checkCards(openCards)
{
    if ($(openCards[0]).attr("src") === $(openCards[1]).attr("src"))
    {
        //Wenn Übereinstimmung, dann wird die Funktion 'match' aufgerufen
        match(openCards);
    }
    else
    {
        //wenn keine Übereinstimmung, wird die Karte nach 0.5s wieder verdeckt
        window.setTimeout(function ()
        {
            hideCards()
        }, 500);
    }
    counter++;
}

/**
 * Diese Funktion löscht bei den beiden Karten die Klasse "hidden" und "currentCard" und
 * fügt die Klasse "openPair" hinzu
 * @param openCards -> Array mit den geöffneten Karten
 */
function match(openCards)
{
    $(openCards[0]).removeClass("hidden", "currentCard").parent().attr("class", "openPair");
    $(openCards[1]).removeClass("hidden", "currentCard").parent().attr("class", "openPair");
    checkIfFinished();
}

/**
 * Diese Funktion blendet die Bilder der Karten mit der Klasse "hidden" aus.
 */
function hideCards()
{
    $(".hidden").fadeOut(300);
}

/**
 * Diese Funktion prüft, ob es noch Karten gibt, die die Klasse "hidden" gibt.
 * Falls nein, werden die benötigten Züge mittels alert ausgegeben.
 */
function checkIfFinished()
{
    let leftPairs = $(".hidden").length
    console.log("Checked if finish");
    window.setTimeout(function ()
    {
        if (leftPairs === 0)
        {
            alert("Glückwunsch, du hast das Memory erfolgreich gelöst!\nDafür hast du " + counter + " Züge benötigt ;)");
        }
    }, 300);
}

/**
 * Diese Funktion deregistriert alle Klick Handler der Klasse "divs"
 */
function disableCards()
{
    $(document).off("click", ".divs");
}

/**
 * Diese Klasse registriert wieder Klick Handler auf allen Elementen mit der Klasse "divs"
 * und ruft die Funktion proceedCard auf ... ein neuer Zug/Durchgang beginnt
 */
function enableCards()
{
    window.setTimeout(function ()
    {
        $(document).on("click", ".divs", function (e)
        {
            proceedCard(e);
        });
    }, 800);
}