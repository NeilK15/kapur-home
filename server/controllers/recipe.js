// Requirements
const scraper = require("recipe-scrapper");

// Temp data
const sampleData = require("../data/sample_recipe_data.json");

// Only used when getting a specific recipe (id will be provided)
exports.getRecipeById = (req, res, next) => {
  console.log(req.query);

  /*
    Query params:
    id: id of recipe
  */

  res.json(sampleData).status(200);
};

exports.postRecipeByUrl = (req, res, next) => {
  /*
    request body will have the following:
    recipe: url
    tags: [recipeTag]

    if the type is url then the recipe json will be generated from the url and added to the database with the tags
    if the type is manual then the recipe 
  */

  // Check for the proper body elements
  const url = req.body["request-url"];

  if (!url) {
    res.status(400);
  }

  console.log(req.body);

  // Generate the recipe json
  const recipeJson = scraper.fetchRecipeFromUrl(url, (recipeJson) => {
    if (!recipeJson) {
      res.status(500);
    }

    // Add the json file to the database

    // Return the id of the newly generated json

    res.json(recipeJson).status(200);
  });
};
