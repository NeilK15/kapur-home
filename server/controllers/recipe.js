// Requirements
const scraper = require("recipe-scrapper");

// Schema
const recipeSchema = require("../models/recipe").recipeSchema;
const { default: mongoose } = require("mongoose");

exports.getRecipes = (req, res, next) => {
    const { limit, cookbookId } = req.query;
    const query = cookbookId ? { cookbookId } : {};

    const RecipeModel = mongoose.model("Recipe", recipeSchema);

    RecipeModel.find(query)
        .limit(limit)
        .then((recipeDocuments) => recipeDocuments.map((d) => d.toJSON()))
        .then((recipes) => res.status(200).json(recipes))
        .catch((err) => {
            console.error("An error occured in GET /recipes", err.message);
            res.status(500).json({ error: "Failed to fetch recipes" });
        });
};

// Gets a specific recipe and/or field within the recipe
exports.getRecipe = (req, res, next) => {
    const id = req.params["id"];
    const RecipeModel = mongoose.model("Recipe", recipeSchema);
    RecipeModel.findById(id)
        .then((recipeData) => {
            const formattedData = recipeData.toJSON();

            if (req.params[0]) {
                const elements = [];

                // Splitting between & keys
                const sets = req.params[0].slice(1).split("&");

                // Looping through each set of key(s) that is wanted
                sets.forEach((set) => {
                    // Splitting between more granular parts of the key
                    const keys = set.split("/"); // Array of the keys one after the other (e.g. ["ingredientGroups", 0, "ingredients"])
                    console.log(keys);
                    let element = formattedData;

                    // Looping through and grabbing the granular parts of the key
                    keys.forEach((key) => {
                        key = !isNaN(parseInt(key)) ? parseInt(key) : key;

                        try {
                            element = element[key];
                            if (!element) {
                                // Send bad request if any element requested is not in the recipe
                                res.status(400);
                                return;
                            }
                            // console.log(element);
                        } catch (err) {
                            res.status(400);
                            return;
                        }
                    });

                    // Pushing the element to the array
                    elements.push(element);
                });

                // If user only requested one key, only send that one
                if (elements.length == 1) {
                    res.json(elements[0]).status(200);
                    return;
                }

                res.json(elements).status(200);
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

exports.postRecipe = (req, res, next) => {
    const method = req.body["method"];
    console.log(`POST /recipes`);

    const RecipeModel = mongoose.model("Recipe", recipeSchema);

    switch (method) {
        case "url":
            console.log(`Adding recipe by url`);
            const url = req.body["url"].trim();
            if (!url) {
                res.status(400).json({
                    Error: "Please make sure a 'url' key value pair is provided {'url': '<url goes here>}",
                });
                return;
            }

            // First check if recipe already exists by querying for recipe with matching url
            const query = RecipeModel.where({ url: url });
            query
                .findOne()
                .then((recipe) => {
                    return recipe;
                })
                .then((recipe) => {
                    if (!recipe) {
                        // Generate the recipe json
                        scraper.fetchRecipeFromUrl(url, (recipeJson) => {
                            if (!recipeJson) {
                                res.status(500).json({
                                    Error: "Sorry, something happened while trying to get the recipe data from the url you provided",
                                });
                                return;
                            }

                            // Add the json file to the database
                            const RecipeModel = mongoose.model("Recipe", recipeSchema);

                            const recipeData = { ...recipeJson };
                            if (recipeData["id"]) delete recipeData["id"];
                            if (req.body["cookbookId"]) recipeData["cookbookId"] = req.body["cookbookId"];
                            recipeData["createdBy"] = req.userId;

                            const recipe = new RecipeModel(recipeData);
                            recipe
                                .save()
                                .then((recipe) => {
                                    res.status(200).json(recipe._id);
                                })
                                .catch((err) => {
                                    res.status(500).json({ Error: "There was an error storing your recipe" });
                                });
                        });
                    } else {
                        res.status(200).json(recipe._id);
                    }
                });

            break;
        case "manual":
            const recipeJson = req.body["recipe"];

            if (!recipeJson) {
                res.status(400).json({ Error: "Please make sure a 'recipe' key value pair is provided" });
                return;
            }

            new RecipeModel(recipeJson)
                .save()
                .then((recipe) => res.status(200).json(recipe._id))
                .catch(() => res.status(500).json({ Error: "There was an error storing your recipe" }));
            break;
        default:
            // One of the pre-determined methods was not used, send an error
            res.status(400).json({
                Error: "Ensure the 'method' property in your request body is correct ('url' | 'manual').",
            });
            return;
    }
};

exports.putRecipe = (req, res, next) => {
    const id = req.params["id"];
    const method = req.body["method"];
    console.log(`PUT /recipes/${id}`);

    const RecipeModel = mongoose.model("Recipe", recipeSchema);

    switch (method) {
        case "url":
            const url = req.body["url"];
            if (!url) {
                res.status(400);
            }

            // Run recipe scraper
            scraper.fetchRecipeFromUrl(url, (recipeJson) => {
                if (!recipeJson) {
                    res.json({
                        Error: "Sorry, something happened while trying to get the recipe data from the url you provided",
                    }).send(500);
                    return;
                }

                if (recipeJson["id"]) delete recipeJson["id"];

                // Updating the recipe
                RecipeModel.findByIdAndUpdate(id, recipeJson)
                    .then((smth) => {
                        if (!smth) {
                            return new RecipeModel(recipeJson).save().then((recipe) => {
                                console.log(`New recipe created with id ${recipe._id}`);
                                res.json(id).status(200);
                                return recipe;
                            });
                        } else return smth;
                    })
                    .then((recipe) => {
                        console.log(`PUT recipe with id ${recipe._id}`);
                    })
                    .catch((err) => {
                        console.log(err);
                        res.json({ Error: `There was an error while trying to edit ${id}` }).status(500);
                    });
                res.json(id).status(200);
                return;
            });
            break;
        case "manual":
            const recipeJson = req.body["recipe"];

            if (!recipeJson) {
                res.status(400).json({ Error: "Please make sure a 'recipe' key value pair is provided" });
                return;
            }

            RecipeModel.findByIdAndUpdate(id, recipeJson)
                .then(() => res.status(200).json(id))
                .catch(() => res.status(500).json({ Error: `There was an error updating recipe ${id}` }));
            break;
        default:
            // One of the pre-determined methods was not used, send an error
            res.json({
                Error: "Ensure the 'method' property in your request body is correct ('url' | 'manual').",
            }).status(400);
            return;
    }
};

exports.deleteRecipe = (req, res, next) => {
    const id = req.params["id"];

    const RecipeModel = mongoose.model("Recipe", recipeSchema);

    RecipeModel.findByIdAndDelete(id)
        .then((onFulfilled) => {
            console.log(`Successfully deleted: ${id}`);
            res.json({ Deleted: id }).status(200);
        })
        .catch((err) => {
            console.log(err);
            res.json({ Error: `An error occured while deleting recipe with id ${id}` }).status(500);
        });
};
