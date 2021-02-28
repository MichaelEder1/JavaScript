$(document).ready(function ()
{
    $(document).on("click", ".addToCart", function (e)
    {
        addToCart(e);
    });
});

//Diese Funktion liest alle Informationen des angeklicken Artikels aus und
//fügt ihn, wenn es ihn noch nicht gibt, dem Warenkorb hinzu.
function addToCart(e)
{
    //Werte aus dem geklickten Artikel auslesen
    let article = $(e.currentTarget).parent("div");
    let articleImageSrc = article.find("img").attr("src");
    let articleDescription = article.find(".description").text();
    let articlePrice = article.find(".price").text();

    //Produkt dem Warenkorb hinzufügen oder Anzahl erhöhen
    hasCart();
    checkIfArticleIsAlreadyInShoppingCart(articleImageSrc, articleDescription, articlePrice);
}

//Diese Funktion legt beim ersten Hinzufügen eines Elements den Warenkorb an
function hasCart()
{
    if ($("#shoppingCart").length === 0)
    {
        let newShoppingCartSection =
            `<div id="shoppingCart">
                <fieldset class="form-group">
                  <legend>Warenkorb</legend>
                  <div id="cartElements">
                  </div>
                  <p id="totSum">Gesamtpreis: <span id="totalSum"></span>€</p>
                  <button type="button" id="order" class="btn btn-success">Bestellen</button>
                </fieldset>
            </div>`;
        //Warenkorb nach Tabs einfügen
        $("#tabs").after(newShoppingCartSection);
    }
}

//Diese Funktion prüft, ob es den Artikel bereits im Warenkob gibt, wenn nicht wird er hinzugefügt
function checkIfArticleIsAlreadyInShoppingCart(articleImage, articleDescription, articlePrice)
{
    //alle Artikelbezeichnungen aus dem Warenkorb auslesen
    let allDescriptions = $("#shoppingCart").find(".description");
    for (let article of allDescriptions)
    {
        if (article.innerHTML === articleDescription)
        {
            //wenn wir hier reingehen, gibt es den Artikel bereits im Warenkorb
            //wir erhöhen die Anzahl
            increaseNumberOfPieces(article);
            //wir updaten den Artikelpreis (Anzahl * Menge)
            updateArticlePrices(article, articlePrice);
            return;
        }
    }
    //Wenn es den Artikel noch nicht gibt, wird er dem Warenkorb hier hinzugefügt
    addArticleToShoppingCart(articleImage, articleDescription, articlePrice);
    //Anschließend wird die Gesamtsumme neu berechnet
    calculateTotalSum();
}

//Diese Funktion fügt den Artikel dem Warenkorb hinzu
function addArticleToShoppingCart(articleImage, articleDescription, articlePrice)
{
    let newArticle =
        `<div class="product">
                <img src="${articleImage}" width="300" alt="${articleDescription}">
                <p class="description">${articleDescription}</p>
                <p>Anzahl: <span class="amount">1</span></p>
                <p>Preis: <span class="price">${articlePrice}</span>€</p>
            </div>`;

    $("#cartElements").append(newArticle);
}

//Diese Funktion erhöht die Anzahl im Warenkorb um 1, wenn es den Artikel bereits im Warenkorb gibt
function increaseNumberOfPieces(article)
{
    //erhalte die aktuelle Anzahl eines Artikels im Warenkorb und zähle 1 dazu
    let value = parseInt($(article).next().find(".amount").text(), 10) + 1;

    //aktualisiere Text bei "Anzahl"
    $(article).next().find(".amount").text(value);
}

//Diese Funktion berechnet den neuen Gesampreis eines Artikels, wenn sich die Anzahl erhöht
function updateArticlePrices(article, articlePrice)
{
    //Aktualisiere Gesamtpreis bei Einzelartikel
    let value = parseInt($(article).next().next().find(".price").text(), 10) + Number(articlePrice);
    $(article).next().next().find(".price").text(value);

    calculateTotalSum();
}

//Diese Funktion berechnet die Gesamtsumme für alle Artikel im Warenkorb
function calculateTotalSum()
{
    let sum = 0;
    let allArticleSums = $("#shoppingCart").find(".price");
    for (let articles of allArticleSums)
    {
        sum += Number(articles.innerHTML);
    }
    $("#totalSum").text(sum);
}