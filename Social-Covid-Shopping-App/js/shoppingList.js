/**
 * @author Michael Eder (S1910456008)
 */

let idOfShoppingList = 0;

export default class ShoppingList
{
    constructor(name, person, createdOn, dueDate)
    {
        this.articles = new Map();
        this.createdBy = person;
        this.createdOn = createdOn;
        this.shoppingListName = name;
        this.dueDate = dueDate;
        this.shoppingListId = idOfShoppingList;
        this.takenOverBy = undefined;
        this.totalSum = undefined;
        this.shoppingListState = 0; //0 = open | 1 = locked | 2 = taken over | 3 = finished
        idOfShoppingList++;
    }

    /**
     * This method adds an article to the shoppingList
     * @param article the article which should be added
     */
    addArticleToShoppingList(article)
    {
        this.articles.set(article.articleId, article);
    }

    /**
     * This method returns the id of an shoppingList
     * @returns {number} the shoppingList's id
     */
    getShoppingListId()
    {
        return this.shoppingListId;
    }

    /**
     * This method returns the creator of an shoppingList
     * @returns {*} creator of a shoppingList as Person object
     */
    getCreator()
    {
        return this.createdBy;
    }

    /**
     * This method returns the state of an shoppingList
     * @returns {number} the current state of a shoppingList
     */
    getShoppingListState()
    {
        return this.shoppingListState;
    }

    /**
     * This method sets the state of the shoppingList
     * @param state the state the list should be set to
     */
    setShoppingListState(state)
    {
        this.shoppingListState = state;
    }

    /**
     * this method sets the totalSum of the shoppingList
     * @param sum the totalsum
     */
    setTotalSum(sum)
    {
        this.totalSum = sum;
    }

    /**
     * This method checks, if an shoppingList is open or not
     * @returns {boolean} true, if shoppingList state = 0 (open), else false
     */
    shoppingListIsEditable()
    {
        return this.shoppingListState === 0;
    }

    /**
     * This method deletes an article from a shoppingList
     * @param article the article which should be deleted
     */
    deleteArticleFromShoppingList(article)
    {
        this.articles.delete(article.articleId);
    }

    /**
     * This method prints the shoppingList into HTML
     */
    printShoppinglist(target)
    {
        //Ausgabe Überblick + Header Detailview
        let htmlCode = `
		<div class="listEntry">
			<i class="icon fas fa-lock-open" title="Liste offen"></i>
			<h3 class="nameOfListCreator">${this.createdBy.firstName + ' ' + this.createdBy.lastName}</h3>
			<h4 class="nameOfList">${this.shoppingListName}</h4>
			<p class="Articles"><span class="numberOfArticles">${this.articles.size}</span> Artikel</p>
			<a class="linkDetailView">Details ansehen</a>
		</div>
		
		<div class="detailView">
		<h2>Liste von <span class="createdBy">${this.createdBy.firstName + ' ' + this.createdBy.lastName}</span> - <span class="nameOfShoppingList">${this.shoppingListName}</span><span class="seeker editIcons"><i class="editList editIcon fas fa-edit"></i></span></h2>
			<div class="listInfo">
				<div class="listInfoArticles">Artikel: <span class="listInfoArtictlesNumberOfItems">${this.articles.size}</span></div>
				<div class="listInfoCreatedOn">erstellt am: <span class="listInfoCreatedOnDate">${this.createdOn}</span></div>
				<div class="listInfoDueDate">erfüllen bis: <span class="listInfoDueDateDate">${this.dueDate}</span> <span class="seeker editIcons"><i class="editList editIcon fas fa-edit"></i></span></div>
			</div>

		<div class="tableContainer">
			<div class="flex-table header">
				<div class="flex-row headings">Anzahl/Einheit</div>
				<div class="flex-row headings">Artikel</div>
				<div class="flex-row headings">max. Kosten (in €)</div>
			</div>`;

        for (let article of this.articles.values())
        {
            htmlCode += article.printArticle()
        }
        htmlCode += `
				<span class="buttonContainer">
            		<button class="button editButton detailView seeker" type="button">Liste bearbeiten</button>
            		<button class="button deleteButton detailView seeker" type="button">Liste löschen</button>
            		<button class="button takeOverButton detailView helper" type="button">Liste &uuml;bernehmen</button>
        		</span>
				<div class="totalAmount helper takenOver">
					<label for="inputTotalAmount">Gesamtpreis (in €): </label>
					<input type="number" class="input inputTotalAmount detailview" id="inputTotalAmount" min="0" placeholder="Gesamtpreis ..." required>
					<button type="submit" class="button submitButton detailView">abschicken</button>
				</div>
			</div>`;

        target.append(htmlCode);
    }
}