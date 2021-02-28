/**
 * @author Michael Eder (S1910456008)
 */

export default class ShoppingListManagement
{
    constructor()
    {
        this.allLists = new Map();
        this.allPersons = new Map();
    }

    /**
     * This method adds a shoppingList to the shoppingListManagement
     * @param newShoppinglist the shoppingList which should be added
     */
    addShoppingListToManagement(newShoppinglist)
    {
        this.allLists.set(newShoppinglist.shoppingListId, newShoppinglist);
    }

    /**
     * This method adds a Person to the shoppinngListManagement
     * @param newPerson the person, which should be added
     */
    addPersonToManagement(newPerson)
    {
        this.allPersons.set(newPerson.personId, newPerson);
    }

    /**
     * This method searches for an shoppingList by a given name
     * @param shoppingListName the name of the shoppingList which should be searched for
     * @returns shoppingList as object if found
     */
    getShoppingListByName(shoppingListName)
    {
        for (let shoppingList of this.allLists.values())
        {
            if (shoppingList.shoppingListName === shoppingListName)
            {
                return shoppingList;
            }
        }
        console.log("Fehler: Klasse shoppingListManagement, Funktion: getShoppingListByName - Liste nicht gefunden");
    }

    /**
     * This method prints all the shoppingLists in shoppingListManagement into HTML
     * @param target the target, the shoppingList should be printed in HTML
     */
    printAllShoppingLists(target)
    {
        for (let shoppingLists of this.allLists.values())
        {
            shoppingLists.printShoppinglist(target);
        }
    }

    /**
     * This method deletes an shoppingList from shopping ListManagement
     * @param shoppingListId the id of the shoppingList which should be deleted
     * @returns {boolean} true, if the shoppingList was found and deleted, else false
     */
    deleteList(shoppingListId)
    {
        return this.allLists.delete(shoppingListId);
    }

    /**
     * This function formats a given date into "DD.MM.YYY"
     * @param unformattedDate a date which is not formatted
     * @returns {string} return formatted date as string
     */
    formatDate(unformattedDate)
    {
        let date = new Date(unformattedDate);
        let day = date.getDate();
        let month = (date.getMonth() + 1);
        let year = date.getFullYear();
        if (day < 10)
        {
            day = ('0' + day);
        }
        if (month < 10)
        {
            month = ('0' + month);
        }
        return (day + "." + month + "." + year);
    }
}