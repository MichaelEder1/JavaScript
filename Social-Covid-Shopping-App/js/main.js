/**
 * @author Michael Eder (S1910456008)
 */

import Person from "./person.js";
import ShoppingList from "./shoppingList.js";
import ShoppingListManagement from "./shoppingListManagement.js";
import Article from "./article.js";

let shoppingListManagement = new ShoppingListManagement();
//creating standard user for creating lists or takeover lists
let currentUser = new Person("Michael", "Eder", "1");

$(document).ready(function ()
{
    init();
});

/**
 * This function reads initial data for person, article
 * and shopping list from a JSON file, stores them in
 * shoppingListManagement and prints them in HTML.
 */
function init()
{
    $.getJSON("data_covidSocialShoppingApp.json", function (data)
    {
        for (let elem of data.elements)
        {
            let newPerson = new Person(elem.firstName, elem.lastName, elem.job);
            shoppingListManagement.addPersonToManagement(newPerson);
            for (let list of elem.shoppingList)
            {
                let newShoppingList = new ShoppingList(list.shoppingListName, newPerson, list.createdOn, list.dueDate);
                shoppingListManagement.addShoppingListToManagement(newShoppingList);
                for (let article of list.article)
                {
                    let newArticle = new Article(article.articleName, article.articleQuantity, article.maxPrice)
                    newShoppingList.addArticleToShoppingList(newArticle);
                }
            }
        }
        let target = $('#listContainer');
        shoppingListManagement.printAllShoppingLists(target);

        //hide all detailView divs
        $("div.detailView").hide();
        //register Click-Handlers
        registerClickHandler();
        //by default show seeker mode
        $(".helper").hide();
        //by default hide edit icons
        $(".editIcons i").hide();
    });
}

/**
 * This function registers all the clickHandlers on all elements dynamically
 */
function registerClickHandler()
{
    $("body").on("click", "a.linkDetailView", function (e)
    {
        showDetailView(e.currentTarget)
    });

    $("body").on("click", ".switch", function ()
    {
        switchView();
    });

    $("body").on("click", ".deleteButton", function (e)
    {
        deleteShoppingList(e.currentTarget);
    });

    $("body").on("click", ".editButton", function (e)
    {
        showEditSymbols(e.currentTarget);
    });

    $("body").on("click", ".deleteIcon", function (e)
    {
        deleteArticle(e.currentTarget);
    });

    $("body").on("click", ".takeOverButton", function (e)
    {
        takeOverList(e.currentTarget);
    });

    $("body").on("click", ".submitButton", function (e)
    {
        finishList(e.currentTarget);
    });

    $("body").on("click", ".editIcon.editArticle", function (e)
    {
        editArticle(e.currentTarget);
    });

    $("body").on("click", ".editList.editIcon", function (e)
    {
        editList(e.currentTarget)
    });

    $("body").on("click", ".submitForm", function (e)
    {
        e.preventDefault();
        createNewList();
    });
}


/**
 * This method searches the right list by name and then gets its id.
 * After all it deletes the shoppingList which belongs to the found id
 * (if not blocked/already taken over/finished)
 * @param clickedShopingList the target, the delete button was clicked
 */
function deleteShoppingList(clickedShopingList)
{
    //delete from datamodell
    let nameOfShoppingList = $(clickedShopingList).parents(".detailView").find(".nameOfShoppingList").text();
    let shoppingList = shoppingListManagement.getShoppingListByName(nameOfShoppingList);
    if (shoppingList && shoppingList.shoppingListIsEditable())
    {
        shoppingList.setShoppingListState(1);
        if (confirmDelete("shoppingList", nameOfShoppingList))
        {
            deleteShoppingListFromHTML(nameOfShoppingList);
            shoppingListManagement.deleteList(shoppingList.shoppingListId);
        }
    }
}

/**
 * This method opens up a dialog in which the user must confirm,
 * if he/she wants to delete an article/list.
 * @param object list or article --> what triggered this confirmation
 * @param text name of the list or the article
 * @returns {boolean} return true if user confirms delete action, else false
 */
function confirmDelete(object, text)
{
    let question;
    if (object === "shoppingList")
    {
        question = "Wollen Sie die Liste \"" + text + "\" wirklich löschen?";
    }
    else if (object === 'article')
    {
        question = "Wollen Sie den Artikel \"" + text + "\" wirklich löschen?";
    }
    return confirm(question);
}

/**
 * This method deletes a shoppingList and its detailview from html
 * @param nameOfShoppingList name of the shoppinglist which should be deleted
 */
function deleteShoppingListFromHTML(nameOfShoppingList)
{
    let allListsInHTML = $(".listEntry");
    for (let list of allListsInHTML)
    {
        let listName = $(list).find(".nameOfList").text();
        if (nameOfShoppingList === listName)
        {
            $(list).next(".detailView").remove();
            $(list).remove();
            break;
        }
    }
}

/**
 * This method toggles the detailview of every shoppingList
 * Furthermore it changes the label-text depending on the toggle state
 * @param clickedShoppingList the link clicked in the shoppingList
 */
function showDetailView(clickedShoppingList)
{
    $(clickedShoppingList).parents(".listEntry").next(".detailView").fadeToggle(250);
    let label = $(clickedShoppingList);
    if (label.text() === "Details ansehen")
    {
        label.text("Details ausblenden");
    }
    else
    {
        label.text("Details ansehen");
    }
}

/**
 * This function switches between the helper and helpseeker view.
 */
function switchView()
{
    let currentView = $(".labelJob");
    if (currentView.text() === 'Helfer')
    {
        $(".seeker").hide();
        $(".helper").show();
        currentView.text("Hilfesuchender");
    }
    else
    {
        $(".seeker").show();
        $(".helper").hide();
        currentView.text("Helfer");
    }
}

/**
 * This method dynamically toggles the editIcons on/off when clicked on "Liste bearbeiten"
 * @param clickedShoppingList
 */
function showEditSymbols(clickedShoppingList)
{
    $(clickedShoppingList).parents(".detailView").find(".editIcons i").toggle();
    let clickedListName = $(clickedShoppingList).parents(".detailView").prev(".listEntry").children(".nameOfList").text();
    let shoppingList = shoppingListManagement.getShoppingListByName(clickedListName);
    if (shoppingList && shoppingList.shoppingListIsEditable())
    {
        if ($(clickedShoppingList).text() === "Liste bearbeiten")
        {
            $(clickedShoppingList).text("Änderungen Speichern");
        }
        else
        {
            $(clickedShoppingList).text("Liste bearbeiten");
            //Save changes
            saveChanges(clickedShoppingList, shoppingList);
        }
    }
}

/**
 * This function deletes an article of a shoppingList from datamodel and HTML
 * @param clickedArticle the target of the clicked delete icon to identify the article row
 */
function deleteArticle(clickedArticle)
{
    let clickedListName = $(clickedArticle).parents(".detailView").prev(".listEntry").children(".nameOfList").text();
    let articleName = $(clickedArticle).parents("div.flex-table.row").find(".articleName").text();
    let articleQuantity = $(clickedArticle).parents("div.flex-table.row").find(".articleQuantity").text();
    let articleMaxPrice = $(clickedArticle).parents("div.flex-table.row").find(".articleMaxPrice").text();
    let shopppingList = shoppingListManagement.getShoppingListByName(clickedListName);

    if (shopppingList && shopppingList.shoppingListIsEditable())
    {
        if (confirmDelete("article", (articleName + ", Menge: " + articleQuantity + ", max. Preis: " + articleMaxPrice)))
        {
            deleteArticleFromDataModell(shopppingList, articleName, articleQuantity, articleMaxPrice);
            $(clickedArticle).parents("div.flex-table.row").remove();
        }
    }
}

/**
 * This function deletes an Article from the datamodel
 * @param shopppingList the shoppingList as object
 * @param articleName the article name
 * @param articleQuantity the article quantity
 * @param articleMaxPrice the article max price
 */
function deleteArticleFromDataModell(shopppingList, articleName, articleQuantity, articleMaxPrice)
{
    //get Article as Object
    for (let article of shopppingList.articles.values())
    {
        if (articleName === article.articleName)
        {
            if (articleQuantity === article.articleQuantity)
            {
                if (articleMaxPrice == article.articleMaxPrice)
                {
                    shopppingList.deleteArticleFromShoppingList(article);
                }
            }
        }
    }
}

/**
 * This method is responsible for taking over a list by clicking the button "Liste übernehmen".
 * It saves the user, who takes the list into the shoppingList, and disables all the editing
 * options on helpseekers site for this specific list.
 * @param clickedList the target within the clicked shoppingList
 */
function takeOverList(clickedList)
{
    let clickedListName = $(clickedList).parents(".detailView").prev(".listEntry").children(".nameOfList").text();
    let shoppingList = shoppingListManagement.getShoppingListByName(clickedListName);
    if (shoppingList && shoppingList.shoppingListIsEditable())
    {
        shoppingList.setShoppingListState(2);
        shoppingList.takenOverBy = currentUser;
        //disable any forms of interaction for helpseekers (buttons, ...)
        $(clickedList).parent().children(".seeker").prop("disabled", "true");
        $(clickedList).hide();
        $(clickedList).parent().children(".helper").removeClass("helper");
        $(clickedList).parent().siblings(".takenOver").show().addClass("helper");
        updateState(clickedList, shoppingList);
    }
}

/**
 * This method updates the state of the list. Usually it is called when there was an edit on the list,
 * like the list got taken over or the list has been finished by someone.
 * It changes the icon based on current state.
 * @param clickedList the target within the clicked shoppingList
 * @param shoppingList the shoppingList as data object
 */
function updateState(clickedList, shoppingList)
{
    let stateTag = $(clickedList).parents(".detailView").prev(".listEntry").children(".icon");
    switch (shoppingList.getShoppingListState())
    {
        case 0:
            stateTag.removeClass();
            stateTag.addClass("icon fas fa-lock-open");
            stateTag.attr("title", "Liste offen");
            break;
        case 1:
            stateTag.removeClass();
            stateTag.addClass("icon fas fa-lock");
            stateTag.attr("title", "Liste gesperrt");
            break;
        case 2:
            stateTag.removeClass();
            stateTag.addClass("icon fas fa-user-lock");
            stateTag.attr("title", "Liste übernommen");
            break;
        case 3:
            stateTag.removeClass();
            stateTag.addClass("icon fas fa-flag-checkered");
            stateTag.attr("title", "Liste abgeschlossen");
            break;
        default:
            console.log("ungültiger State - main.js/updateState()");
    }
}

/**
 * This method is called when somebody finishs a list by clicking "Liste abschließen".
 * This is only possible, if the list has state 3 (= taken over by someone) and a totalSum
 * has been entered in the corresponding input field. After that, all interactive elements,
 * such as buttons or input fields, will beocme inactive/disabled.
 * @param clickedList the clicked target within a list
 */
function finishList(clickedList)
{
    let clickedListName = $(clickedList).parents(".detailView").prev(".listEntry").children(".nameOfList").text();
    let shoppingList = shoppingListManagement.getShoppingListByName(clickedListName);
    let totalSum = $(".inputTotalAmount").val()
    if (shoppingList && shoppingList.getShoppingListState() === 2)
    {
        (console.log("in if"));
        if (totalSum)
        {
            (console.log("in zweiter if"));
            shoppingList.setTotalSum(totalSum);
            //$(clickedList).remove();
            console.log($(clickedList).prev);
            shoppingList.setShoppingListState(3);
            updateState(clickedList, shoppingList);
        }
    }
}

/**
 * This function enables the user to edit articles on the list. It sets the attribute "contentEditable"
 * to true for all text elements the user wants to edit.
 * @param clickedArticle the symbol at the article, which was clicked
 */
function editArticle(clickedArticle)
{
    let clickedListName = $(clickedArticle).parents(".detailView").prev(".listEntry").children(".nameOfList").text();
    let shoppingList = shoppingListManagement.getShoppingListByName(clickedListName);
    if (shoppingList && shoppingList.shoppingListIsEditable())
    {
        //allow to edit entry (-> contentEditable = true)
        $(clickedArticle).parents(".flex-table.row").children(".flex-row").children("span").attr("contentEditable", "true");
    }
}

/**
 * This function enables the user to edit list information (name, due date).
 * It sets the attribute "contentEditable" to true for all text elements the user wants to edit.
 * @param clickedList the symbol at the list, which was clicked
 */
function editList(clickedList)
{
    let clickedListName = $(clickedList).parents(".detailView").prev(".listEntry").children(".nameOfList").text();
    let shoppingList = shoppingListManagement.getShoppingListByName(clickedListName);
    if (shoppingList && shoppingList.shoppingListIsEditable())
    {
        $(clickedList).parent("span").prev("span").attr("contentEditable", "true");
    }
}

/**
 * This method saves any changes made by the user into the datamodell.
 * First, it deletes the clicked list from the datamodell. Then it
 * gets all the data from HTML and creates a new list from this data
 * and stores it into shoppingListManagement. After that, listContainer
 * will be emptied and  all shopping Lists will be printend to HTML.
 * @param clickedSaveButton the button, which was clicked
 * @param shoppingList the shoppingList as Object
 */
function saveChanges(clickedSaveButton, shoppingList)
{
    shoppingListManagement.deleteList(shoppingList.getShoppingListId());
    let target = $("#listContainer");
    //ShoppingListe anlegen
    let shoppingListData = $(clickedSaveButton).parents(".detailView");
    let createdBy = shoppingList.getCreator();
    let shoppingListName = shoppingListData.find(".nameOfShoppingList").text();
    let shoppingListDueDate = shoppingListData.find(".listInfoDueDateDate").text();

    let newShoppingList = new ShoppingList(shoppingListName, createdBy, shoppingListDueDate);
    shoppingListManagement.addShoppingListToManagement(newShoppingList);

    //Artikel der Shoppingliste hinzufügen
    let listArticles = $(clickedSaveButton).parents(".detailView").children(".tableContainer").find(".flex-table.row");

    for (let changes of listArticles)
    {
        $(changes).find("articles").attr("contentEditable", false);
        let articleName = $(changes).find(".articleName").text();
        let articleQuantity = $(changes).find(".articleQuantity").text();
        let articleMaxPrice = $(changes).find(".articleMaxPrice").text();
        let newArticle = new Article(articleName, articleQuantity, articleMaxPrice);
        newShoppingList.addArticleToShoppingList(newArticle);
    }
    //leere listContainer
    target.empty();
    //printList
    shoppingListManagement.printAllShoppingLists(target);
    $(".editIcon, .deleteIcon").hide();
    $(".detailView").toggle();
    switchView();
}


/**
 * This function creates a new shoppingList and prints it in HTML
 */
function createNewList()
{
    let target = $("#listContainer");
    let listName = $("body").find("#formlistName").val();
    let listDueDate = $("body").find("#formDueDate").val();
    if (listName !== "" || listDueDate !== "")
    {
        let newList = new ShoppingList(listName, currentUser, shoppingListManagement.formatDate(new Date), shoppingListManagement.formatDate(listDueDate));
        shoppingListManagement.addShoppingListToManagement(newList);
        //leere listContainer
        target.empty();
        //drucke alle Listen aus dem shoppingListManagement aus
        shoppingListManagement.printAllShoppingLists(target);
        $(".detailView").toggle();
        $(".editIcon, .deleteIcon").hide();
        switchView();
    }
    else
    {
        alert("Bitte einen Listennamen und ein Fälligkeitsdatum eingeben, um Liste zu erstellen!")
    }
}