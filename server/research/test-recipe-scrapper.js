const scraper = require("recipe-scrapper");

const recipeObj = scraper.fetchRecipeFromUrl("https://www.veganricha.com/spicy-peanut-butter-ramen/");

console.log(recipeObj);
