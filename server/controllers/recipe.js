// Requirements
const scraper = require("recipe-scrapper");

// Schema
const recipeSchema = require("../models/recipe").recipeSchema;
const { default: mongoose } = require("mongoose");

// Temp data
const sampleData = require("../data/sample_recipe_data.json");

exports.getRecipes = (req, res, next) => {
  const filter = req.query.filter;
  const limit = req.query.limit;

  const RecipeModel = mongoose.model("Recipe", recipeSchema);

  // Add filter implementation later
  RecipeModel.find()
    .limit(limit)
    .then((recipeDocuments) => {
      return recipeDocuments.map((recipeDocument) => {
        return recipeDocument.toJSON();
      });
    })
    .then((structuredRecipeData) => {
      res.json(structuredRecipeData).status(200);
    })
    .catch((err) => {
      console.log("An error occured in GET /recipes");
    });
};

// Gets a specific recipe and/or field within the recipe
exports.getRecipeById = (req, res, next) => {
  const id = req.params["id"];
  const RecipeModel = mongoose.model("Recipe", recipeSchema);
  RecipeModel.findById(id)
    .then((recipeData) => {
      const formattedData = recipeData.toJSON();

      if (req.params[0]) {
        const keys = req.params[0].slice(1).split("/"); // Array of the keys one after the other (e.g. ["ingredientGroups", 0, "ingredients"])
        console.log(keys);
        let element = formattedData;
        keys.forEach((key) => {
          key = !isNaN(parseInt(key)) ? parseInt(key) : key;

          try {
            element = element[key];
            // console.log(element);
          } catch (err) {
            res.status(400);
            return;
          }
        });
        res.json(element).status(200);
        console.log(`Sent:\n ${element}`);
        return;

        // const detailJson = JSON.parse(`"result": ${}`);
        res.json(req.params);
      } else {
        res.json(formattedData).status(200);
        console.log(`Sent recipe: ${formattedData._id}`);
      }
    })
    .catch((err) => {
      console.log("An error occured in GET /recipes/fetchRecipeById");
      res.status(400);
    });
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
    const RecipeModel = mongoose.model("Recipe", recipeSchema);

    const recipeData = { ...recipeJson };
    if (recipeData["id"]) {
      delete recipeData["id"];
    }

    const recipe = new RecipeModel(recipeData);
    recipe.save().then(() => console.log(recipe));

    // Return the id of the newly generated json

    res.json(recipeJson).status(200);
  });
};
