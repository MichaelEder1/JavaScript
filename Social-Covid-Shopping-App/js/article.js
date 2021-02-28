/**
 * @author Michael Eder (S1910456008)
 */

let articleId = 0;

export default class Article {
	constructor(articleName, articleQuantity, maxPrice) {
		this.articleName = articleName;
		this.articleQuantity = articleQuantity;
		this.articleMaxPrice = maxPrice;
		this.articleId = articleId;
		articleId++;
	}

	/**
	 * This method generates an HTML output-string for an article
	 * @returns {string} article as HTML in a string
	 */
	printArticle() {
		return (`
		 <div class="flex-table row">
			<div class="flex-row articles"><span class="articleQuantity">${this.articleQuantity}</span></div>
			<div class="flex-row articles"><span class="articleName">${this.articleName}</span></div>
			<div class="flex-row articles"><span class="articleMaxPrice">${this.articleMaxPrice}</span></div>
			<span class="seeker editIcons"><i class="deleteIcon editArticle fas fa-trash"></i><i class="editIcon editArticle fas fa-edit"></i></span>
		 </div>`);
	}
}