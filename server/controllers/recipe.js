const sampleData = require("../data/sample_recipe_data.json");

// Only used when getting a specific recipe (id will be provided)
exports.getRecipe = (req, res, next) => {
  console.log(req.query);

  /*
    Query params:
    id: id of recipe
  */

  res.json(sampleData).status(200);
};

exports.postRecipe = (req, res, next) => {
  /*
    request body will have the following:
    type: url | manual
    recipe: url | recipe json
    tags: [recipeTag]

    if the type is url then the recipe json will be generated from the url and added to the database with the tags
    if the type is manual then the recipe 
  */

  res.status(200);
};
