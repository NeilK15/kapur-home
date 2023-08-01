const express = require("express");
const cors = require("cors");
const router = express.Router();

// Controller
const recipeController = require("../controllers/recipe");

router.use(cors());
router.use(express.json());

router.get("/", recipeController.getRecipes);

router.put("/:id", recipeController.putRecipe);

router.post("/", recipeController.postRecipe);

router.get("/:id*", recipeController.getRecipe);

router.delete("/:id", recipeController.deleteRecipe);

module.exports = router;
