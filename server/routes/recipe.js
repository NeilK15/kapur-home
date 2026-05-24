const express = require("express");
const router = express.Router();

// Controller
const recipeController = require("../controllers/recipe");

router.get("/", recipeController.getRecipes);

router.put("/:id", recipeController.putRecipe);

router.post("/", recipeController.postRecipe);

router.get("/:id*", recipeController.getRecipe);

router.delete("/:id", recipeController.deleteRecipe);

module.exports = router;
